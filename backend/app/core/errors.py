"""Error taxonomy and the standard API error envelope (API standards §4.4)."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class AppError(Exception):
    """Base application error mapped to a stable machine ``code`` + HTTP status."""

    code: str
    message: str
    status_code: int = 400
    details: list[dict[str, Any]] = field(default_factory=list)

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.code}: {self.message}"


class Unauthenticated(AppError):
    def __init__(self, message: str = "Authentication required.") -> None:
        super().__init__("unauthenticated", message, 401)


class Forbidden(AppError):
    def __init__(self, message: str = "You do not have permission to do that.") -> None:
        super().__init__("forbidden", message, 403)


class NotFound(AppError):
    def __init__(self, message: str = "Resource not found.") -> None:
        super().__init__("not_found", message, 404)


class Conflict(AppError):
    def __init__(self, message: str = "Resource conflict.") -> None:
        super().__init__("conflict", message, 409)


class ValidationFailed(AppError):
    def __init__(self, details: list[dict[str, Any]] | None = None) -> None:
        super().__init__(
            "validation_error",
            "Request validation failed.",
            422,
            details or [],
        )


class ServiceUnavailable(AppError):
    def __init__(self, message: str = "Service temporarily unavailable.") -> None:
        super().__init__("provider_unavailable", message, 503)


def error_body(error: AppError, request_id: str) -> dict[str, Any]:
    """Build the standard error envelope body."""
    payload: dict[str, Any] = {
        "code": error.code,
        "message": error.message,
        "request_id": request_id,
    }
    if error.details:
        payload["details"] = error.details
    return {"error": payload}
