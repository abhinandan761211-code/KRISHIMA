# AGENTS.md — Permanent Architecture & Working Rules for KRISHIMA

These rules are **permanent** and apply to every human contributor and AI agent. They are derived
from the KRISHIMA master instructions and the accepted ADRs. Changing a rule requires a
superseding ADR in [`docs/adr/`](docs/adr/README.md). When a rule and a task instruction conflict,
**stop and report** — do not silently override the architecture.

---

## 1. Project identity

KRISHIMA is an agriculture super-application for India. Long-term target: **10,000,000+ users**
without a rewrite. Optimize for correctness, security, and incremental scale — not cleverness.

## 2. Canonical repository layout (non-negotiable)

```
frontend/  backend/  database/  admin/  mobile/  packages/  infrastructure/  docs/  scripts/  tests/
```

- Exactly **one application per top-level directory**. **Never create `apps/`**, and never create a
  second frontend, backend, or database. (See [ADR-0009](docs/adr/0009-root-level-repository-layout.md).)
- Shared code is **promoted** to `packages/` (browser-safe TS) or `backend/app/shared/` (Python).
  Never copy a file between apps.
- Do not add empty/placeholder business modules just to look complete. Document future modules and
  create them when implementation begins (see [Repository Structure](docs/standards/01-repository-structure.md)).

## 3. Stack (do not substitute without an ADR)

- Frontend: React, TypeScript, Vite, Tailwind, shadcn/ui, React Router, TanStack Query, Zustand,
  React Hook Form, Zod, i18next, Vitest, Playwright.
- Backend: Python, FastAPI, Pydantic, SQLAlchemy. Tests: Pytest.
- Database: PostgreSQL via Supabase. Migrations: Alembic (authoritative) + coordinated versioned SQL.
- Auth: Supabase Auth. Future mobile: React Native + Expo (not implemented until requested).

## 4. Backend boundaries

- Domain-based **modular monolith**. **No microservices** prematurely ([ADR-0001](docs/adr/0001-modular-monolith.md)).
- Layers: `router.py` (HTTP) → `service.py` (business rules + transactions) → `repository.py`
  (persistence); `schemas.py` (validation), `models.py` (ORM), `permissions.py` (authz),
  `events.py` (business events).
- A module **must not** import another module's `models` or `repository`. Cross-module access goes
  through the exported service interface. Enforced by import-linter in CI.
- External providers live only in `backend/app/integrations/` behind interfaces ([ADR-0007](docs/adr/0007-provider-adapters.md)).
- All HTTP routes mounted under **`/api/v1`**.

## 5. Frontend boundaries

- Feature-based: `src/features/<feature>/{pages,components,hooks,api,schemas,types,utils,tests,routes}`.
- A feature must not import another feature's internals. Cross-feature needs go through
  `components/`, `services/`, `hooks/`, `lib/`.
- Server state via TanStack Query; Zustand for client/session state only.
- **Centralized API client** in `src/services/` built on `packages/api-client`. No scattered `fetch`.
- The frontend must **never** contain DB admin credentials, service-role keys, privileged
  authorization logic, or backend business rules. Route business-critical DB operations through the
  backend. Supabase JS is only for auth session and explicitly approved storage operations.

## 6. Database rules

- Alembic is the **single authority** for application schema; one migration history.
- `database/policies|functions|triggers|views|indexes|storage` SQL is applied **through** the Alembic
  flow — it is **not** a second migration system and must not be applied ad hoc.
- Never modify Supabase-managed `auth.*` tables. Never edit production schema via the dashboard
  without a reviewed migration.
- Required: PK/FK, unique/check constraints, indexes, **decimal** money (never float), UTC
  timestamps, explicit transaction boundaries, resource ownership, organization isolation, **RLS**,
  private storage policies.
- **A privileged SQLAlchemy connection does NOT inherit the user's RLS context.** RLS applies only
  when session GUCs are set and the runtime role is subject to RLS. Runtime = least-privilege role;
  migrations = separate owner credential; service-role = server-side, narrow use only.
- **Never reset or delete a database without explicit approval.** Never run destructive changes
  without authorization. Never use production data in development/testing.

## 7. Security rules

- Never hardcode API keys, passwords, tokens, or credentials. Service-role key is server-side only.
- Validate authentication **and** authorization for every protected operation. **Deny by default.**
- Two-layer authz: application permission check **and** database RLS ([ADR-0008](docs/adr/0008-defense-in-depth-authz.md)).
- Failures never silently suppressed; never expose sensitive data in logs or API responses.
- Import/export: never copy credentials from any other project.
- Admin permissions are granted server-side only — never from frontend role selection or editable
  profile metadata. Admin actions are audited; sensitive staff actions require MFA.

## 8. Coding standards

- Clear naming, strong typing, no duplicate implementations, focused functions, no unnecessary
  abstractions, no silently swallowed errors.
- **No fake working functionality.** Incomplete/disabled features must be clearly marked.
- Every business module ships with automated tests.
- Pin compatible dependency versions and commit lockfiles.
- Document every required environment variable in safe `.env.example` files. Real `.env` files are
  git-ignored at any depth and must never be committed.

## 9. Mandatory per-task workflow

Before implementation: (1) inspect the repo, (2) read relevant docs/ADRs, (3) identify
dependencies/assumptions/security implications, (4) define acceptance criteria.
After implementation: (5) implement **only** the requested scope, (6) run lint/typecheck/build/tests,
(7) report **actual** results and known limitations, (8) update docs.

**Never claim a feature is complete unless its UI, API, database, authorization, business logic,
and tests all work.** Never fabricate test results. If a check cannot run, report it as *Not Run*
with the reason.

## 10. Documentation

- Significant technical decisions require an ADR (`docs/adr/`).
- Ambiguous requirements are logged in `docs/OPEN-QUESTIONS.md` with an explicit assumption —
  never invented silently in code.
- Documentation must match the implementation; update docs in the same change.
- Entry points: [ARCHITECTURE.md](ARCHITECTURE.md), [docs/README.md](docs/README.md),
  [SECURITY.md](SECURITY.md), [CONTRIBUTING.md](CONTRIBUTING.md).

## 11. Design system rules (permanent)

**Single source of truth:** `packages/ui` (`@krishima/ui`). All visual values come from
`packages/ui/styles/tokens.css` — CSS custom properties consumed via Tailwind.

- **Never hardcode** a colour, font size, spacing, radius, shadow or duration. Use a semantic
  token / Tailwind utility (`bg-surface`, `text-fg-body`, `border-border-strong`, `ring-ring`).
- **Never reference primitive tokens** (`--kr-color-*`) in components — use semantic or
  component tokens.
- **Never create a second token file** or a competing theme mechanism. Themes switch via
  `data-theme` on `<html>`; there is exactly **one** `ThemeProvider` per app.
- **Use the shared components** from `@krishima/ui` (Button, Input, Card, PageHeader, DataTable,
  StatusBadge, Alert, EmptyState/ErrorState/OfflineState, …). Do **not** re-implement a primitive
  in a feature; extend the package instead.
- **The logo** must be rendered via `KrishimaLogo` — never re-typed or recoloured. KRISHI is
  always brand green; MA follows the theme (black/white).
- **Module accents** (`--kr-mod-*`) are for icons, small labels and category chips only —
  never for primary buttons or navigation.
- **Accessibility is mandatory:** WCAG 2.2 AA. Never colour-only status, always a visible focus
  ring, always a label for controls, 44px touch targets, and respect `prefers-reduced-motion`.
- **Every data view ships all states:** loading (skeleton), empty, error (+retry), success,
  disabled, permission-limited.
- **Do not use decorative borders as input boundaries** — inputs use `--kr-border-strong`.
- **Gold `#D5A13A` is decorative only** — never body text on light surfaces.
- **App content globs must include `../packages/ui/src/**/*.{ts,tsx}`** or shared classes are
  purged.
- Any change to a colour/text/UI token requires running
  `python3 scripts/check_design_contrast.py` (must pass) and updating the design docs.
- New UI must be visually reviewed at 320/375/390/768/1024/1440px in **both** themes.

Reference: [docs/design-system/](docs/design-system/COLOR_SYSTEM.md) and
[docs/testing/DESIGN_SYSTEM_VALIDATION_REPORT.md](docs/testing/DESIGN_SYSTEM_VALIDATION_REPORT.md).

## 12. Phase discipline

Implement only the current phase. At a phase boundary, **stop and report**. Do not start the next
phase or add business features without explicit instruction.
