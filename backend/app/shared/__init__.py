"""Shared kernel package (leaf module — safe for Alembic to import)."""

from app.shared.base import (
    APPLICATION_SCHEMA,
    Base,
    TimestampMixin,
    UUIDPrimaryKeyMixin,
    metadata_obj,
    new_uuid,
)

__all__ = [
    "APPLICATION_SCHEMA",
    "Base",
    "TimestampMixin",
    "UUIDPrimaryKeyMixin",
    "metadata_obj",
    "new_uuid",
]
