"""Declarative base, naming conventions, and UUID/timestamp mixins.

This module is a **leaf**: it imports nothing from ``modules``, so Alembic can
import the SQLAlchemy ``metadata`` without pulling in the whole application and
without introducing circular imports.
"""

from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import MetaData, func
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

# Deterministic constraint naming so Alembic autogenerate produces stable, reviewable
# migration operations (see ADR-0006).
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

# Application tables live in the dedicated ``app`` schema (OPEN-QUESTIONS T-01).
APPLICATION_SCHEMA = "app"

metadata_obj = MetaData(schema=APPLICATION_SCHEMA, naming_convention=NAMING_CONVENTION)


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""

    metadata = metadata_obj


def new_uuid() -> uuid.UUID:
    """Generate a UUIDv7 if available, else a v4 fallback (documented behaviour)."""
    try:
        from uuid import uuid7  # Python 3.14+
    except ImportError:  # pragma: no cover - older interpreters
        return uuid.uuid4()
    return uuid7()  # type: ignore[return-value]


class UUIDPrimaryKeyMixin:
    """UUID primary key column (time-ordered UUIDv7 preferred, see ADR-0002).

    The value is generated application-side by :func:`new_uuid` at insert time.
    """

    id: Mapped[uuid.UUID] = mapped_column(
        PGUUID(as_uuid=True),
        primary_key=True,
        default=new_uuid,
    )


class TimestampMixin:
    """UTC ``created_at`` / ``updated_at`` columns (server-side defaults)."""

    created_at: Mapped[datetime] = mapped_column(server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        server_default=func.now(), onupdate=func.now(), nullable=False
    )
