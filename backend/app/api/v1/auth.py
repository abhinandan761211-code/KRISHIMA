"""Auth configuration endpoint (public, non-secret).

Lets the frontend discover the login capabilities the backend/Supabase project
supports without hard-coding them. Contains **no secrets**.
"""

from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.config import settings
from app.integrations.supabase import supabase_server

router = APIRouter()


class AuthConfig(BaseModel):
    email_password_enabled: bool
    google_enabled: bool
    email_confirmation_required: bool
    jwt_verification_mode: str
    redirect_callback_path: str = "/auth/callback"


@router.get("/config", response_model=AuthConfig, summary="Public auth capability configuration")
def auth_config() -> AuthConfig:
    ok, s = supabase_server().public_auth_settings()
    external = (s or {}).get("external", {}) if ok else {}
    return AuthConfig(
        email_password_enabled=bool(external.get("email", True)),
        google_enabled=bool(external.get("google", settings.SUPABASE_OAUTH_GOOGLE_ENABLED)),
        email_confirmation_required=not bool((s or {}).get("mailer_autoconfirm", False)),
        jwt_verification_mode=settings.auth_mode(),
    )
