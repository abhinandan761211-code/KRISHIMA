# Architecture Decision Records (ADRs)

This directory records significant technical decisions. Each ADR is immutable once Accepted —
superseding decisions create a new ADR that references the old one.

## Format

Each ADR contains: **Status · Context · Decision · Consequences · Alternatives considered**.
Status values: `Proposed`, `Accepted`, `Superseded by ADR-NNNN`, `Deprecated`.

## Index

| ADR | Title | Status |
|-----|-------|--------|
| [0001](0001-modular-monolith.md) | Domain-based modular monolith over microservices | Accepted |
| [0002](0002-uuid-identifiers.md) | UUIDv7 primary keys | Accepted |
| [0003](0003-supabase-auth.md) | Supabase Auth for authentication | Accepted |
| [0004](0004-multi-role-workspaces.md) | Multi-role identity with workspace scoping | Accepted |
| [0005](0005-outbox-background-jobs.md) | Transactional outbox for background processing | Accepted |
| [0006](0006-migrations-alembic-supabase.md) | Coordinated Alembic + Supabase SQL migrations | Accepted |
| [0007](0007-provider-adapters.md) | Adapter pattern for external providers | Accepted |
| [0008](0008-defense-in-depth-authz.md) | Two-layer authorization (application + RLS) | Accepted |
| [0009](0009-root-level-repository-layout.md) | Root-level canonical repository layout | Accepted |
| [0010](0010-public-page-rendering.md) | Public-page rendering: prerender at build time | Proposed |

## Conventions

- Numbering is sequential, never reused.
- A decision that affects security, data model, or public API **requires** an ADR.
- PRs that change an accepted decision must add a superseding ADR.
