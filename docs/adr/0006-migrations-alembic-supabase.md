# ADR-0006: Coordinated Alembic + Supabase SQL Migrations

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** Database Architect, DevOps
- **Related:** [Repository Structure](../standards/01-repository-structure.md) §6 · [Database ER](../architecture/02-database-er-diagram.md)

## Context

The mandated stack names both **Alembic** and **version-controlled Supabase SQL migrations**.
Two migration mechanisms can diverge, causing drift between schema and policies. We need a single
clear ownership model with predictable ordering, reviewability, and safe rollout.

Supabase SQL is the natural home for things Alembic does not model well: **RLS policies**,
**database functions** (`gen_uuid_v7`, `app.is_staff()`, triggers), and **extensions**
(`pg_trgm`, `btree_gist`). Application-table DDL is best expressed in Alembic (SQLAlchemy models,
autogenerate, type safety).

## Decision

Split ownership by **what** is being changed, not by environment:

| Concern | Owner |
|---------|-------|
| Application tables, columns, FKs, indexes, constraints | **Alembic** (`database/migrations/`) |
| RLS policies, DB functions, triggers, views, storage policies | **Versioned SQL** in `database/policies/`, `database/functions/`, `database/triggers/`, `database/views/`, `database/indexes/`, `database/storage/` (applied via the Alembic flow — *not* a second migration system) |

Rules:
- Alembic is the source of truth for table structure; SQLAlchemy models mirror it.
- The SQL in `database/policies|functions|triggers|views|indexes|storage` never creates/alters
  application table columns (except where a function/trigger requires an extension); it only adds
  policies/functions/triggers/views/indexes. These files are loaded by Alembic `op.execute`
  wrappers so there is a **single migration history** applied in a defined order.
- `database/alembic.ini` points to `backend/app` metadata; SQLAlchemy metadata lives in the
  `backend/app/shared` leaf module to avoid circular imports.
- **Ordering:** extensions/functions → app tables (Alembic) → policies/triggers/views (post step).
  CI applies the whole coordinated flow to a fresh DB to prove it composes.
- All migrations are **forward-only and reviewed**; **destructive changes require explicit
  authorization** and a documented rollback plan.
- Every policy change gets **security sign-off** in review.

## Consequences

**Positive**
- Clear ownership → no drift; each concern uses the best tool.
- Policies are version-controlled and reviewed alongside code.
- CI reproduces the full schema from scratch (catches ordering issues).
- SQLAlchemy autogenerate speeds table changes with type safety.

**Negative / risks**
- Two-step process (run PDF, then policies) must be enforced in CI and runbooks.
- Autogenerate needs human review (may miss constraints/partial indexes).
- Cross-mechanism dependencies (e.g., a policy needs a column added by Alembic) require ordering
  discipline.

**Mitigations**
- CI job "migrate-from-scratch" runs the exact documented order; fails on error.
- Migration checklist in PR template (naming, forward-only, no destructive without approval).
- RLS tests run after migrations in CI (ADR-0008).

## Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Alembic only (models + policies via `op.execute`) | Policies/functions poorly represented; loses SQL review ergonomics |
| Supabase SQL only | Lose SQLAlchemy type safety & autogenerate; harder app coupling |
| Third-party migration tool for both | Not in mandated stack; unnecessary |

## Revisit Trigger

If Supabase CLI tooling changes ownership model significantly, or if a provisioning tool
(Terraform for Supabase) is adopted, revisit with a new ADR.
