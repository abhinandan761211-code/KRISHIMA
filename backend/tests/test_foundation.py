"""Foundation tests: config validation, JWT verification, health endpoints."""

from __future__ import annotations

import time

import jwt
import pytest
from app.core import security
from app.core.config import Settings, looks_like_placeholder
from app.main import app as fastapi_app
from cryptography.hazmat.primitives.asymmetric import ec
from fastapi.testclient import TestClient
from pydantic import ValidationError

client = TestClient(fastapi_app)


# --------------------------- config ---------------------------
def test_placeholder_detection() -> None:
    assert looks_like_placeholder("")
    assert looks_like_placeholder("REPLACE_WITH_DB_PASSWORD")
    assert looks_like_placeholder("https://PROJECT_REF.supabase.co")
    assert not looks_like_placeholder("https://abc.supabase.co")


def test_production_rejects_debug_and_memory_rate_limit() -> None:
    with pytest.raises(ValidationError):
        Settings(APP_ENV="production", LOG_LEVEL="DEBUG", RATE_LIMIT_BACKEND="memory")
    with pytest.raises(ValidationError):
        Settings(APP_ENV="production", RATE_LIMIT_BACKEND="memory")


def test_auth_mode_reports_jwks_when_configured() -> None:
    s = Settings(
        SUPABASE_JWKS_URL="https://x.supabase.co/auth/v1/.well-known/jwks.json",
        SUPABASE_JWT_ALGORITHMS="ES256,RS256",
        _env_file=None,
    )
    assert s.auth_mode() == "jwks"


# --------------------------- health ---------------------------
def test_liveness() -> None:
    """Liveness is unconditional: the process is up, regardless of dependencies."""
    r = client.get("/health/live")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"
    assert "X-Request-Id" in r.headers


def test_v1_health_reports_dependency_state() -> None:
    """/api/v1/health reflects real dependency health (ok only when nothing is unhealthy)."""
    r = client.get("/api/v1/health")
    assert r.status_code == 200
    body = r.json()
    assert body["status"] in {"ok", "degraded"}
    # status must be consistent with the reported unhealthy dependency list
    assert (body["status"] == "ok") == (len(body["unhealthy_dependencies"]) == 0)


def test_readiness_returns_503_when_degraded() -> None:
    """A degraded readiness probe MUST signal failure to orchestrators (503)."""
    r = client.get("/health/ready")
    body = r.json()
    expected = 503 if body["status"] == "degraded" else 200
    assert r.status_code == expected


def test_version_endpoint() -> None:
    r = client.get("/api/v1/version")
    assert r.status_code == 200
    assert r.json()["api_version"] == "v1"


def test_protected_route_requires_token() -> None:
    r = client.get("/api/v1/me")
    assert r.status_code == 401
    body = r.json()["error"]
    assert body["code"] == "unauthenticated"
    assert body["request_id"]


# --------------------------- JWT ---------------------------
@pytest.fixture()
def es256_keypair():
    key = ec.generate_private_key(ec.SECP256R1())
    return key


def _make_token(
    key, *, aud="authenticated", iss="https://x.supabase.co/auth/v1", exp_delta=60, sub=None
):
    payload = {
        "sub": sub or "11111111-1111-7111-8111-111111111111",
        "aud": aud,
        "iss": iss,
        "role": "authenticated",
        "email": "farmer@example.com",
        "exp": int(time.time()) + exp_delta,
    }
    return jwt.encode(payload, key, algorithm="ES256")


def test_verify_es256_token(monkeypatch, es256_keypair) -> None:
    from app.core.config import Settings

    monkeypatch.setattr(
        security,
        "settings",
        Settings(
            SUPABASE_JWKS_URL="https://x.supabase.co/auth/v1/.well-known/jwks.json",
            SUPABASE_JWT_ISSUER="https://x.supabase.co/auth/v1",
            SUPABASE_JWT_AUDIENCE="authenticated",
            SUPABASE_JWT_ALGORITHMS="ES256,RS256",
            _env_file=None,
        ),
    )
    token = _make_token(es256_keypair)

    class _FakeJWKClient:
        def get_signing_key_from_jwt(self, _t):
            class K:
                key = es256_keypair.public_key()

            return K()

    monkeypatch.setattr(security, "_get_jwks_client", lambda: _FakeJWKClient())
    principal = security.verify_token(token)
    assert principal.auth_uid == "11111111-1111-7111-8111-111111111111"
    assert principal.email == "farmer@example.com"


def test_rejects_expired_token(monkeypatch, es256_keypair) -> None:
    from app.core.config import Settings

    monkeypatch.setattr(
        security,
        "settings",
        Settings(
            SUPABASE_JWKS_URL="https://x.supabase.co/auth/v1/.well-known/jwks.json",
            SUPABASE_JWT_ISSUER="https://x.supabase.co/auth/v1",
            SUPABASE_JWT_ALGORITHMS="ES256,RS256",
            _env_file=None,
        ),
    )
    token = _make_token(es256_keypair, exp_delta=-10)

    class _FakeJWKClient:
        def get_signing_key_from_jwt(self, _t):
            class K:
                key = es256_keypair.public_key()

            return K()

    monkeypatch.setattr(security, "_get_jwks_client", lambda: _FakeJWKClient())
    with pytest.raises(security.Unauthenticated):
        security.verify_token(token)
