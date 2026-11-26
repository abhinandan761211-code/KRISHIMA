# KRISHIMA

> Agriculture super-application for India — secure, scalable, modular, production-oriented.

**Status:** Phase 0 complete (documentation). **Phase 1 foundation in progress** — backend, frontend and
admin scaffolds exist; auth/JWT/storage verified; PostgreSQL connections await the owner's database
password. See [docs/architecture/03-auth-and-supabase-setup.md](docs/architecture/03-auth-and-supabase-setup.md).
Repository layout standardized to the canonical root-level structure ([ADR-0009](docs/adr/0009-root-level-repository-layout.md)).

- Document index → [docs/README.md](docs/README.md)
- Architecture → [ARCHITECTURE.md](ARCHITECTURE.md)
- Roadmap → [docs/ROADMAP.md](docs/ROADMAP.md)
- Pending decisions → [docs/OPEN-QUESTIONS.md](docs/OPEN-QUESTIONS.md)
- Security policy → [SECURITY.md](SECURITY.md)
- Contributing → [CONTRIBUTING.md](CONTRIBUTING.md)
- Rules for agents/contributors → [AGENTS.md](AGENTS.md)

---

## What is KRISHIMA?

A single platform serving farmers, buyers, retailers, workers, equipment owners, transporters,
warehouses, and content creators. One user identity can hold multiple roles, each with its own
workspace, organization memberships, and permissions.

Full scope: [docs/product/01-product-requirements.md](docs/product/01-product-requirements.md).

## Repository layout (canonical — [full spec](docs/standards/01-repository-structure.md))

```
KRISHIMA/
├── frontend/              # React + TS + Vite marketplace app
├── backend/               # FastAPI modular monolith (the ONLY backend)
├── database/              # Alembic + PostgreSQL functions/triggers/RLS/policies/storage
├── admin/                 # Independent React + TS admin console
├── mobile/                # React Native + Expo (FUTURE — reserved, not implemented)
├── packages/              # Shared TS packages: ui, api-client, types, validation, i18n, config
├── infrastructure/        # docker, deployment (render/vercel), monitoring, networking, backup
├── docs/                  # this documentation set
├── scripts/               # repo-wide developer tooling
├── tests/                 # cross-app integration / e2e / contract tests
├── .github/workflows/     # CI/CD
├── AGENTS.md
├── README.md
├── ARCHITECTURE.md
├── SECURITY.md
├── CONTRIBUTING.md
├── .gitignore
├── .env.example           # index of per-app env templates
├── docker-compose.yml     # local development orchestration
├── package.json           # pnpm workspace root
└── pnpm-workspace.yaml
```

**One application per directory — no duplicate apps.** Shared code lives in `packages/` or
`backend/app/shared/`, never copied between apps. See [ADR-0009](docs/adr/0009-root-level-repository-layout.md).

> **Current state:** only `docs/`, the root project files, and the per-app `.env.example`
> templates exist. Application directories are created in Phase 1. **No placeholder directories or empty business modules** are committed
> merely to make the tree look complete — the structure above is documented now and implemented
> as each phase begins.

## Environments (separate files, never committed)

| App | Template | Consumes |
|-----|----------|----------|
| Frontend | `frontend/.env.example` | only `VITE_*` public values |
| Backend | `backend/.env.example` | all server-only secrets (DB, service role, JWT) |
| Admin | `admin/.env.example` | only `VITE_*` public values |

Root `.env.example` documents shared/non-secret local defaults and the rule: **never commit real
environment files, DB passwords, service-role keys, private API credentials, or auth secrets.**

## Quick start (Phase 1 preview — not yet implemented)

```bash
# Do not run yet: scaffolding lands in Phase 1.
pnpm install
cp backend/.env.example backend/.env     # fill local Supabase values
cp frontend/.env.example frontend/.env   # fill public anon key only
docker compose up
```

## Phase discipline

| Phase | Focus | State |
|-------|-------|-------|
| 0 | Documentation, architecture, ADRs, layout standardization | ✅ complete |
| 1 | Repo scaffold, tooling, DB baseline, auth | ⏳ awaiting approval |

## Principles we will not break

- No hardcoded credentials; service-role keys server-side only.
- Deny-by-default authorization on every protected endpoint; RLS as a backstop.
- No destructive DB changes without explicit authorization.
- No fake working functionality — incomplete features are marked disabled.
- Every business module ships with tests.
- Frontend never holds privileged authorization decisions or DB admin credentials.
