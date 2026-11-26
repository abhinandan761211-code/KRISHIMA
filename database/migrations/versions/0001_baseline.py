"""baseline: application schema and UUIDv7 helper

Creates only infrastructure — no business tables. Per the Phase 1 boundary, business
tables are introduced in later phases.

Revision ID: 0001_baseline
Revises:
Create Date: 2026-11-25
"""

from __future__ import annotations

from collections.abc import Sequence

from alembic import op

revision: str = "0001_baseline"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

SCHEMA = "app"


def upgrade() -> None:
    # Application schema (idempotent; env.py also ensures it exists pre-migration).
    op.execute(f'CREATE SCHEMA IF NOT EXISTS "{SCHEMA}"')

    # UUIDv7 generator. Uses pgcrypto-free approach: timestamp prefix + random tail.
    # Requires PostgreSQL 13+. Kept in app schema; RLS/functions live here by design.
    op.execute(
        f"""
        CREATE OR REPLACE FUNCTION "{SCHEMA}".gen_uuid_v7()
        RETURNS uuid
        LANGUAGE sql
        VOLATILE
        AS $$
            SELECT encode(
                set_bit(set_bit(overlay(uuid_send(gen_random_uuid())
                    PLACING substring(int8send((extract(epoch from clock_timestamp())*1000)::bigint) from 3)
                    FROM 1 FOR 6), 52, 1), 53, 1),
                'hex')::uuid
        $$;
        """
    )


def downgrade() -> None:
    op.execute(f'DROP FUNCTION IF EXISTS "{SCHEMA}".gen_uuid_v7();')
    # The schema itself is intentionally NOT dropped by a downgrade.
