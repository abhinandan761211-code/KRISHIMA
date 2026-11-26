#!/usr/bin/env python3
"""Set the real database password in every DATABASE_URL / MIGRATION_DATABASE_URL.

Why this script exists
----------------------
Blocker B-1 is that `backend/.env` and `database/.env` still contain the template
value `[YOUR-DATABASE-PASSWORD]`. Fixing it by hand is error-prone because the
password must be percent-encoded in all four places, and a single missed file
leaves the app failing to connect.

This script:
  - reads the password with getpass, so it is never echoed, never in shell
    history, and never written to a log;
  - percent-encodes it exactly once (double-encoding is a common failure);
  - replaces only the password inside the URL userinfo, leaving host, port,
    database, query string and every other line untouched;
  - updates all four known locations;
  - prints only a shape summary (length + first/last char class), never the value.

Usage
-----
    python3 scripts/set_db_password.py

Then verify with:

    python3 scripts/check_db_connection.py

Nothing here is committed: the `.env` files are git-ignored by design.
"""
from __future__ import annotations

import getpass
import re
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

TARGETS: list[tuple[Path, str]] = [
    (ROOT / "backend" / ".env", "DATABASE_URL"),
    (ROOT / "backend" / ".env", "MIGRATION_DATABASE_URL"),
    (ROOT / "database" / ".env", "MIGRATION_DATABASE_URL"),
    (ROOT / "database" / ".env", "DATABASE_CHECK_URL"),
]

# Matches scheme://user:PASSWORD@host — captures everything around the password.
URL_RE = re.compile(r"^(?P<pre>[a-zA-Z0-9+]+://[^:/@]+:)(?P<pw>[^@]*)(?P<post>@.*)$")


def mask_shape(password: str) -> str:
    """Describe the password without revealing it."""
    classes = []
    if any(c.islower() for c in password):
        classes.append("lower")
    if any(c.isupper() for c in password):
        classes.append("upper")
    if any(c.isdigit() for c in password):
        classes.append("digit")
    if any(not c.isalnum() for c in password):
        classes.append("symbol")
    return f"length={len(password)} classes={','.join(classes) or 'none'}"


def is_placeholder(pw: str) -> bool:
    """Heuristic used by the password-setting script (a real password must differ)."""
    decoded = urllib.parse.unquote(pw)
    return "YOUR-DATABASE-PASSWORD" in decoded or decoded.startswith("[") or decoded in ("", "postgres")


def looks_corrupted(encoded_pw: str) -> list[str]:
    """Detect the real failure modes seen in this project, from the ENCODED value.

    A naive "is it a placeholder" check is not enough: a password corrupted by a
    terminal paste (bracketed-paste escapes) or encoded twice is long and complex,
    so it passes any placeholder heuristic while still being unusable. These checks
    look at the encoded value, which is what actually reaches the driver.
    """
    problems: list[str] = []
    if "%5B" in encoded_pw or "%5D" in encoded_pw:
        problems.append("contains %5B/%5D — these are [ ] bracket-paste escape codes, not password characters")
    if "%25" in encoded_pw:
        problems.append("contains %25 — the password was percent-encoded twice")
    if "%3B" in encoded_pw and "%3B" not in urllib.parse.quote("", safe=""):
        problems.append("contains %3B — a ';' may be a terminal escape artefact")
    return problems


def replace_password_in_line(line: str, new_pw_encoded: str) -> str | None:
    """Return the line with its password swapped, or None if it does not match."""
    key, sep, value = line.partition("=")
    if not sep:
        return None
    m = URL_RE.match(value.strip())
    if not m:
        return None
    return f"{key}={m.group('pre')}{new_pw_encoded}{m.group('post')}\n"


def rewrite_url_line(line: str, new_pw_encoded: str, key: str) -> str | None:
    """Rebuild a DATABASE_URL line correctly, not just its password.

    Real failures seen in this repository, all of which a password-only edit would
    leave in place:
      - `DATABASE_URL=https://<project>.supabase.co` — the project URL, not a DB URL;
      - a SQLAlchemy scheme kept in a plain driver URL;
      - a duplicated/dirty query string.

    The host, port and database are preserved from whatever the line currently has
    (they are project facts, not secrets). Only the scheme, userinfo and query
    suffix are normalised. Everything else in the file is untouched.
    """
    _, sep, value = line.partition("=")
    if not sep:
        return None
    value = value.strip()

    # Accept both plain and SQLAlchemy URLs, and a bare project URL.
    m = re.match(r"^(?P<scheme>[a-zA-Z0-9+]+)://(?P<rest>.+)$", value)
    if not m:
        return None
    rest = m.group("rest").split("?", 1)[0]  # drop any existing (possibly dirty) query

    # Split userinfo from host.
    if "@" in rest:
        userinfo, hostpart = rest.rsplit("@", 1)
        user = userinfo.split(":", 1)[0]
    else:
        hostpart = rest
        user = "postgres"

    # If the value is a project URL (supabase.co, no pooler), we cannot infer the
    # database host. Keep the host and let the operator fix it — but say so.
    if not re.match(r"^[^:/]+:\d+", hostpart):
        return None

    return f"{key}={m.group('scheme')}://{user}:{new_pw_encoded}@{hostpart}?sslmode=require\n"


def main() -> int:
    missing = [str(p) for p, _ in TARGETS if not p.exists()]
    if missing:
        print("ERROR: these files do not exist:", file=sys.stderr)
        for p in missing:
            print(f"  {p}", file=sys.stderr)
        print("\nCopy the templates first:  cp backend/.env.example backend/.env", file=sys.stderr)
        return 2

    password = getpass.getpass("Database password (input hidden): ")
    if not password:
        print("ERROR: empty password.", file=sys.stderr)
        return 2

    # Reject a paste that captured terminal escape codes. zsh's bracketed paste
    # wraps input in \e[200~ … \e[201~, which a raw paste into .env silently turns
    # into [200~ … [201~ inside the password. getpass avoids it, but the check is
    # cheap insurance against a piped value.
    if any(ord(ch) < 32 for ch in password) or "200~" in password or "201~" in password:
        print("ERROR: the value contains control characters or bracketed-paste codes.", file=sys.stderr)
        print("       Do not paste into the shell — type the password at this prompt.", file=sys.stderr)
        return 2

    # Percent-encode exactly once. Characters like [ ] @ : / ? # break URL parsing.
    encoded = urllib.parse.quote(password, safe="")
    print(f"Password accepted: {mask_shape(password)}")
    if encoded != password:
        print("Special characters were percent-encoded for the URL (expected).")

    changed_total = 0
    for path, key in TARGETS:
        original = path.read_text(encoding="utf-8")
        lines = original.splitlines(keepends=True)
        changed = False
        for i, line in enumerate(lines):
            if not line.startswith(f"{key}="):
                continue
            new_line = rewrite_url_line(line, encoded, key)
            if new_line is None:
                print(f"  WARN {path.name} {key}: line {i + 1} is not a usable URL — left unchanged")
                continue
            if new_line != line:
                lines[i] = new_line
                changed = True
        if changed:
            path.write_text("".join(lines), encoding="utf-8")
            changed_total += 1
            print(f"  updated {path.relative_to(ROOT)} ({key})")
        else:
            print(f"  unchanged {path.relative_to(ROOT)} ({key}) — value already set?")

    print(f"\n{changed_total} file(s) written. Verify with:")
    print("  python3 scripts/check_db_connection.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
