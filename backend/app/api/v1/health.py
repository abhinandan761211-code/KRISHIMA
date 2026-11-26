"""Health, readiness and version endpoints.

Endpoint map
------------
* ``GET /health/live``     — liveness. Process is up; no dependencies touched.
* ``GET /health/ready``    — readiness. Probes dependencies; returns **503** when a
                             critical dependency is unavailable.
* ``GET /api/v1/health``   — versioned alias of liveness (with dependency summary).
* ``GET /api/v1/version``  — build/version metadata (non-sensitive).

Readiness status values: ``connected`` | ``configured`` | ``not_configured`` |
``failed`` | ``not_tested``. Results are computed from real probes — never hardcoded.
Details never include credentials, connection strings or infrastructure secrets.
"""

from __future__ import annotations

import time
from datetime import UTC
from typing import Literal

from fastapi import APIRouter, Response
from pydantic import BaseModel

from app.core.config import settings
from app.core.db import check_connection
from app.core.security import auth_readiness
from app.integrations.storage import expected_buckets
from app.integrations.supabase import supabase_server

router = APIRouter()

Status = Literal["connected", "configured", "not_configured", "failed", "not_tested", "tested"]
Overall = Literal["ready", "degraded"]

_started_at = time.time()

# Dependencies whose failure makes the service unable to do its job.
# Auth is critical; the database is critical *only when configured* (Phase 1 allows
# an unconfigured DB so the foundation can boot, but a configured-and-reachable DB
# is required for readiness once credentials are supplied).
CRITICAL = {"database", "auth"}


class DependencyStatus(BaseModel):
    name: str
    status: Status
    detail: str = ""
    critical: bool = False


class Readiness(BaseModel):
    status: Overall
    checked_at: str
    dependencies: list[DependencyStatus]


class VersionInfo(BaseModel):
    name: str
    version: str
    api_version: str
    environment: str
    uptime_seconds: int


def _iso_now() -> str:
    from datetime import datetime

    return datetime.now(UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


# --------------------------------------------------------------------------- #
# Probes
# --------------------------------------------------------------------------- #
def _database_dependency() -> DependencyStatus:
    if not settings.db_configured:
        return DependencyStatus(
            name="database",
            status="not_configured",
            detail="DATABASE_URL is not configured.",
            critical=True,
        )
    ok, detail = check_connection()
    return DependencyStatus(
        name="database",
        status="connected" if ok else "failed",
        detail=detail,
        critical=True,
    )


def _auth_dependency() -> DependencyStatus:
    ar = auth_readiness()
    if ar["mode"] == "none":
        return DependencyStatus(
            name="supabase_auth",
            status="not_configured",
            detail="No JWKS URL and no legacy JWT secret configured.",
            critical=True,
        )
    if ar["mode"] == "jwks" and ar.get("jwks_reachable") is False:
        return DependencyStatus(
            name="supabase_auth",
            status="failed",
            detail="JWKS endpoint unreachable.",
            critical=True,
        )
    return DependencyStatus(
        name="supabase_auth",
        status="connected",
        detail=f"JWT verification via {ar['mode']}.",
        critical=True,
    )


def _google_dependency(auth_ok: bool) -> DependencyStatus:
    if not auth_ok:
        return DependencyStatus(
            name="google_oauth", status="not_tested", detail="Auth unavailable."
        )
    ok, s = supabase_server().public_auth_settings()
    if not ok:
        return DependencyStatus(
            name="google_oauth", status="not_tested", detail="Auth settings unavailable."
        )
    enabled = bool(s.get("external", {}).get("google", False))
    return DependencyStatus(
        name="google_oauth",
        status="configured" if enabled else "not_configured",
        detail="Provider enabled in Supabase; interactive login not executed in Phase 1."
        if enabled
        else "Google provider disabled in Supabase.",
    )


def _storage_dependency() -> DependencyStatus:
    client = supabase_server()
    if not client.configured:
        return DependencyStatus(
            name="storage", status="not_configured", detail="Server client not configured."
        )
    ok, buckets = client.list_buckets()
    if not ok:
        return DependencyStatus(name="storage", status="failed", detail=str(buckets))
    expected = [b.name for b in expected_buckets()]
    present = [b for b in expected if isinstance(buckets, list) and b in buckets]
    if len(present) == len(expected):
        return DependencyStatus(
            name="storage", status="connected", detail="All expected buckets present."
        )
    return DependencyStatus(
        name="storage",
        status="configured",
        detail=f"Buckets present: {present}; expected: {expected}.",
    )


def build_readiness() -> Readiness:
    db = _database_dependency()
    auth = _auth_dependency()
    deps = [db, auth, _google_dependency(auth.status == "connected"), _storage_dependency()]
    critical_failed = any(d.critical and d.status in {"failed", "not_configured"} for d in deps)
    return Readiness(
        status="degraded" if critical_failed else "ready",
        checked_at=_iso_now(),
        dependencies=deps,
    )


# --------------------------------------------------------------------------- #
# Endpoints
# --------------------------------------------------------------------------- #
@router.get("/health/live", summary="Liveness probe")
def liveness() -> dict[str, object]:
    return {
        "status": "ok",
        "env": settings.APP_ENV,
        "version": _app_version(),
    }


@router.get("/health/ready", response_model=Readiness, summary="Readiness probe")
def readiness(response: Response) -> Readiness:
    result = build_readiness()
    if result.status != "ready":
        # A readiness probe MUST signal failure to the orchestrator/load balancer.
        response.status_code = 503
    return result


# --------------------------------------------------------------------------- #
# Versioned API aliases
# --------------------------------------------------------------------------- #
def _app_version() -> str:
    return "0.1.0"


def v1_health() -> dict[str, object]:
    result = build_readiness()
    unhealthy = [d.name for d in result.dependencies if d.status in {"failed", "not_configured"}]
    return {
        "status": "ok" if not unhealthy else "degraded",
        "env": settings.APP_ENV,
        "version": _app_version(),
        "unhealthy_dependencies": unhealthy,
    }


def version_info() -> VersionInfo:
    return VersionInfo(
        name="KRISHIMA API",
        version=_app_version(),
        api_version="v1",
        environment=settings.APP_ENV,
        uptime_seconds=int(time.time() - _started_at),
    )
