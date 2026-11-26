"""Versioned API router assembly (mounted at ``/api/v1``)."""

from __future__ import annotations

from fastapi import APIRouter

from app.api.v1 import auth, health, me

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(me.router, prefix="/me", tags=["identity"])

# Versioned health/version aliases (explicit paths so they are documented).
api_router.add_api_route(
    "/health", health.v1_health, methods=["GET"], tags=["health"], summary="Versioned health"
)
api_router.add_api_route(
    "/version",
    health.version_info,
    methods=["GET"],
    tags=["health"],
    summary="API version metadata",
)
# Versioned readiness alias (same handler/response as /health/ready, including 503).
api_router.add_api_route(
    "/ready",
    health.readiness,
    methods=["GET"],
    tags=["health"],
    summary="Versioned readiness probe",
    response_model=health.Readiness,
)
