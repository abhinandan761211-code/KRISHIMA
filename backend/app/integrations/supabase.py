"""Server-side Supabase integration (Auth admin + Storage) — foundation only.

This is deliberately thin: the backend normally reaches PostgreSQL directly through
SQLAlchemy. Supabase's HTTP APIs are needed only for:
  * Auth admin operations (server-only, e.g. future user management), and
  * Storage (private bucket signed URLs, approved upload grants).

The **service-role key bypasses RLS**. It is used here for narrowly-scoped server
operations only (never to serve user-facing business reads), and is never logged.
"""

from __future__ import annotations

from dataclasses import dataclass
from urllib.parse import quote

import httpx

from app.core.config import settings
from app.core.logging import get_logger

logger = get_logger("krishima.supabase")

_TIMEOUT = 15.0


@dataclass(frozen=True, slots=True)
class SupabaseServerConfig:
    url: str
    service_role_key: str
    anon_key: str

    @property
    def configured(self) -> bool:
        return bool(self.url) and bool(self.service_role_key)


def get_server_config() -> SupabaseServerConfig:
    return SupabaseServerConfig(
        url=settings.SUPABASE_URL,
        # Keep secrets out of reprs; only presence is ever inspected.
        service_role_key=settings.SUPABASE_SERVICE_ROLE_KEY,
        anon_key=settings.SUPABASE_ANON_KEY,
    )


def _headers(api_key: str) -> dict[str, str]:
    return {
        "apikey": api_key,
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }


class SupabaseServerClient:
    """Minimal async-free (sync httpx) wrapper around Supabase server endpoints."""

    def __init__(self, config: SupabaseServerConfig | None = None) -> None:
        self._config = config or get_server_config()

    @property
    def configured(self) -> bool:
        return self._config.configured

    def _require(self) -> None:
        if not self.configured:
            raise RuntimeError(
                "Supabase server integration is not configured "
                "(SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)."
            )

    # ---------------- Auth (admin) ----------------
    def auth_health(self) -> tuple[bool, str]:
        """Check the Supabase Auth service health endpoint."""
        if not self._config.url:
            return False, "SUPABASE_URL not configured."
        try:
            key = self._config.anon_key or self._config.service_role_key
            resp = httpx.get(
                f"{self._config.url}/auth/v1/health",
                headers={"apikey": key} if key else {},
                timeout=_TIMEOUT,
            )
            if resp.status_code == 200:
                return True, resp.json().get("version", "ok")
            return False, f"HTTP {resp.status_code}"
        except Exception as exc:  # noqa: BLE001
            return False, type(exc).__name__

    def public_auth_settings(self) -> tuple[bool, dict]:
        """Fetch public auth settings (provider enablement) — no secrets involved."""
        if not self._config.url:
            return False, {}
        try:
            key = self._config.anon_key or self._config.service_role_key
            resp = httpx.get(
                f"{self._config.url}/auth/v1/settings",
                headers={"apikey": key} if key else {},
                timeout=_TIMEOUT,
            )
            if resp.status_code == 200:
                return True, resp.json()
            return False, {}
        except Exception:  # noqa: BLE001
            return False, {}

    # ---------------- Storage ----------------
    def list_buckets(self) -> tuple[bool, list[str] | str]:
        """List storage buckets (requires service role)."""
        if not self.configured:
            return False, "Supabase server integration not configured."
        try:
            resp = httpx.get(
                f"{self._config.url}/storage/v1/bucket",
                headers=_headers(self._config.service_role_key),
                timeout=_TIMEOUT,
            )
            if resp.status_code != 200:
                return False, f"HTTP {resp.status_code}"
            return True, [b.get("name", "?") for b in resp.json()]
        except Exception as exc:  # noqa: BLE001
            return False, type(exc).__name__

    def create_signed_url(self, bucket: str, path: str, expires_in: int = 300) -> str:
        """Create a short-lived signed URL for a *private* object.

        Refuses public buckets by default: public assets must not be signed.
        """
        self._require()
        if bucket == settings.SUPABASE_STORAGE_PUBLIC_BUCKET:
            raise ValueError("Refusing to sign URLs for the public bucket.")
        resp = httpx.post(
            f"{self._config.url}/storage/v1/object/sign/{quote(bucket)}/{quote(path)}",
            headers=_headers(self._config.service_role_key),
            json={"expiresIn": expires_in},
            timeout=_TIMEOUT,
        )
        resp.raise_for_status()
        signed = resp.json().get("signedURL") or resp.json().get("signedUrl")
        if not signed:
            raise RuntimeError("Supabase did not return a signed URL.")
        return f"{self._config.url}/storage/v1{signed}" if signed.startswith("/") else signed


def supabase_server() -> SupabaseServerClient:
    """FastAPI dependency provider for the server client."""
    return SupabaseServerClient()
