#!/usr/bin/env python3
"""KRISHIMA foundation verification.

Independently probes each dependency and prints an honest status:
    CONFIGURED / CONNECTED / TESTED / NOT CONFIGURED / FAILED

Uses only real checks — no hardcoded success. Secrets are never printed.

Run:
    python3 scripts/verify_foundation.py
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))
sys.path.insert(0, str(ROOT / "database"))

# Load the backend env explicitly so the script works from any CWD.
from dotenv import load_dotenv  # noqa: E402

load_dotenv(ROOT / "backend" / ".env", override=False)

results: list[tuple[str, str, str]] = []


def record(name: str, status: str, detail: str = "") -> None:
    results.append((name, status, detail))


def check_env_validation() -> None:
    try:
        from app.core.config import Settings, settings

        s = Settings(_env_file=None)  # type: ignore[call-arg]
        # Validate the loaded backend/.env too
        _ = settings.summary()
        record("env_validation", "TESTED", f"Settings validated; env={s.APP_ENV}")
    except Exception as exc:  # noqa: BLE001
        record("env_validation", "FAILED", type(exc).__name__)


def check_supabase_auth_settings() -> None:
    try:
        from app.integrations.supabase import supabase_server

        client = supabase_server()
        if not client.configured:
            record(
                "supabase_auth",
                "NOT CONFIGURED",
                "SUPABASE_URL / service-role not set in backend/.env",
            )
            return
        ok, detail = client.auth_health()
        ok2, s = client.public_auth_settings()
        ext = (s or {}).get("external", {}) if ok2 else {}
        enabled = [k for k, v in ext.items() if v]
        record(
            "supabase_auth",
            "CONNECTED" if ok else "FAILED",
            f"health={detail}; providers_enabled={enabled}",
        )
    except Exception as exc:  # noqa: BLE001
        record("supabase_auth", "FAILED", type(exc).__name__)


def check_google_oauth() -> None:
    try:
        from app.integrations.supabase import supabase_server

        ok, s = supabase_server().public_auth_settings()
        if not ok:
            record("google_oauth", "NOT CONFIGURED", "auth settings unavailable")
            return
        enabled = bool(s.get("external", {}).get("google", False))
        record(
            "google_oauth",
            "CONFIGURED" if enabled else "NOT CONFIGURED",
            "Google provider enabled in Supabase (flow not yet tested end-to-end)",
        )
    except Exception as exc:  # noqa: BLE001
        record("google_oauth", "FAILED", type(exc).__name__)


def check_jwt_verification() -> None:
    try:
        from app.core.security import auth_readiness

        ar = auth_readiness()
        if ar["mode"] == "none":
            record("jwt_verification", "NOT CONFIGURED", "no JWKS and no HS256 secret")
            return
        if ar["mode"] == "jwks":
            if ar.get("jwks_reachable"):
                record(
                    "jwt_verification",
                    "TESTED",
                    f"JWKS reachable; {ar.get('jwks_key_count')} key(s); algs={ar.get('jwks_algorithms')}",
                )
            else:
                record("jwt_verification", "FAILED", "JWKS not reachable")
        else:
            record("jwt_verification", "CONFIGURED", "HS256 legacy mode")
    except Exception as exc:  # noqa: BLE001
        record("jwt_verification", "FAILED", type(exc).__name__)


def check_token_validation() -> None:
    """Prove the verifier rejects an obviously invalid token (negative test)."""
    try:
        from app.core.errors import Unauthenticated
        from app.core.security import verify_token

        try:
            verify_token("not-a-real-token")
        except Unauthenticated:
            record("token_validation", "TESTED", "invalid token correctly rejected")
            return
        record("token_validation", "FAILED", "invalid token was accepted (!)")
    except Exception as exc:  # noqa: BLE001
        record("token_validation", "FAILED", type(exc).__name__)


def check_database() -> None:
    try:
        from app.core.config import settings
        from app.core.db import check_connection

        if not settings.db_configured:
            record("postgres_runtime", "NOT CONFIGURED", "DATABASE_URL is a placeholder")
            return
        ok, detail = check_connection()
        record("postgres_runtime", "CONNECTED" if ok else "FAILED", detail)
    except Exception as exc:  # noqa: BLE001
        record("postgres_runtime", "FAILED", type(exc).__name__)


def check_migration_db() -> None:
    try:
        from app.core.config import Settings

        s = Settings(_env_file=str(ROOT / "database" / ".env.example"))  # type: ignore[call-arg]
        _ = s  # placeholder file; real check is in database/.env
        from dotenv import dotenv_values

        env = dotenv_values(ROOT / "database" / ".env")
        url = env.get("MIGRATION_DATABASE_URL", "") or ""
        if not url or "REPLACE_WITH" in url:
            record("postgres_migration", "NOT CONFIGURED", "MIGRATION_DATABASE_URL placeholder")
            return
        from sqlalchemy import create_engine, text

        engine = create_engine(url)
        with engine.connect() as c:
            c.execute(text("select 1"))
        record("postgres_migration", "CONNECTED", "migration credential can connect")
    except Exception as exc:  # noqa: BLE001
        record("postgres_migration", "FAILED", type(exc).__name__)


def check_storage() -> None:
    try:
        from app.integrations.storage import expected_buckets
        from app.integrations.supabase import supabase_server

        client = supabase_server()
        if not client.configured:
            record("storage", "NOT CONFIGURED", "server client not configured")
            return
        ok, buckets = client.list_buckets()
        expected = [b.name for b in expected_buckets()]
        if not ok:
            record("storage", "FAILED", str(buckets))
            return
        present = [b for b in expected if isinstance(buckets, list) and b in buckets]
        status = "CONNECTED" if present else "CONFIGURED"
        record("storage", status, f"expected={expected} present={present}")
    except Exception as exc:  # noqa: BLE001
        record("storage", "FAILED", type(exc).__name__)


def check_alembic_config() -> None:
    try:
        import os
        import subprocess

        env = {**os.environ, "PYTHONPATH": str(ROOT / "backend")}
        proc = subprocess.run(  # noqa: S603
            ["alembic", "upgrade", "0001_baseline", "--sql"],
            cwd=ROOT / "database",
            capture_output=True,
            text=True,
            env=env,
            timeout=60,
        )
        if proc.returncode == 0 and "gen_uuid_v7" in proc.stdout:
            record("alembic_config", "TESTED", "offline SQL renders with schema + function")
        else:
            record("alembic_config", "FAILED", proc.stderr.splitlines()[-1][:120] if proc.stderr else "no output")
    except Exception as exc:  # noqa: BLE001
        record("alembic_config", "FAILED", type(exc).__name__)


def check_frontend_env() -> None:
    try:
        from dotenv import dotenv_values

        env = dotenv_values(ROOT / "frontend" / ".env.local")
        required = ["VITE_API_BASE_URL", "VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"]
        missing = [k for k in required if not env.get(k) or "REPLACE_WITH" in (env.get(k) or "")]
        if missing:
            record("frontend_env", "NOT CONFIGURED", f"missing/placeholder: {missing}")
        else:
            record("frontend_env", "CONFIGURED", "all VITE_* public vars present")
    except Exception as exc:  # noqa: BLE001
        record("frontend_env", "FAILED", type(exc).__name__)


def main() -> int:
    for fn in (
        check_env_validation,
        check_supabase_auth_settings,
        check_google_oauth,
        check_jwt_verification,
        check_token_validation,
        check_database,
        check_migration_db,
        check_storage,
        check_alembic_config,
        check_frontend_env,
    ):
        try:
            fn()
        except Exception as exc:  # noqa: BLE001
            record(fn.__name__, "FAILED", f"unexpected: {type(exc).__name__}")

    width = max(len(n) for n, _, _ in results) + 2
    print("=" * 78)
    print("KRISHIMA — Foundation Verification")
    print("=" * 78)
    for name, status, detail in results:
        print(f"{name:<{width}} {status:<15} {detail}")
    print("=" * 78)
    failed = [r for r in results if r[1] == "FAILED"]
    print(f"Total: {len(results)}  Failed: {len(failed)}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
