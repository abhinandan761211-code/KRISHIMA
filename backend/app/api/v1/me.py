"""Authenticated identity endpoint — proves the token → principal path end to end."""

from __future__ import annotations

from fastapi import APIRouter, Request
from pydantic import BaseModel

from app.core.errors import Unauthenticated

router = APIRouter()


class MeResponse(BaseModel):
    user_id: str
    auth_uid: str
    email: str | None
    # Coarse Supabase role claim, informational only. Application roles are resolved
    # server-side from our own tables and are NOT part of this endpoint yet.
    token_role: str | None
    authenticated: bool


@router.get("", response_model=MeResponse, summary="Current authenticated identity")
def me(request: Request) -> MeResponse:
    principal = getattr(request.state, "principal", None)
    if principal is None:
        raise Unauthenticated()
    return MeResponse(
        user_id=str(principal.user_id),
        auth_uid=principal.auth_uid,
        email=principal.email,
        token_role=principal.role,
        authenticated=True,
    )
