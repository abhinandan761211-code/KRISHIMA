"""HTTP middleware: correlation IDs, authentication, and error handling."""

from __future__ import annotations

import uuid

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse, Response

from app.core.errors import AppError, Unauthenticated, error_body
from app.core.logging import get_logger, request_id_ctx
from app.core.security import verify_token

logger = get_logger("krishima.http")

# Paths that do not require authentication.
_PUBLIC_PREFIXES = (
    "/health",
    "/ready",
    "/api/v1/health",
    "/api/v1/ready",
    "/api/v1/version",
    "/api/v1/auth/config",
    "/docs",
    "/redoc",
    "/openapi.json",
)


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    """Assign/propagate ``X-Request-Id`` and expose it to logs and handlers."""

    async def dispatch(self, request: Request, call_next) -> Response:  # type: ignore[no-untyped-def]
        incoming = request.headers.get("X-Request-Id")
        request_id = incoming or str(uuid.uuid4())
        token = request_id_ctx.set(request_id)
        request.state.request_id = request_id
        try:
            response = await call_next(request)
        finally:
            request_id_ctx.reset(token)
        response.headers["X-Request-Id"] = request_id
        return response


class AuthMiddleware(BaseHTTPMiddleware):
    """Verify the bearer token and attach the :class:`Principal` to ``request.state``.

    Deny-by-default: protected paths without a valid token receive ``401``. The
    token's ``role`` claim is **not** used for authorization (ADR-0004/0008).
    """

    async def dispatch(self, request: Request, call_next) -> Response:  # type: ignore[no-untyped-def]
        path = request.url.path
        request.state.principal = None
        if not path.startswith(_PUBLIC_PREFIXES):
            auth = request.headers.get("Authorization", "")
            if not auth.startswith("Bearer "):
                return _error(Unauthenticated("Missing bearer token."), request)
            try:
                request.state.principal = verify_token(auth[len("Bearer ") :].strip())
            except Unauthenticated as exc:
                return _error(exc, request)
        return await call_next(request)


def _error(exc: AppError, request: Request) -> JSONResponse:
    rid = getattr(request.state, "request_id", "-")
    return JSONResponse(status_code=exc.status_code, content=error_body(exc, rid))
