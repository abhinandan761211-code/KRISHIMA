"""Alembic environment for KRISHIMA.

The migration URL comes from ``MIGRATION_DATABASE_URL`` (a **separate,
higher-privilege credential**). It is never the runtime URL. The application
metadata is imported from ``app.shared`` (a leaf module) so there is **no circular
import** and Alembic does not need to import the whole application.
"""

from __future__ import annotations

import os
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import create_engine, pool

# --- make the backend package importable (metadata lives in app.shared) -----------
ROOT = Path(__file__).resolve().parents[2]  # repository root
BACKEND = ROOT / "backend"
if str(BACKEND) not in sys.path:
    sys.path.insert(0, str(BACKEND))

# --- load database/.env (migration credentials) before reading config -------------
try:
    from dotenv import load_dotenv

    load_dotenv(Path(__file__).resolve().parents[1] / ".env")
except Exception:  # pragma: no cover - dotenv is a declared dependency
    pass

from app.shared import metadata_obj  # noqa: E402  (import after sys.path setup)

config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = metadata_obj
DB_SCHEMA = os.getenv("DB_SCHEMA", "app")


def _migration_url(required: bool = True) -> str:
    url = os.getenv("MIGRATION_DATABASE_URL", "")
    if (not url or "REPLACE_WITH" in url) and required:
        raise RuntimeError(
            "MIGRATION_DATABASE_URL is not configured. Copy database/.env.example to "
            "database/.env and set the migration (owner) connection string."
        )
    return url


def include_object(object, name, type_, reflected, compare_to):  # noqa: A002, ANN001
    """Ignore Supabase-managed schemas; only own the application schema."""
    if type_ == "table" and getattr(object, "schema", None) in {
        "auth",
        "storage",
        "realtime",
        "vault",
        "extensions",
        "graphql",
        "graphql_public",
        "supabase_migrations",
        "pgsodium",
        "pgsodium_masks",
        "net",
        "cron",
        "pgbouncer",
    }:
        return False
    return True


def run_migrations_offline() -> None:
    # Offline mode only renders SQL; a live URL is not required.
    context.configure(
        url=_migration_url(required=False) or "postgresql+psycopg://offline@localhost/postgres",
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_schemas=True,
        version_table_schema=DB_SCHEMA,
        include_object=include_object,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    # Build the engine DIRECTLY from the URL rather than via engine_from_config().
    #
    # Why: the migration password must be percent-encoded (e.g. `Rail%402026Abhi`
    # for `Rail@2026Abhi`), and `engine_from_config` round-trips the value through
    # Python's ConfigParser, which treats `%` as interpolation syntax and raises
    # `ValueError: invalid interpolation syntax`. That failure used to be swallowed,
    # so `alembic upgrade` exited 0 while applying nothing (the B-1 `app` schema
    # stayed empty). create_engine() takes the string verbatim, so `%` is safe.
    connectable = create_engine(_migration_url(), poolclass=pool.NullPool, future=True)
    with connectable.connect() as connection:
        # Ensure the application schema exists before any version tracking.
        connection.exec_driver_sql(f'CREATE SCHEMA IF NOT EXISTS "{DB_SCHEMA}"')
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_schemas=True,
            version_table_schema=DB_SCHEMA,
            include_object=include_object,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()
        # COMMIT EXPLICITLY.
        #
        # SQLAlchemy 2.0 puts a Connection in "begin once" mode: the
        # exec_driver_sql() above opens a transaction, and closing the connection
        # without commit() rolls it back. Alembic's context.begin_transaction()
        # only nests inside that transaction, so without this line every migration
        # (schema, functions, alembic_version rows) is silently discarded while
        # `alembic upgrade` still exits 0. That was the final layer of B-1.
        connection.commit()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
