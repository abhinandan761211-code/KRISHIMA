"""Application configuration with fail-fast validation.

Design rules
------------
* All configuration is read from the environment (``backend/.env`` locally).
* Values are validated at **startup**; the process refuses to start with an
  unusable configuration (``ValidationError`` at import time in ``get_settings``).
* Secrets are never logged. ``Settings.summary()`` returns only booleans/redacted
  shapes for diagnostics.
* Distinguishes *not configured* from *invalid*: placeholder values are detected
  and reported rather than silently accepted.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Literal
from urllib.parse import urlparse

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_PLACEHOLDER_MARKERS = ("REPLACE_WITH", "PROJECT_REF", "change-me", "placeholder", "DO-NOT-EXPOSE")


def looks_like_placeholder(value: str | None) -> bool:
    """Return True if *value* is empty or a template placeholder."""
    if value is None:
        return True
    v = value.strip()
    if not v:
        return True
    return any(marker in v for marker in _PLACEHOLDER_MARKERS)


class Settings(BaseSettings):
    """Typed, validated application settings."""

    model_config = SettingsConfigDict(
        env_file=(".env",),
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    # --- Runtime ---
    APP_ENV: Literal["development", "staging", "production", "test"] = "development"
    API_BASE_URL: str = "http://localhost:8000"
    APP_FRONTEND_URL: str = "http://localhost:5173"
    CORS_ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:5174"

    # --- Database (server-only) ---
    DATABASE_URL: str = ""
    MIGRATION_DATABASE_URL: str = ""
    DB_POOL_SIZE: int = Field(default=5, ge=1, le=50)
    DB_MAX_OVERFLOW: int = Field(default=10, ge=0, le=50)
    DB_POOL_TIMEOUT: int = Field(default=30, ge=1)
    DB_POOL_RECYCLE: int = Field(default=1800, ge=0)
    DB_POOL_PRE_PING: bool = True

    # --- Supabase (server-only secrets) ---
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_ANON_KEY: str = ""

    # --- JWT verification ---
    SUPABASE_JWKS_URL: str = ""
    SUPABASE_JWT_SECRET: str = ""
    SUPABASE_JWT_AUDIENCE: str = "authenticated"
    SUPABASE_JWT_ISSUER: str = ""
    SUPABASE_JWT_ALGORITHMS: str = "ES256,RS256"
    JWKS_CACHE_TTL_SECONDS: int = Field(default=300, ge=0)

    # --- Google OAuth (brokered by Supabase; informational) ---
    SUPABASE_OAUTH_GOOGLE_ENABLED: bool = True

    # --- Storage ---
    SUPABASE_STORAGE_PUBLIC_BUCKET: str = "public-assets"
    SUPABASE_STORAGE_PRIVATE_BUCKET: str = "private-documents"
    MAX_UPLOAD_BYTES: int = Field(default=10_485_760, ge=1)
    SIGNING_SECRET: str = ""

    # --- Ops ---
    RATE_LIMIT_BACKEND: Literal["memory", "redis"] = "memory"
    RATE_LIMIT_DEFAULT_PER_MINUTE: int = Field(default=60, ge=1)
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR"] = "INFO"
    SENTRY_DSN: str = ""

    # --- Provider adapters ---
    PAYMENT_PROVIDER: str = "noop"
    PAYMENT_PROVIDER_KEY_ID: str = ""
    PAYMENT_PROVIDER_KEY_SECRET: str = ""
    SMS_PROVIDER: str = "noop"
    SMS_PROVIDER_KEY: str = ""
    GEO_PROVIDER: str = "noop"
    GEO_PROVIDER_KEY: str = ""

    # ------------------------------------------------------------------ #
    # Validators
    # ------------------------------------------------------------------ #
    @field_validator("LOG_LEVEL", mode="before")
    @classmethod
    def _normalise_log_level(cls, v: object) -> object:
        return v.upper() if isinstance(v, str) else v

    @field_validator("SUPABASE_URL", "SUPABASE_JWKS_URL", "SUPABASE_JWT_ISSUER")
    @classmethod
    def _validate_http_url(cls, v: str) -> str:
        if not v:
            return v
        parsed = urlparse(v)
        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError(f"must be an absolute http(s) URL, got {v!r}")
        return v.rstrip("/")

    @field_validator("SUPABASE_JWT_ALGORITHMS")
    @classmethod
    def _validate_algorithms(cls, v: str) -> str:
        allowed = {"ES256", "ES384", "RS256", "RS384", "RS512", "HS256"}
        parts = [a.strip().upper() for a in v.split(",") if a.strip()]
        if not parts:
            raise ValueError("at least one algorithm must be listed")
        unknown = set(parts) - allowed
        if unknown:
            raise ValueError(f"unsupported algorithms: {sorted(unknown)}")
        return ",".join(parts)

    @field_validator("DATABASE_URL", "MIGRATION_DATABASE_URL")
    @classmethod
    def _validate_db_url(cls, v: str) -> str:
        if not v:
            return v
        if not v.startswith("postgresql"):
            raise ValueError("must be a postgresql URL")
        if "+psycopg" not in v and "+asyncpg" not in v and v.startswith("postgresql://"):
            # Accept but normalise bare postgresql:// to the psycopg driver.
            return v.replace("postgresql://", "postgresql+psycopg://", 1)
        return v

    @model_validator(mode="after")
    def _validate_security_invariants(self) -> Settings:
        # Production must never run in DEBUG or with a memory rate limiter.
        if self.APP_ENV == "production":
            if self.LOG_LEVEL == "DEBUG":
                raise ValueError("LOG_LEVEL=DEBUG is not allowed in production")
            if self.RATE_LIMIT_BACKEND == "memory":
                raise ValueError("RATE_LIMIT_BACKEND=memory is not allowed in production")
            if "*" in self.CORS_ALLOWED_ORIGINS:
                raise ValueError("CORS wildcard '*' is not allowed in production")
        # HS256 verification requires an explicit shared secret.
        if "HS256" in self.algorithms and looks_like_placeholder(self.SUPABASE_JWT_SECRET):
            # Not fatal at startup (JWKS may be used instead) but surfaced by
            # auth_readiness(); the verifier refuses HS256 without a secret.
            pass
        return self

    # ------------------------------------------------------------------ #
    # Derived helpers
    # ------------------------------------------------------------------ #
    @property
    def cors_origins(self) -> list[str]:
        return [o.strip() for o in self.CORS_ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def algorithms(self) -> list[str]:
        return [a.strip() for a in self.SUPABASE_JWT_ALGORITHMS.split(",") if a.strip()]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"

    @property
    def db_configured(self) -> bool:
        return not looks_like_placeholder(self.DATABASE_URL)

    @property
    def migration_db_configured(self) -> bool:
        return not looks_like_placeholder(self.MIGRATION_DATABASE_URL)

    @property
    def service_role_configured(self) -> bool:
        return not looks_like_placeholder(self.SUPABASE_SERVICE_ROLE_KEY)

    @property
    def jwks_configured(self) -> bool:
        return not looks_like_placeholder(self.SUPABASE_JWKS_URL)

    @property
    def jwt_secret_configured(self) -> bool:
        return not looks_like_placeholder(self.SUPABASE_JWT_SECRET)

    def safe_db_target(self, url: str) -> str:
        """Return ``host:port/db`` with credentials stripped (never logs secrets)."""
        if not url:
            return "<unset>"
        try:
            parsed = urlparse(url)
            host = parsed.hostname or "?"
            port = parsed.port or "?"
            db = (parsed.path or "/").lstrip("/") or "?"
            return f"{host}:{port}/{db}"
        except ValueError:
            return "<invalid>"

    def summary(self) -> dict[str, object]:
        """Non-secret configuration summary for logs and /ready diagnostics."""
        return {
            "app_env": self.APP_ENV,
            "db_target": self.safe_db_target(self.DATABASE_URL),
            "db_configured": self.db_configured,
            "migration_db_target": self.safe_db_target(self.MIGRATION_DATABASE_URL),
            "migration_db_configured": self.migration_db_configured,
            "supabase_url": self.SUPABASE_URL or "<unset>",
            "service_role_configured": self.service_role_configured,
            "jwks_configured": self.jwks_configured,
            "jwt_secret_configured": self.jwt_secret_configured,
            "algorithms": self.algorithms,
            "google_oauth_enabled": self.SUPABASE_OAUTH_GOOGLE_ENABLED,
            "storage_public_bucket": self.SUPABASE_STORAGE_PUBLIC_BUCKET,
            "storage_private_bucket": self.SUPABASE_STORAGE_PRIVATE_BUCKET,
        }

    def auth_mode(self) -> str:
        """Return the JWT verification strategy that *will* be used.

        * ``jwks``  — asymmetric (ES256/RS256) via JWKS. Preferred.
        * ``hs256`` — shared-secret fallback only if JWKS is absent *and* a secret exists.
        * ``none``  — cannot verify tokens (misconfigured).
        """
        if self.jwks_configured and any(a != "HS256" for a in self.algorithms):
            return "jwks"
        if "HS256" in self.algorithms and self.jwt_secret_configured:
            return "hs256"
        return "none"


def is_placeholder(value: str | None) -> bool:  # re-export for other modules
    return looks_like_placeholder(value)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the process-wide settings singleton (validated once)."""
    return Settings()


# Fail fast at import time so a misconfigured deployment never serves traffic.
settings = get_settings()
