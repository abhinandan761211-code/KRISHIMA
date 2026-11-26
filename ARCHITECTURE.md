# KRISHIMA — Architecture

> Entry point for the architecture. Deep detail lives in [`docs/`](docs/README.md). Rules that
> must never be broken live in [AGENTS.md](AGENTS.md); decisions are recorded as ADRs in
> [`docs/adr/`](docs/adr/README.md).

## Summary

KRISHIMA is a **domain-based modular monolith** (FastAPI, `backend/`) serving a React web app
(`frontend/`), an independent React admin console (`admin/`), and a future React Native app
(`mobile/`), on PostgreSQL via Supabase, with shared TypeScript packages (`packages/`) and
infrastructure/Docker/CI config (`infrastructure/`).

Canonical layout decision: [ADR-0009: Root-level canonical repository layout](docs/adr/0009-root-level-repository-layout.md).

```
frontend/   React + TS + Vite        ──JWT──▶  backend/  FastAPI  ──▶  PostgreSQL (Supabase)
admin/      React + TS + Vite        ──JWT──▶  (same)    /api/v1/admin    + RLS + storage
mobile/     React Native + Expo       (future) ─▶ same backend + api-client
packages/   ui · api-client · types · validation · i18n · config   (browser-safe, shared)
database/   Alembic migrations + functions/triggers/RLS/policies/storage
infrastructure/  docker · deployment(render/vercel) · monitoring · networking · backup
```

## Key documents

| Topic | Document |
|-------|----------|
| Repository structure (canonical) | [docs/standards/01-repository-structure.md](docs/standards/01-repository-structure.md) |
| System design (modules, layers, scaling) | [docs/architecture/01-system-design.md](docs/architecture/01-system-design.md) |
| Database model & ER diagram | [docs/architecture/02-database-er-diagram.md](docs/architecture/02-database-er-diagram.md) |
| API standards | [docs/standards/02-api-design-standards.md](docs/standards/02-api-design-standards.md) |
| Account & permission matrix | [docs/product/02-account-permission-matrix.md](docs/product/02-account-permission-matrix.md) |
| Security threat model | [docs/security/01-threat-model.md](docs/security/01-threat-model.md) |
| Design system | [docs/design/01-design-system-spec.md](docs/design/01-design-system-spec.md) |
| Product requirements | [docs/product/01-product-requirements.md](docs/product/01-product-requirements.md) |
| Roadmap | [docs/ROADMAP.md](docs/ROADMAP.md) |
| Definition of Done | [docs/DEFINITION-OF-DONE.md](docs/DEFINITION-OF-DONE.md) |
| Open questions & assumptions | [docs/OPEN-QUESTIONS.md](docs/OPEN-QUESTIONS.md) |

## Architectural constraints (headline)

- **One app per top-level directory**; no `apps/`, no duplicate backend/database.
- **Frontend never** holds DB admin credentials, service-role keys, or privileged authorization.
- **Backend** owns business logic, authorization, persistence, and integrations; versioned REST
  under `/api/v1`; OpenAPI generated from FastAPI.
- **Database**: Alembic is authoritative; RLS enforced; runtime DB role is least-privilege and does
  **not** bypass RLS.
- **Adapters** isolate external providers (payments/SMS/geo/storage).
- **Outbox** decouples background work for future horizontal scale (no rewrite).
- **Two-layer authorization** (application + RLS) — defense in depth.

## ADR index

| ADR | Decision |
|-----|----------|
| [0001](docs/adr/0001-modular-monolith.md) | Modular monolith over microservices |
| [0002](docs/adr/0002-uuid-identifiers.md) | UUIDv7 primary keys |
| [0003](docs/adr/0003-supabase-auth.md) | Supabase Auth for authentication |
| [0004](docs/adr/0004-multi-role-workspaces.md) | Multi-role identity + workspace scoping |
| [0005](docs/adr/0005-outbox-background-jobs.md) | Transactional outbox for background work |
| [0006](docs/adr/0006-migrations-alembic-supabase.md) | Coordinated Alembic + versioned SQL migrations |
| [0007](docs/adr/0007-provider-adapters.md) | Adapter pattern for external providers |
| [0008](docs/adr/0008-defense-in-depth-authz.md) | Two-layer authorization (app + RLS) |
| [0009](docs/adr/0009-root-level-repository-layout.md) | Root-level canonical repository layout |

## Current status

Phase 0 (documentation + layout standardization) is complete. Phase 1 (foundation implementation)
has **not** started. See [docs/ROADMAP.md](docs/ROADMAP.md).
