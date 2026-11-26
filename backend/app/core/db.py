"""Database engine, pooling, and per-request session management.

Key rules (ADR-0008, Repository Structure §4.3)
-----------------------------------------------
* The **runtime** connection uses a least-privilege role subject to RLS.
* RLS is enforced only when the session variables ``app.current_user_id`` and
  ``app.current_workspace_id`` are set **and** the role is subject to RLS.
  A privileged connection does *not* inherit a user's RLS context — so every
  request opens a transaction and sets those GUCs explicitly.
* The **migration** connection is a separate, higher-privilege credential used
  only by Alembic (see ``database/``), never on the request path.

This module is import-safe when the DB is not configured: creating the engine is
lazy so the app can boot and *report* an unconfigured database rather than crash.
"""

from __future__ import annotations

import uuid
from collections.abc import Iterator
from contextlib import contextmanager

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("krishima.db")

_engine: Engine | None = None
_SessionLocal: sessionmaker[Session] | None = None


def get_engine() -> Engine:
    """Return the process-wide runtime engine (created lazily, pooled)."""
    global _engine
    if _engine is None:
        if not settings.db_configured:
            raise RuntimeError(
                "DATABASE_URL is not configured. Set a real least-privilege runtime "
                "connection string in backend/.env before using the database."
            )
        _engine = create_engine(
            settings.DATABASE_URL,
            pool_size=settings.DB_POOL_SIZE,
            max_overflow=settings.DB_MAX_OVERFLOW,
            pool_timeout=settings.DB_POOL_TIMEOUT,
            pool_recycle=settings.DB_POOL_RECYCLE,
            pool_pre_ping=settings.DB_POOL_PRE_PING,
            future=True,
            connect_args={
                # Stated explicitly so a mis-set role can never silently bypass RLS
                # expectations during review; the *role* must still be least-privilege.
                "application_name": "krishima-api",
            },
        )
        logger.info(
            "database engine created for %s", settings.safe_db_target(settings.DATABASE_URL)
        )
    return _engine


def get_sessionmaker() -> sessionmaker[Session]:
    global _SessionLocal
    if _SessionLocal is None:
        _SessionLocal = sessionmaker(bind=get_engine(), expire_on_commit=False, future=True)
    return _SessionLocal


@contextmanager
def db_session(
    *,
    user_id: uuid.UUID | None = None,
    workspace_id: uuid.UUID | None = None,
) -> Iterator[Session]:
    """Open a session inside a transaction with explicit RLS session GUCs.

    The GUCs are set with ``SET LOCAL`` so they are scoped to the transaction and
    cannot leak into another request that reuses the pooled connection.
    """
    session = get_sessionmaker()()
    try:
        with session.begin():
            if user_id is not None:
                session.execute(
                    text("SELECT set_config('app.current_user_id', :v, true)"),
                    {"v": str(user_id)},
                )
            if workspace_id is not None:
                session.execute(
                    text("SELECT set_config('app.current_workspace_id', :v, true)"),
                    {"v": str(workspace_id)},
                )
            yield session
    finally:
        session.close()


def check_connection() -> tuple[bool, str]:
    """Verify DB connectivity with a trivial read-only query.

    Returns ``(ok, detail)``. Never raises; never prints credentials, hosts or
    connection strings — the detail is a sanitised, human-readable reason.
    """
    if not settings.db_configured:
        return False, "DATABASE_URL not configured (placeholder)."
    try:
        with get_engine().connect() as conn:
            version = conn.execute(text("select current_database(), current_user, version()")).one()
            db_name, db_user, _ = version
        return True, f"connected as {db_user!r} to database {db_name!r}"
    except Exception as exc:  # noqa: BLE001 - reported, not swallowed silently
        return False, _sanitise_db_error(exc)


def dispose_engine() -> None:
    global _engine, _SessionLocal
    if _engine is not None:
        _engine.dispose()
    _engine = None
    _SessionLocal = None


def _sanitise_db_error(exc: Exception) -> str:
    """Reduce a driver error to a safe reason (no hosts, IPs, or credentials)."""
    text_err = str(exc)
    if "password authentication failed" in text_err:
        return "authentication failed — check the database password for this role."
    if "does not exist" in text_err and "database" in text_err.lower():
        return "database does not exist."
    if "timed out" in text_err.lower() or "timeout" in text_err.lower():
        return "connection timed out."
    if "could not translate host" in text_err or "Name or service not known" in text_err:
        return "database host could not be resolved."
    if "SSL" in text_err:
        return "TLS/SSL negotiation failed."
    return f"connection error ({type(exc).__name__})."
