# KRISHIMA — System Design Document

- **Version:** 1.1 (Phase 0 + foundation standardization)
- **Owner:** Principal Software Architect
- **Status:** Proposed (paths aligned to canonical root layout, see [Repository Structure](../standards/01-repository-structure.md))
- **Companions:** [PRD](../product/01-product-requirements.md) · [DB ER](../architecture/02-database-er-diagram.md) · [API Standards](../standards/02-api-design-standards.md) · [Threat Model](../security/01-threat-model.md) · ADRs

---

## 1. Architecture at a Glance

KRISHIMA is a **domain-based modular monolith** (FastAPI) with a separately built React web
app and React admin app, on PostgreSQL via Supabase, deployed in Docker containers.

```
                 ┌─────────────────────────┐      ┌──────────────────────────┐
   Browser  ────▶│ frontend/ (React/Vite)  │      │ admin/ (React/Vite)      │◀──── Staff
   (farmers…)    │ TanStack Query + Zustand│      │ separate build + routes  │
                 └───────────┬─────────────┘      └────────────┬─────────────┘
                             │  HTTPS (JWT Bearer)             │
                             ▼                                 ▼
                 ┌───────────────────────────────────────────────────────────┐
                 │            backend/  — FastAPI modular monolith            │
                 │  ┌──────────────────────────────────────────────────────┐ │
                 │  │ API layer (routers, Pydantic schemas, OpenAPI)       │ │
                 │  ├──────────────────────────────────────────────────────┤ │
                 │  │ Application layer (use-cases, authz, transactions)   │ │
                 │  ├──────────────────────────────────────────────────────┤ │
                 │  │ Domain layer (entities, value objects, rules, states)│ │
                 │  ├──────────────────────────────────────────────────────┤ │
                 │  │ Infrastructure (SQLAlchemy repos, adapters, jobs)    │ │
                 │  └──────────────────────────────────────────────────────┘ │
                 │   Middleware: authN · authZ · rate-limit · audit · errors  │
                 └───────────────┬───────────────────────┬───────────────────┘
                                 │                       │
                     ┌───────────▼──────────┐  ┌─────────▼────────────┐
                     │ PostgreSQL (Supabase)│  │ External adapters    │
                     │  tables · RLS · funcs│  │ payments · sms · geo │
                     │  storage buckets     │  │ (replaceable)        │
                     └──────────────────────┘  └──────────────────────┘
                                 │
                     ┌───────────▼──────────┐
                     │ Background worker    │  Phase≥4: async jobs
                     │ (in-process → queue) │  (outbox → worker)
                     └──────────────────────┘
```

**Scaling posture:** every app tier is **stateless**; scale horizontally behind a load balancer.
Background work begins in-process (FastAPI `BackgroundTasks`) behind an **outbox pattern**, so
moving to a dedicated worker/queue later requires **no domain-code change** (ADR-0005).

---

## 2. Layer Responsibilities (strict)

| Layer | May depend on | Must NOT contain |
|-------|---------------|------------------|
| **API (routers)** | Application layer, schemas | Business rules, SQL, vendor SDK calls |
| **Application (use-cases)** | Domain, repository interfaces, adapter interfaces | FastAPI objects, raw SQL, HTTP calls |
| **Domain** | Pure Python only | I/O, framework, DB, network |
| **Infrastructure** | Domain, DB, SDKs | Business decisions (only mechanics) |

**Dependency rule:** dependencies point inward. API → Application → Domain; Infrastructure
implements interfaces defined by Application/Domain. This is enforced by import-linter in CI
(Phase 1).

---

## 3. Module Structure (FastAPI)

Each domain is a **self-contained package** with explicit public interface (`__init__.py`
exports). Cross-module calls go through the **application-level service interface**, never
by importing another module's ORM models or repositories.

```
backend/app/
├─ main.py                     # app factory, router registration, lifespan
├─ core/
│  ├─ config.py                # pydantic-settings, env validation (fail fast)
│  ├─ security.py              # JWT verify, password/otp helpers
│  ├─ authz.py                 # permission checks, workspace resolution
│  ├─ errors.py                # error taxonomy → HTTP mapping
│  ├─ logging.py               # structured logs, correlation id, PII scrubber
│  ├─ pagination.py
│  ├─ idempotency.py
│  └─ rate_limit.py
├─ api/v1/                     # versioned router assembly (mounts module routers)
├─ middleware/                 # correlation-id, authN, authZ, rate-limit, errors
├─ shared/                     # declarative base, mixins, enums, cross-module DTOs
├─ modules/                    # business domains (see Repository Structure §3 for full list)
│  ├─ identity/    { router.py schemas.py service.py repository.py models.py permissions.py events.py }
│  ├─ users/
│  ├─ roles/
│  ├─ organizations/
│  ├─ verification/            # (KYC)
│  ├─ locations/
│  ├─ farms/
│  ├─ crops/
│  ├─ marketplace/             # (listings/catalog)
│  ├─ procurement/ retail/
│  ├─ employment/              # (labour)
│  ├─ equipment/ logistics/ warehouse/
│  ├─ orders/ bookings/ payments/
│  ├─ community/ creator/ media/ messaging/ notifications/
│  └─ analytics/ support/ admin/
├─ integrations/               # external-provider boundary (ADR-0007)
│  ├─ payments/ {interface.py noop.py razorpay.py}
│  ├─ sms/      {interface.py noop.py}
│  ├─ geo/      {interface.py noop.py}
│  └─ storage/  {interface.py supabase.py}
└─ workers/                    # outbox dispatcher (Phase ≥4)
```

**Module interface contract** (each `modules/<x>/__init__.py` exports):
- `router` — FastAPI `APIRouter`
- schemas consumed by other modules (read-only DTOs)
- service functions for cross-module use-cases (no ORM leakage)

**Boundary enforcement:**
- A module may not import another module's `models`/`repository`.
- Shared cross-cutting types live in `backend/app/shared/` (pure dataclasses/enums).
- CI import-linter contract lists allowed module dependencies.
- SQLAlchemy metadata lives in `backend/app/shared` (a leaf module) so Alembic can import it
  without circular imports.

---

## 4. Request Lifecycle

```
1. TLS termination (LB / platform)
2. Correlation-ID middleware (generate/propagate X-Request-Id)
3. AuthN middleware: validate Supabase JWT (JWKS, aud, iss, exp) → Principal(user_id, roles)
4. Rate-limit middleware: per-IP + per-user (token bucket)
5. Route → router:  request schema validation (Pydantic)
6. Workspace resolution: X-Workspace-Id header or path; verify membership
7. AuthZ: permission check (app layer) → 403 if absent
8. Use-case: open transaction, set GUCs (current_user_id, current_workspace_id),
   run domain logic, persist via repository, collect audit/outbox entries
9. Commit (single transaction) → post-commit: dispatch background work via outbox
10. Response: Pydantic response model (explicitly whitelisted fields)
11. Access log: method, path, status, latency, correlation id, user_id (hashed) — no PII
12. Errors: mapped through error taxonomy → consistent JSON envelope, no stack traces
```

**Transaction boundary rule:** one HTTP request = at most one write transaction. Domain
events/outbox rows are written **in the same transaction** as the state change.

---

## 5. Authentication & Authorization

- **AuthN:** Supabase Auth issues JWTs. API verifies **locally** against JWKS (no per-request
  call to Supabase). `sub` → `app.users.auth_uid`. (ADR-0003)
- **Principal:** `{user_id, roles[], active_workspace_id, permissions[]}` resolved server-side.
- **AuthZ:** permission catalog (see [Account & Permission Matrix](../product/02-account-permission-matrix.md)).
  Deny-by-default. Two layers: application + Postgres RLS.
- **Service-role key:** server-only, used exclusively by migrations/admin jobs/audit writer; never
  in request-path code that echoes user input.

---

## 6. Data Access & Persistence

- **SQLAlchemy 2.x** (typed, sync core; async option per ADR-0006) + **Alembic** migrations.
- Repositories implement interfaces defined by the application layer; return **domain objects**,
  not ORM models, across module boundaries.
- **Money**: `numeric(14,2)` INR; **Quantities**: `numeric(14,3)` + unit enum.
- **Identifiers**: UUIDv7 (time-ordered) primary keys for all business tables (ADR-0002).
- **Timestamps**: `timestamptz`, stored UTC; app layer converts to display TZ client-side.
- **Constraints are the contract**: FK, unique, check, exclusion constraints encode invariants
  (e.g., no double booking, no duplicate payment).
- **RLS**: enabled on all tenant/personal tables; tested.

---

## 7. Background Processing (outbox → worker)

- Phase 1–3: `BackgroundTasks` for non-critical notifications.
- From Phase 4: **transactional outbox** table; an in-process dispatcher claims rows
  (`FOR UPDATE SKIP LOCKED`), executes handlers, marks done; retries with backoff + DLQ.
- Later (no code rework): swap dispatcher for dedicated worker container / managed queue; the
  handler registry is unchanged (ADR-0005).

---

## 8. API Surface (versioned)

- Base path: `/api/v1/...`; machine-readable OpenAPI at `/api/v1/openapi.json`; UI at `/docs`
  (disabled in production per config).
- Resource-oriented, consistent envelopes, cursor/offset pagination, Idempotency-Key header.
- Cross-cutting: `/health` (liveness), `/ready` (readiness), `/api/v1/me`, `/api/v1/auth/*`.
- Full conventions: [API Design Standards](../standards/02-api-design-standards.md).

---

## 9. Frontend Architecture

### 9.1 frontend/
- React 18 + TypeScript + Vite + Tailwind + shadcn/ui.
- **Server state:** TanStack Query (cache, retries, background refetch, optimistic updates).
- **Client state:** Zustand (auth session, active workspace, UI prefs). No server data in Zustand.
- **Forms:** React Hook Form + Zod (schema shared with typed API client where possible).
- **Routing:** React Router; routes guarded by permission + workspace.
- **Layers:** `app/` (router, providers, layouts) → `features/<domain>/` (pages, hooks, api) →
  `components/` (design system) → `services/` (centralized API client) → `lib/` (helpers).
- **Feature isolation:** a feature imports only `components/`, `services/`, `hooks/`, `stores/`,
  `lib/`, shared packages, and its own folder.

### 9.2 admin/
- Separate Vite build & deployment; own auth flow restricted to `staff` roles + MFA.
- All admin calls go to `/api/v1/admin/*` (separate router namespace, separate authz).
- Never ships marketplace code; never bundles admin code into frontend.

### 9.3 packages/
`ui` (design system), `api-client` (generated from OpenAPI), `types`, `validation`, `i18n`, `config`
(eslint/tsconfig/tailwind shared).

---

## 10. Scalability Plan (10M+ users, incremental)

| Concern | Now (Phase 1–4) | Growth step (no rewrite) |
|---------|-----------------|--------------------------|
| API | Stateless single container | Multiple replicas behind LB |
| Sessions | JWT (no server session) | unchanged |
| DB | Single Postgres instance | Read replicas (routing in repo layer) |
| Hot tables (orders, listings, notifications, audit) | Partition-ready keys (`created_at`, workspace) | Declarative partitioning |
| Background work | In-process outbox dispatcher | Dedicated worker pool / managed queue |
| Caching | None / per-request | Redis for lookups & rate-limit backend (adapter) |
| Media | Supabase Storage | CDN + signed URLs |
| Search | SQL `ILIKE`/trigram | External search (adapter) |
| Admin analytics | Read-only aggregate queries | Read replica + materialized views |

Every growth step is behind an existing seam (stateless app, outbox table, repository
interface, cache/rate-limit adapter, search adapter), so **no domain-code rewrite** is needed.

---

## 11. External Integrations (adapters)

| Provider type | Interface | Default impl | Notes |
|---------------|-----------|--------------|-------|
| Payments | `PaymentProvider` | `noop` | Phase 4; webhook endpoint, signature verify, idempotency |
| SMS/OTP | `SmsProvider` | `noop` | Notification channel |
| Geo/Address | `GeoProvider` | `noop` | Pin-code / lat-long resolution |
| Object storage | `StorageProvider` | `supabase` | Signed URL generation |
| Error tracking | Sentry | config-gated | optional |

- Adapters live only in `adapters/`; domain/application layers depend on the **interface**.
- Selection via env (`PAYMENT_PROVIDER=noop|razorpay`). `noop` is honest: raises
  "not configured" rather than faking success.

---

## 12. Environments & Configuration

| Env | DB | Purpose | Isolation |
|-----|----|---------|-----------|
| development | local Supabase (Docker) | Local dev | separate project/keys |
| staging | Supabase staging project | Pre-prod validation | separate project/keys |
| production | Supabase production project | Live | separate project/keys |

- Config via pydantic-settings, validated at boot (fail fast). All vars documented in
  `.env.example`. **No prod data in dev/test.**

---

## 13. Observability

- **Logs:** structured JSON; correlation id on every line; PII scrubber removes emails, phones,
  tokens, document numbers, card data.
- **Errors:** global handler → typed error envelope; stack traces only to logs (never responses);
  Sentry optional.
- **Metrics (Phase ≥4):** request rate/latency/errors per route, DB pool, outbox lag.
- **Audit:** separate append-only audit table with retention.

---

## 14. CI/CD Pipeline (GitHub Actions)

```
lint → typecheck → unit tests (pytest + vitest) → build (web/admin/api image)
  → migration dry-run (alembic upgrade --sql) → integration tests (docker postgres + RLS tests)
  → e2e (Playwright, staging) → deploy (environment-gated, manual approval for prod)
```

- Secrets from GitHub Environments (never in repo). Migrations run with a dedicated migration
  role; **destructive migrations require explicit human approval** (enforced by review +
  protected env).

---

## 15. Failure Modes & Handling

| Failure | Handling |
|---------|----------|
| DB unavailable | 503 + readiness fails; no partial writes (transaction rollback) |
| Auth provider down | JWKS cached; existing valid sessions work; new logins fail visibly |
| Payment provider timeout | Idempotent retry; webhook reconciles; never double-charge |
| Duplicate submit | Idempotency-Key dedupe + DB unique | 
| Background job failure | Outbox retry w/ backoff; DLQ; alert |
| RLS misconfig (regression) | Cross-workspace tests in CI fail the build |

---

## 16. Key Decisions → ADRs

| Decision | ADR |
|----------|-----|
| Modular monolith over microservices | [0001](../adr/0001-modular-monolith.md) |
| UUIDv7 identifiers | [0002](../adr/0002-uuid-identifiers.md) |
| Supabase Auth for AuthN | [0003](../adr/0003-supabase-auth.md) |
| Multi-role + workspace model | [0004](../adr/0004-multi-role-workspaces.md) |
| Transactional outbox for background work | [0005](../adr/0005-outbox-background-jobs.md) |
| Aligned Alembic + Supabase SQL migrations | [0006](../adr/0006-migrations-alembic-supabase.md) |
| Adapter pattern for external providers | [0007](../adr/0007-provider-adapters.md) |
| Two-layer authz (app + RLS) | [0008](../adr/0008-defense-in-depth-authz.md) |
| Root-level canonical repository layout | [0009](../adr/0009-root-level-repository-layout.md) |

---

## 17. Unresolved Design Items

Tracked in [OPEN-QUESTIONS.md](../OPEN-QUESTIONS.md): sync vs async SQLAlchemy ownership,
Redis adoption trigger, search provider, notification dedupe policy, KYC vendor.
