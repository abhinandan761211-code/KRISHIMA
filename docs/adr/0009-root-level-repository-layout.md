# ADR-0009: Root-Level Canonical Repository Layout

- **Status:** Accepted — **supersedes the layout portion of the Phase 0 draft**
- **Date:** 2026-11-25
- **Deciders:** Principal Architect, DevOps, Technical Lead
- **Related:** [Repository Structure](../standards/01-repository-structure.md) · [System Design](../architecture/01-system-design.md) · [ADR-0001](0001-modular-monolith.md)

## Context

The Phase 0 documentation proposed an `apps/{web,admin,api,mobile}` monorepo layout. That layout
is ambiguous: "apps" mixes a browser frontend, an admin frontend, a Python backend, and a future
mobile app under one umbrella, and the backend's internal Python package (`krishima/`) nested
under `apps/api/` obscured the distinction between *deployables* and *the database*.

The project owner has mandated a **canonical root-level layout** where each major concern has its
own clearly separated top-level directory:

```
frontend/  backend/  database/  admin/  mobile/  packages/  infrastructure/  docs/  scripts/  tests/
```

## Decision

Adopt the root-level canonical layout as the **permanent foundation** for all KRISHIMA work.

- `frontend/` — the single marketplace React app.
- `backend/` — the single FastAPI modular monolith; Python package lives at `backend/app/`.
- `database/` — Alembic migrations + PostgreSQL functions/triggers/RLS/policies/storage.
- `admin/` — independent React admin console (no second backend/DB).
- `mobile/` — reserved for the future Expo app; **not implemented** in the foundation phase.
- `packages/` — shared browser-safe TS packages (`ui`, `api-client`, `types`, `validation`,
  `i18n`, `config`).
- `infrastructure/` — docker, deployment (render/vercel), monitoring, networking, backup.
- `tests/` — cross-app integration/e2e/contract suites.

**Exactly one application per top-level directory. No duplicate applications.** Shared code is
promoted to `packages/` or `backend/app/shared/`, never copied between apps.

Mapping from the superseded layout is recorded in
[Repository Structure §14](../standards/01-repository-structure.md#14-migration-mapping-from-superseded-v10-layout).

## Consequences

**Positive**
- Unambiguous ownership: each top-level directory has a single, obvious purpose.
- Deployment targets map 1:1 to directories (`frontend/`, `backend/`, `admin/`), simplifying
  platform configuration.
- The backend Python package (`backend/app`) and the database (`database/`) are visibly distinct,
  reinforcing "Alembic is authoritative, not the app".
- Easier onboarding: the tree explains the system.

**Negative / risks**
- All documentation, CI, and Docker paths must reference the new roots (done in this change).
- Deployment platforms that assume a single `apps/*` root need explicit build-context config that
  includes `packages/` and `database/` where required.
- Slightly deeper paths (`backend/app/...`).

**Mitigations**
- Build contexts configured in `infrastructure/deployment/*` to include workspace packages and
  migration files when needed — a platform "root directory" alone is insufficient.
- Docs updated in the same change; ADR-0006 migration flow updated to `database/*` SQL dirs.
- `AGENTS.md` records the rule so future contributors/agents cannot reintroduce `apps/*`.

## Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Keep `apps/{web,admin,api,mobile}` | Ambiguous; mixes deployables with the Python package; owner mandated root-level separation |
| Turborepo/Nx `apps/` + `packages/` convention | Same ambiguity; tool convention does not override the explicit architecture requirement |
| Flat repo (no grouping) | No boundary clarity at 10M-user scale; hard to enforce ownership |

## Enforcement

- CI path filters and `AGENTS.md` reference only canonical roots.
- A repo check (Phase 1) fails if a new `apps/` directory or a second backend/frontend appears.
- This ADR is referenced by every structure document; changing it requires a superseding ADR.
