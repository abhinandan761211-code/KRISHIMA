"""KRISHIMA FastAPI application factory (Phase 1 foundation)."""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import api_router, health
from app.core.config import settings
from app.core.db import dispose_engine
from app.core.errors import AppError, error_body
from app.core.logging import configure_logging, get_logger
from app.middleware import AuthMiddleware, CorrelationIdMiddleware

logger = get_logger("krishima.app")


@asynccontextmanager
async def lifespan(_app: FastAPI):  # type: ignore[no-untyped-def]
    """Application startup/shutdown hooks.

    Startup logs a non-secret configuration summary. It does **not** hard-fail when
    an optional dependency is unavailable — readiness reports that instead, so the
    process stays up long enough to be diagnosed.
    """
    logger.info("startup: env=%s", settings.APP_ENV)
    logger.info("startup: config=%s", settings.summary())
    yield
    logger.info("shutdown: disposing database engine")
    dispose_engine()


def create_app() -> FastAPI:
    configure_logging()

    app = FastAPI(
        title="KRISHIMA API",
        version="0.1.0",
        lifespan=lifespan,
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
        openapi_url="/openapi.json",
    )

    # CORS must wrap the app so preflight requests succeed.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["X-Request-Id"],
    )
    # Order: correlation id outermost (added last runs first in Starlette).
    app.add_middleware(AuthMiddleware)
    app.add_middleware(CorrelationIdMiddleware)

    @app.exception_handler(AppError)
    async def _app_error_handler(request: Request, exc: AppError) -> JSONResponse:
        rid = getattr(request.state, "request_id", "-")
        if exc.status_code >= 500:
            logger.error("unhandled app error: %s", exc.code)
        return JSONResponse(status_code=exc.status_code, content=error_body(exc, rid))

    @app.exception_handler(Exception)
    async def _unhandled_handler(request: Request, exc: Exception) -> JSONResponse:
        rid = getattr(request.state, "request_id", "-")
        logger.exception("unhandled error: %s", type(exc).__name__)
        return JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "internal_error",
                    "message": "An unexpected error occurred.",
                    "request_id": rid,
                }
            },
        )

    app.include_router(api_router)

    # Root-level operational probes (orchestrator/load-balancer targets). These are
    # the canonical /*/live and /*/ready paths; the same handlers are also reachable
    # under /api/v1/health and /api/v1/version.
    app.add_api_route(
        "/health/live", health.liveness, methods=["GET"], tags=["health"], summary="Liveness probe"
    )
    app.add_api_route(
        "/health/ready",
        health.readiness,
        methods=["GET"],
        tags=["health"],
        summary="Readiness probe",
        response_model=health.Readiness,
    )
    return app


app = create_app()
