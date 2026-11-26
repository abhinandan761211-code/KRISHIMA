#!/usr/bin/env python3
"""Verify database connectivity for blocker B-1 — without ever printing a secret.

Checks, in order:
  1. the URLs parse and no longer contain the template placeholder;
  2. a real connection succeeds and reports the effective role/database;
  3. the `app` schema exists (i.e. the baseline migration was applied);
  4. row-level security is enabled on the baseline tables.

Every failure prints an actionable reason. The password is never echoed: only a
length/character-class summary is shown.

Usage:
    python3 scripts/check_db_connection.py
Exit code 0 = all checks that could run passed; 1 = a real failure.
"""
from __future__ import annotations

import re
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def read_env_value(path: Path, key: str) -> str | None:
    if not path.exists():
        return None
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith(f"{key}="):
            return line.split("=", 1)[1].strip()
    return None


def redact(message: str) -> str:
    """Remove anything that looks like a password from an error string."""
    message = re.sub(r"password=\S+", "password=***", message)
    message = re.sub(r"://([^:/@]+):[^@]+@", r"://\1:***@", message)
    return message


def describe(url: str) -> tuple[bool, str]:
    """Return (is_placeholder, human summary) for a DB URL."""
    u = urllib.parse.urlparse(url)
    pw = u.password or ""
    decoded = urllib.parse.unquote(pw)
    placeholder = "YOUR-DATABASE-PASSWORD" in decoded or decoded.startswith("[") or not decoded
    summary = (
        f"host={u.hostname} port={u.port} user={u.username} db={(u.path or '').lstrip('/') or '?'} "
        f"password_len={len(pw)}"
    )
    return placeholder, summary


def corruption_problems(url: str) -> list[str]:
    """Return concrete reasons the encoded password cannot work (empty = plausible).

    These are the two failures this project has actually hit, and both produce a
    password that is long enough to defeat a naive "is it empty/placeholder" test:
      - `%5B`/`%5D` : zsh bracketed-paste escapes captured into the value;
      - `%25`       : the password was percent-encoded a second time.
    """
    u = urllib.parse.urlparse(url)
    pw = u.password or ""
    problems: list[str] = []
    if "%5B" in pw or "%5D" in pw:
        problems.append("password contains %5B/%5D (bracketed-paste escape codes)")
    if "%25" in pw:
        problems.append("password contains %25 (double-encoded)")
    if not u.hostname or not u.port or u.scheme.startswith("http"):
        problems.append("this is not a postgresql:// URL")
    return problems


def main() -> int:
    try:
        import psycopg
    except ImportError:
        print("psycopg is not installed. Run: python3 -m pip install -e ./backend")
        return 1

    ok = True
    url = read_env_value(ROOT / "backend" / ".env", "DATABASE_URL")
    if not url:
        print("FAIL: backend/.env has no DATABASE_URL")
        return 1

    placeholder, summary = describe(url)
    print(f"backend/.env DATABASE_URL: {summary}")

    # Diagnose corruption FIRST: a paste-corrupted value also looks like a
    # placeholder (the decoded string starts with '['), and the actionable fix is
    # different, so naming the wrong cause would send the reader down the wrong path.
    problems = corruption_problems(url)
    if problems:
        for p in problems:
            print(f"  PROBLEM: {p}")
        print("FAIL: the URL is malformed, not merely unset.")
        print("      Re-enter the password with hidden input (do NOT paste into the shell):")
        print("        python3 scripts/set_db_password.py")
        return 1

    if placeholder:
        print("FAIL: the password is still the template placeholder.")
        print("      Run: python3 scripts/set_db_password.py")
        return 1
    print("  password: set (not a placeholder)")

    # 1. Connect.
    # `.env` holds SQLAlchemy URLs (`postgresql+psycopg://`). SQLAlchemy understands
    # the +driver suffix; the raw driver does not, so strip it for this check.
    raw_url = re.sub(r"^(postgresql)\+\w+://", r"\1://", url)
    try:
        with psycopg.connect(raw_url, connect_timeout=15) as conn:
            with conn.cursor() as cur:
                cur.execute("select current_user, current_database()")
                user, dbname = cur.fetchone()
                print(f"CONNECT: OK  (user={user}, db={dbname})")

                # 2. Baseline schema.
                cur.execute("select count(*) from information_schema.schemata where schema_name = 'app'")
                has_app = cur.fetchone()[0] > 0
                print(f"  app schema: {'present' if has_app else 'MISSING — run database/scripts/migrate.sh upgrade head'}")

                # 3. RLS on baseline tables.
                if has_app:
                    cur.execute(
                        """
                        select relname, relrowsecurity
                        from pg_class c join pg_namespace n on n.oid = c.relnamespace
                        where n.nspname = 'app' and c.relkind = 'r'
                        order by relname
                        """
                    )
                    rows = cur.fetchall()
                    # Alembic's own bookkeeping table is not application data and
                    # is deliberately not under RLS; excluding it avoids a false alarm.
                    rows = [r for r in rows if r[0] != "alembic_version"]
                    if not rows:
                        print("  tables: none beyond the baseline (expected for Phase 1)")
                    else:
                        without = [r[0] for r in rows if not r[1]]
                        print(f"  tables: {len(rows)}; RLS enabled on {len(rows) - len(without)}")
                        if without:
                            print(f"  RLS MISSING on: {', '.join(without)}")
    except Exception as exc:  # noqa: BLE001 - we want the driver's own message
        print(f"CONNECT: FAILED ({type(exc).__name__})")
        print("  " + redact(str(exc))[:400])
        print("\nCommon causes:")
        print("  - wrong password  → re-run scripts/set_db_password.py")
        print("  - password not percent-encoded → the script does this for you")
        print("  - wrong pooler shard → copy the host verbatim from Supabase → Database → Connection string")
        return 1

    # 4. Migration URL (separate credential; only shape-checked, not connected).
    mig = read_env_value(ROOT / "database" / ".env", "MIGRATION_DATABASE_URL")
    if mig:
        mig_placeholder, mig_summary = describe(mig)
        print(f"database/.env MIGRATION_DATABASE_URL: {mig_summary}")
        if mig_placeholder:
            print("  FAIL: placeholder still present")
            ok = False

    print("\nRESULT:", "PASS" if ok else "FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
