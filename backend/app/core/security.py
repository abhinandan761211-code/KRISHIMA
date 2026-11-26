"""Supabase JWT verification (ADR-0003, ADR-0008).

Strategy
--------
* **Preferred: JWKS** — asymmetric keys (ES256/RS256). The project's public keys
  are fetched from ``SUPABASE_JWKS_URL`` and cached. The signing key is selected by
  the token header ``kid``.
* **Legacy fallback: HS256** — only when no JWKS is configured *and* an explicit
  ``SUPABASE_JWT_SECRET`` exists. Never used when JWKS is available.

Always validated: signature, ``exp``, ``iss``, ``aud``, and the presence of a
``sub`` (the authenticated user id). **Client-provided role claims are never
trusted** for authorization — ``role`` in the JWT is only the coarse Postgres role
(``authenticated``/``anon``); application permissions are resolved server-side from
our own tables (see ADR-0004/0008).
"""

from __future__ import annotations

import time
import uuid
from dataclasses import dataclass
from typing import Any

import httpx
import jwt
from jwt import PyJWKClient

from app.core.config import settings
from app.core.errors import Unauthenticated
from app.core.logging import get_logger

logger = get_logger("krishima.auth")

# Algorithms we accept from a token header. HS256 is only honoured in the
# explicit legacy path.
_ASYMMETRIC = {"ES256", "ES384", "RS256", "RS384", "RS512"}


@dataclass(frozen=True, slots=True)
class Principal:
    """Authenticated identity derived *only* from a verified token."""

    user_id: uuid.UUID
    auth_uid: str
    email: str | None
    role: str | None  # Supabase coarse role claim (informational, not authorization)
    raw_claims: dict[str, Any]

    @property
    def is_authenticated(self) -> bool:
        return True


_jwks_client: PyJWKClient | None = None
_jwks_fetched_at: float = 0.0


def _get_jwks_client() -> PyJWKClient:
    global _jwks_client, _jwks_fetched_at
    now = time.time()
    if _jwks_client is None or (now - _jwks_fetched_at) > settings.JWKS_CACHE_TTL_SECONDS:
        _jwks_client = PyJWKClient(
            settings.SUPABASE_JWKS_URL,
            cache_keys=True,
            lifespan=settings.JWKS_CACHE_TTL_SECONDS,
        )
        _jwks_fetched_at = now
    return _jwks_client


def _decode_with_jwks(token: str) -> dict[str, Any]:
    header = jwt.get_unverified_header(token)
    alg = header.get("alg", "")
    if alg not in _ASYMMETRIC or alg not in settings.algorithms:
        raise Unauthenticated("Unsupported token signing algorithm.")
    signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
    return jwt.decode(
        token,
        signing_key.key,
        algorithms=[alg],
        audience=settings.SUPABASE_JWT_AUDIENCE,
        issuer=settings.SUPABASE_JWT_ISSUER or None,
        options={"require": ["exp", "sub", "aud"]},
    )


def _decode_with_hs256(token: str) -> dict[str, Any]:
    if not settings.jwt_secret_configured:
        raise Unauthenticated("HS256 verification requested but no secret is configured.")
    return jwt.decode(
        token,
        settings.SUPABASE_JWT_SECRET,
        algorithms=["HS256"],
        audience=settings.SUPABASE_JWT_AUDIENCE,
        issuer=settings.SUPABASE_JWT_ISSUER or None,
        options={"require": ["exp", "sub", "aud"]},
    )


def verify_token(token: str) -> Principal:
    """Verify a Supabase access token and return the authenticated :class:`Principal`.

    Raises :class:`Unauthenticated` on any failure. Never returns a principal for
    an unverified token.
    """
    if not token:
        raise Unauthenticated("Missing bearer token.")
    try:
        mode = settings.auth_mode()
        if mode == "jwks":
            claims = _decode_with_jwks(token)
        elif mode == "hs256":
            claims = _decode_with_hs256(token)
        else:
            raise Unauthenticated("Server is not configured to verify tokens.")
    except jwt.ExpiredSignatureError as exc:
        raise Unauthenticated("Token has expired.") from exc
    except jwt.InvalidAudienceError as exc:
        raise Unauthenticated("Token audience is invalid.") from exc
    except jwt.InvalidIssuerError as exc:
        raise Unauthenticated("Token issuer is invalid.") from exc
    except jwt.PyJWTError as exc:
        raise Unauthenticated("Token signature or claims are invalid.") from exc

    sub = claims.get("sub")
    if not sub:
        raise Unauthenticated("Token is missing a subject.")
    try:
        user_id = uuid.UUID(str(sub))
    except ValueError as exc:
        raise Unauthenticated("Token subject is not a valid user id.") from exc

    return Principal(
        user_id=user_id,
        auth_uid=str(sub),
        email=claims.get("email"),
        role=claims.get("role"),
        raw_claims=claims,
    )


def auth_readiness() -> dict[str, Any]:
    """Report JWT verification readiness without exposing secrets."""
    mode = settings.auth_mode()
    detail: dict[str, Any] = {
        "mode": mode,
        "algorithms": settings.algorithms,
        "jwks_url_configured": settings.jwks_configured,
        "issuer_configured": bool(settings.SUPABASE_JWT_ISSUER),
        "audience": settings.SUPABASE_JWT_AUDIENCE,
    }
    if mode == "jwks":
        try:
            keys = httpx.get(settings.SUPABASE_JWKS_URL, timeout=10.0)
            keys.raise_for_status()
            data = keys.json()
            kids = [k.get("kid") for k in data.get("keys", [])]
            algs = sorted({k.get("alg") for k in data.get("keys", []) if k.get("alg")})
            detail.update(
                {"jwks_reachable": True, "jwks_key_count": len(kids), "jwks_algorithms": algs}
            )
        except Exception as exc:  # noqa: BLE001
            detail.update({"jwks_reachable": False, "error": type(exc).__name__})
    return detail
