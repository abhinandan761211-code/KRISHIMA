# KRISHIMA — Contributing

> Read [AGENTS.md](AGENTS.md) first — it contains the permanent rules every change must follow.

## 1. Workflow

1. **Inspect** the repository and the relevant docs/ADRs before coding.
2. **Plan**: identify dependencies, assumptions, and security implications; define acceptance
   criteria (use [docs/DEFINITION-OF-DONE.md](docs/DEFINITION-OF-DONE.md)).
3. **Branch** from `main`: `type/scope-short-desc` (e.g. `feat/orders-idempotency`).
4. **Implement only the scoped change** — no unrelated edits, no `apps/` directories, no second
   backend/frontend.
5. **Test** — run lint, typecheck, build and the relevant tests locally.
6. **Document** — update docs/ADRs in the same PR that changes a decision.
7. **PR** with a description of what changed, how it was verified (actual results), and known
   limitations. CI must pass; reviewed and merged to `main`.

## 2. Commits

Conventional Commits: `feat(scope): …`, `fix(scope): …`, `docs(scope): …`, `chore(scope): …`.

## 3. Local setup (Phase 1 — not yet implemented)

```bash
pnpm install                            # workspace root
cp backend/.env.example backend/.env    # server secrets (local only)
cp frontend/.env.example frontend/.env  # public config only
docker compose up                       # local API + Postgres/Supabase
```

Application directories are created in Phase 1; today only `docs/`, root files, and per-app
`.env.example` templates exist.

## 4. Repository rules (summary — full text in AGENTS.md)

- Canonical root layout only: `frontend/ backend/ database/ admin/ mobile/ packages/
  infrastructure/ docs/ scripts/ tests/`. **Never create `apps/`.**
- One application per directory; shared code goes to `packages/` or `backend/app/shared/`.
- Backend = domain-based modular monolith; no cross-module `models`/`repository` imports; all routes
  under `/api/v1`; external providers only via `backend/app/integrations/` adapters.
- Frontend = feature-based; centralized API client in `src/services/`; no privileged logic or DB
  admin credentials in the browser.
- Database = Alembic authoritative; RLS on tenant tables; decimal money; UTC timestamps; separate
  runtime vs migration DB roles.
- No secrets committed; only `.env.example` templates; never copy credentials from other projects.

## 5. Coding standards

- Strong typing (mypy/tsc clean), clear naming, no duplicate implementations, no silently swallowed
  errors.
- No fake working functionality — disabled/incomplete features must be clearly marked.
- Pin compatible dependency versions and commit lockfiles (pnpm-lock.yaml, Python lock/constraints).
- Every business module ships with tests (see the testing matrix in the Definition of Done).

## 6. Documentation

- Significant decisions → ADR in [`docs/adr/`](docs/adr/README.md) (immutable once accepted;
  supersede with a new ADR).
- Ambiguities → log in [`docs/OPEN-QUESTIONS.md`](docs/OPEN-QUESTIONS.md) with an explicit
  assumption; never invent behavior silently.
- Keep docs in sync with code in the same change.

## 7. Phase discipline

Only implement the current phase. At a phase boundary, **stop and report** for review. Do not start
the next phase or add business features without explicit instruction.
