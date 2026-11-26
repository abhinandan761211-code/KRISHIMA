# KRISHIMA — Repository Structure Specification

- **Version:** 2.0 (Foundation Standardization — supersedes 1.0)
- **Owner:** Principal Architect / DevOps
- **Status:** **Canonical.** Binding for all future KRISHIMA work. Implemented in Phase 1;
  only `docs/`, root files, and per-app `.env.example` templates exist today.
- **Companions:** [System Design](../architecture/01-system-design.md) · [API Standards](02-api-design-standards.md) · [ADR-0009](../adr/0009-root-level-repository-layout.md)

> **Change from v1.0:** the previous `apps/{web,admin,api,mobile}` layout is **replaced** by
> root-level `frontend/`, `backend/`, `admin/`, `mobile/`, `database/`, `packages/`,
> `infrastructure/`. There is exactly **one** application per top-level directory — no duplicate
> apps are permitted. See [ADR-0009](../adr/0009-root-level-repository-layout.md) for the decision.

---

## 1. Canonical Top-Level Layout

```
KRISHIMA/
├── frontend/              # React + TS + Vite marketplace app (farmers, buyers, workers…)
├── backend/               # FastAPI modular monolith (the ONLY backend)
├── database/              # Alembic + PostgreSQL functions/triggers/RLS/policies/storage
├── admin/                 # Independent React + TS admin console (separate build)
├── mobile/                # React Native + Expo (FUTURE — reserved, not implemented)
├── packages/              # Shared TS workspace packages
│   ├── ui/
│   ├── api-client/
│   ├── types/
│   ├── validation/
│   ├── i18n/
│   └── config/
├── infrastructure/        # Docker, deployment, monitoring, networking, backup
│   ├── docker/
│   ├── deployment/
│   │   ├── render/
│   │   └── vercel/
│   ├── monitoring/
│   ├── networking/
│   └── backup/
├── docs/                  # THIS documentation set
├── scripts/               # repo-wide developer tooling
├── tests/                 # cross-cutting integration / e2e / contract tests
├── .github/
│   └── workflows/         # CI/CD pipelines
├── AGENTS.md              # permanent architecture rules for AI agents & contributors
├── README.md
├── ARCHITECTURE.md        # architecture entry point (links into docs/)
├── SECURITY.md            # security policy & reporting
├── CONTRIBUTING.md        # contribution workflow & standards
├── .gitignore
├── .env.example           # root index of per-app env templates (no real values)
├── docker-compose.yml     # local development orchestration
├── package.json           # pnpm workspace root
└── pnpm-workspace.yaml
```

### 1.1 Directory ownership (single source of truth)

| Directory | Owns | Must never contain |
|-----------|------|--------------------|
| `frontend/` | Marketplace React app | DB creds, service-role keys, privileged authz, backend business rules |
| `backend/` | All business logic, authz, persistence, integrations | Browser code |
| `database/` | Schema migrations, DB functions, RLS, storage policies | Application logic |
| `admin/` | Staff console UI | A second backend or DB |
| `mobile/` | Future Expo app | A copy of backend logic |
| `packages/` | Shared *browser-safe* TS code | Server secrets, server-only logic |
| `infrastructure/` | Docker, deploy, monitoring, backup config | Application source |
| `tests/` | Cross-app integration/e2e/contract suites | Product feature code |

### 1.2 One application per directory (no duplicates)

- There is **one** frontend (`frontend/`), **one** backend (`backend/`), **one** admin
  (`admin/`), **one** future mobile app (`mobile/`).
- A file/feature exists in exactly one place; shared code is promoted to `packages/`, never copied.
- `admin/` and `mobile/` **consume** the `backend/` API — they never ship their own backend/DB.

---

## 2. frontend/

Technology: React · TypeScript · Vite · Tailwind CSS · shadcn/ui · React Router ·
TanStack Query · Zustand · React Hook Form · Zod · i18next · Vitest · Playwright.

```
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── router/          # route tree, guards, lazy boundaries
│   │   ├── providers/       # QueryClient, Auth, Theme, i18n providers
│   │   └── layouts/         # AppShell, AuthLayout, ErrorBoundary layouts
│   ├── features/            # feature-based; one folder per business capability
│   │   ├── landing/
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── farmer/
│   │   ├── buyer/
│   │   ├── retailer/
│   │   ├── worker/
│   │   ├── equipment/
│   │   ├── transporter/
│   │   ├── warehouse/
│   │   ├── creator/
│   │   ├── marketplace/
│   │   ├── community/
│   │   ├── video-hub/
│   │   ├── messages/
│   │   ├── notifications/
│   │   └── account/
│   ├── components/          # cross-feature components (design system re-exports + composites)
│   ├── services/            # centralized API client usage, Supabase client wrappers
│   ├── hooks/               # shared hooks
│   ├── stores/              # Zustand stores (session, active workspace, UI prefs)
│   ├── types/               # frontend-local types (shared ones live in packages/types)
│   ├── utils/
│   ├── lib/                 # framework-agnostic helpers, config, constants
│   ├── config/              # runtime config from import.meta.env (validated)
│   ├── styles/              # Tailwind entry + token wiring
│   ├── assets/
│   └── main.tsx
├── tests/                   # Vitest unit/component + Playwright e2e specs
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── Dockerfile
```

**Feature internals (use only what the feature needs):**

```
features/<feature>/
├── pages/        # route-level components
├── components/   # feature-specific UI
├── hooks/        # feature data/behaviour hooks
├── api/          # TanStack Query hooks + mutations calling services/
├── schemas/      # Zod schemas (forms + payload validation)
├── types/
├── utils/
├── tests/
└── routes.tsx    # feature route definitions consumed by app/router
```

**Rules**
- A feature imports only `components/`, `services/`, `hooks/`, `stores/`, `lib/`, `utils/`,
  `types/`, shared packages, and its own folder. **No feature imports another feature's internals.**
- All server state via TanStack Query; Zustand holds only client/session state.
- Centralized API client in `services/` (built on `packages/api-client`). No scattered `fetch`.
- Supabase JS client is used **only** for auth session handling and explicitly approved storage
  operations. Business-critical DB operations go through the FastAPI backend.
- Frontend must **never** hold DB admin credentials, service-role keys, or authorization
  decisions that the backend trusts.

## 3. backend/

Technology: Python · FastAPI · Pydantic · SQLAlchemy · PostgreSQL · Supabase Auth · Pytest.
Domain-based **modular monolith** (ADR-0001).

```
backend/
├── app/
│   ├── main.py              # app factory, router registration, lifespan, middleware wiring
│   ├── core/                # config, security (JWT verify), errors, logging, pagination,
│   │                        # idempotency, rate_limit, db session & RLS context
│   ├── api/
│   │   └── v1/              # versioned router assembly; mounts module routers
│   ├── middleware/          # correlation-id, authN, authZ, rate-limit, error handling
│   ├── modules/             # business domains (modular monolith)
│   │   ├── identity/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── organizations/
│   │   ├── verification/
│   │   ├── locations/
│   │   ├── farms/
│   │   ├── crops/
│   │   ├── marketplace/
│   │   ├── procurement/
│   │   ├── retail/
│   │   ├── employment/
│   │   ├── equipment/
│   │   ├── logistics/
│   │   ├── warehouse/
│   │   ├── orders/
│   │   ├── bookings/
│   │   ├── payments/
│   │   ├── community/
│   │   ├── creator/
│   │   ├── media/
│   │   ├── messaging/
│   │   ├── notifications/
│   │   ├── analytics/
│   │   ├── support/
│   │   └── admin/
│   ├── integrations/        # external provider adapters (payments, SMS, geo, storage) — ADR-0007
│   ├── shared/              # cross-module primitives (base repo, pagination DTOs, enums)
│   └── workers/             # outbox dispatcher / background jobs (ADR-0005)
├── tests/                   # unit, integration, RLS
├── .env.example
├── pyproject.toml           # pinned deps, ruff, mypy, pytest, import-linter
├── Dockerfile
└── README.md
```

**Module internals (create only the files a module actually needs):**

```
modules/<domain>/
├── __init__.py      # explicit public interface (router + contracts)
├── router.py        # HTTP endpoints only
├── models.py        # SQLAlchemy ORM mappings
├── schemas.py       # Pydantic request/response models
├── service.py       # business rules + transaction boundaries
├── repository.py    # persistence & queries
├── permissions.py   # resource/role authorization for this domain
├── events.py        # domain/business events emitted
└── tests/           # module-local tests (also aggregated under backend/tests)
```

**Responsibilities:** routers = HTTP; schemas = validation/serialization; services = business
rules + transactions; repositories = persistence; models = ORM; permissions = authz; events =
business events; integrations = external providers.

**Rules**
- Versioned REST API mounted under **`/api/v1`**.
- No circular imports; modules do not import another module's `models`/`repository` (import-linter
  in CI). Cross-module calls go through the exported service interface / `contracts`.
- **No microservices** prematurely (ADR-0001).

> **Naming note:** the twenty-six module names above are the canonical domain vocabulary. The
> earlier PRD used shorter names (`kyc`, `catalog`, `labour`, `storage`, `content`, `audit`).
> Mapping is documented in [PRD §5](../product/01-product-requirements.md#5-domain-map); the
> longer names are authoritative for code directories.

## 4. database/

Provider: **Supabase PostgreSQL**. Alembic is the **authoritative** mechanism for application-owned
schema changes (ADR-0006, restated below).

```
database/
├── migrations/              # Alembic env + versions (single migration history)
├── seeds/
│   ├── development/
│   ├── testing/
│   └── reference/           # canonical reference data (roles, categories, units)
├── policies/                # RLS policy SQL (applied via coordinated migrations)
├── functions/               # SQL functions (gen_uuid_v7(), app.is_staff(), …)
├── triggers/
├── views/
├── indexes/
├── storage/
│   ├── buckets/             # bucket definitions (private/public)
│   └── policies/            # storage access policies
├── tests/
│   ├── constraints/         # constraint tests
│   ├── rls/                 # cross-tenant leak tests
│   └── migrations/          # migrate-from-scratch tests
├── diagrams/                # ER diagrams referenced by docs
├── scripts/                 # db helper scripts (migrate, seed, backup-check)
├── alembic.ini
└── README.md
```

### 4.1 Migration rules
- **Alembic is authoritative** for application schema. Its `env.py` imports backend SQLAlchemy
  metadata (`backend/app/...`) — the import path is added at `alembic.ini`/`env.py` level so
  **no circular import** occurs; metadata lives in `backend/app/shared` (a leaf module).
- **Do not maintain multiple independent migration histories** for the same objects. Alembic owns
  tables/columns. The SQL directories (`policies/`, `functions/`, `triggers/`, `views/`, `indexes/`,
  `storage/`) are **referenced source files applied as part of the coordinated migration flow**
  (e.g., via Alembic `op.execute` or the documented Supabase apply step per ADR-0006) — they are
  **not** a second migration system and must **not** be applied ad hoc.
- Apply order (single coordinated flow): Alembic revisions → Alembic-embedded `op.execute`
  wrappers load the versioned SQL from `policies/`/`functions/`/`triggers/`/`views/`/`indexes/`.
- **Do not** modify Supabase-managed `auth.*` tables. **Do not** edit production schema via the
  Supabase dashboard — every change needs a reviewed migration.

### 4.2 Required database guarantees
- PKs (UUIDv7, ADR-0002), FKs, unique & check constraints, appropriate indexes.
- Decimal (never float) monetary values `numeric(14,2)`; quantities `numeric(14,3)`.
- Explicit transaction boundaries; consistent UTC timestamps.
- Resource ownership + organization isolation exposed as `workspace_id`/`organization_id`.
- **RLS enabled** on all tenant/personal tables; **private storage policies** for identity docs.
- Documented backup & restore procedure (see `infrastructure/backup/`).

### 4.3 Backend connection & RLS context (critical)
> A privileged SQLAlchemy connection does **not** inherit an authenticated user's RLS context.
> RLS is enforced only when Postgres session variables (`app.current_user_id`,
> `app.current_workspace_id`) are set **and** the connection role is subject to RLS.

Therefore:
- The API runtime uses a **least-privilege role** (no `BYPASSRLS`, no DDL).
- Every request sets the session GUCs (`SET LOCAL app.current_user_id = …; SET LOCAL
  app.current_workspace_id = …`) inside the transaction before queries (ADR-0008).
- A **separate, higher-privilege migration credential** (owner role) runs Alembic only.
- The **service-role key** is server-side only and used for migrations/admin jobs/audit writing,
  never for user-facing request paths without a documented reason.

### 4.4 Safety
- **Never** reset or delete an existing database without explicit written approval.
- Migration tests run against an **isolated non-production** database only.

## 5. admin/

Independent React + TypeScript console.
- Communicates with the **same** `backend/` via protected `/api/v1/admin/*` endpoints.
- **No** duplicate backend/database.
- Separate platform-administration permissions, **MFA requirement**, granular access control,
  full **audit logging** of admin actions.
- Admin roles/permissions are granted **server-side only** — never derived from frontend role
  selection or user-editable profile metadata.
- Separate build & deploy target; never bundles marketplace code and is never bundled into it.

## 6. mobile/

Reserved for the future **React Native + Expo** app. Reuses `packages/api-client`,
`packages/types`, `packages/i18n`, and the existing backend/auth. **Do not install or implement**
the mobile app during the foundation phase. Browser-only components from `packages/ui` must not be
assumed compatible with React Native.

## 7. packages/

TypeScript workspace packages (pnpm). Backend keeps its own Python dependency management.

| Package | Contents | Consumers |
|---------|----------|-----------|
| `ui` | shadcn/ui primitives, tokens, layout, form controls, states | frontend, admin |
| `api-client` | Typed client generated from FastAPI OpenAPI | frontend, admin, (mobile) |
| `types` | Shared enums/DTO types mirroring API contracts | frontend, admin, (mobile) |
| `validation` | Shared Zod schemas | frontend, admin |
| `config` | Shared eslint / tsconfig / tailwind / prettier presets | all TS packages |

> **i18n note (as implemented):** the i18n runtime (`initI18n`, `I18nProvider`, `useI18n`,
> `LanguageSwitcher`) lives in `packages/ui/src/i18n/` because it ships React UI and is consumed by
> every app's provider stack — it is not a separate `packages/i18n`. Message catalogues are
> **app-owned** and live with their feature
> (`frontend/src/features/public-website/i18n/{en,hi,index}.ts`) so each app controls its own copy.
> There is no `frontend/src/locales/`. See
> [`docs/testing/I18N_VALIDATION_REPORT.md`](../testing/I18N_VALIDATION_REPORT.md).

- Internal only (`workspace:*`); not published.
- `api-client` types are **generated from the OpenAPI contract** (`scripts/gen-api-client`), not
  hand-written duplicates.
- **Never** place browser-only or server-secret code here for reuse by React Native.

## 8. infrastructure/

```
infrastructure/
├── docker/                  # Dockerfiles/compose fragments used by root docker-compose.yml
├── deployment/
│   ├── render/              # Render service definitions (backend + admin/frontend if hosted)
│   └── vercel/              # Vercel project + build config for frontend/admin
├── monitoring/              # uptime, error tracking, log config
├── networking/              # DNS, CORS origins, TLS notes
└── backup/                  # DB backup & restore procedures/scripts
```

**Deployment targets:** frontend → `frontend/`; backend → `backend/`; admin → `admin/`;
migrations → `database/`.

> Monorepo build contexts must include shared packages and `database/` migration files when a
> build depends on them. Setting a platform "root directory" alone is **not** sufficient — the
> build context/install step must copy or install the required workspace/packages and migration
> directory. This is configured explicitly in `infrastructure/deployment/*`.

- Separate **development / staging / production** configurations; health checks; CI validation.

## 9. tests/ (root)

Cross-cutting suites that span more than one app: API contract tests, end-to-end flows
(Playwright bootstrapping frontend + backend), and integration checks. Per-app unit tests live in
`frontend/tests/`, `backend/tests/`, and `database/tests/`.

## 10. Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Python modules/packages | `snake_case` | `equipment_bookings` |
| Python classes | `PascalCase` | `EquipmentBookingService` |
| TS components | `PascalCase` files | `ListingCard.tsx` |
| TS hooks | `useX` | `useListings.ts` |
| DB tables | `snake_case`, plural | `order_items` |
| DB columns | `snake_case` | `total_amount` |
| API paths | kebab-case nouns, plural | `/api/v1/equipment-bookings` |
| Env vars | `SCREAMING_SNAKE_CASE` | `SUPABASE_SERVICE_ROLE_KEY` |
| Branches | `type/scope-short-desc` | `feat/orders-idempotency` |
| Commits | Conventional Commits | `feat(orders): add idempotency key` |

## 11. Branching & Review

- Trunk-based with short-lived feature branches; PR required; CI must pass.
- Protected `main`; production deploy gated by environment approval.
- Docs changes ship in the same PR as the decision they record.

## 12. What Must Never Appear in the Repo

- `.env` with real values, service-role keys, JWT secrets, private keys.
- Production data dumps / fixtures containing real PII.
- Generated secrets or real tokens in tests (use fakes).
- Credentials copied from any other project (e.g., the old CenAGRI AI project).

## 13. Phase 1 Creation Order (implementation checklist)

1. Root workspace files (`package.json`, `pnpm-workspace.yaml`, `docker-compose.yml`).
2. `packages/config` → `packages/ui` → `frontend/` shell.
3. `backend/` skeleton (core config/logging/health/error envelope/db session + `/api/v1` router).
4. `database/` Alembic baseline + first coordinated RLS/policy SQL set.
5. `infrastructure/docker` + `.github/workflows` CI.
6. `admin/` shell (minimal, staff-guarded, MFA-aware) — after frontend/backend are stable.

Mobile is created only when explicitly requested (Phase ≥8).

## 14. Migration Mapping (from superseded v1.0 layout)

| Superseded path | Canonical path |
|-----------------|----------------|
| `apps/web/` | `frontend/` |
| `apps/admin/` | `admin/` |
| `apps/api/` | `backend/` |
| `apps/api/krishima/` | `backend/app/` |
| `backend db/` (internal) | `database/` |
| `backend adapters/` | `backend/app/integrations/` |
| `infra/` | `infrastructure/` |
| `packages/domain-types/` | `packages/types/` |
| `database/supabase/` | `database/policies/`, `functions/`, `triggers/` (per concern) |

No files needed moving in this task: no application code existed yet. The mapping is recorded so
any future reference to the old layout can be resolved unambiguously.
