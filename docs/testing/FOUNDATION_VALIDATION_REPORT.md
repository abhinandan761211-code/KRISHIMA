# KRISHIMA — Foundation Validation Report (Phase 1)

- **Date:** 2026-11-25
- **Scope:** Phase 1 foundation integration, testing and validation
- **Environment:** local development · Supabase project KRISHIMA (`ap-south-1`)
- **Verdict:** **Phase 1 foundation is NOT complete.** One blocking defect — the database
  credential is rejected — prevents database connectivity, schema inspection, and RLS work.

> Status vocabulary used below: **Connected · Configured · Tested · Failed · Not Configured ·
> Not Tested**. Every value is derived from a live check performed during this task.

---

## 1. Current repository structure

```
frontend/  backend/  database/  admin/  mobile(reserved)  packages  infrastructure  docs/
```

Phase 1 contains real code in `frontend/`, `backend/`, `admin/`, `database/`, `scripts/`, `docs/`.

Key backend layout: `backend/app/{main.py, core/, api/v1/, middleware/, modules/, integrations/, shared/, workers/}`.
Key frontend layout: `frontend/src/{app/, features/, services/, config/, styles/}`.

---

## 2. Environment configuration status

| File | State | Notes |
|------|-------|-------|
| `backend/.env` | **Corrected** | `DATABASE_URL` held the *project URL* (not a DB URL) → replaced with a valid PostgreSQL URL. Password percent-encoded. Pooler shard corrected to `aws-1`. `SIGNING_SECRET` generated. |
| `database/.env` | **Corrected** | Migration URL carried an unencoded password and a duplicated port → fixed. |
| `frontend/.env.local` | Configured | Public `VITE_*` only. |
| `admin/.env.local` | Configured | Public `VITE_*` only. |

Init: all four are loaded by their respective application (`pydantic-settings` for backend,
`import.meta.env` validation for frontend/admin).

---

## 3. Status matrix

| Area | Status | Evidence |
|------|--------|----------|
| Frontend build | **Tested** | `tsc --noEmit` clean, `vite build` succeeds (Tailwind emitted) |
| Frontend ↔ Backend | **Connected** | System Status page renders live `/health/ready` data in a headless browser |
| Backend API | **Connected** | `/health/live`, `/api/v1/health`, `/api/v1/version`, `/docs` all 200 |
| Backend tests | **Tested** | 10/10 pytest pass; ruff clean |
| PostgreSQL | **Failed** | `authentication failed` (see §12 blocker B-1) |
| Supabase Auth | **Connected** | `/auth/v1/health` 200; JWKS reachable (ES256) |
| JWT verification | **Tested** | Real Supabase token accepted (200 `/api/v1/me`); forged/expired/wrong-aud/wrong-iss rejected |
| Google OAuth | **Configured** | Provider enabled; `/auth/v1/authorize` → 302 to Google |
| Google OAuth E2E | **Not Tested** | Requires interactive Google consent |
| Supabase Storage | **Connected** | Both buckets present; anon cannot list/download private objects |
| Migrations | **Tested (offline)** | Offline SQL renders `app` schema + `gen_uuid_v7()` |
| Migrations (applied) | **Not Run** | Blocked on DB credential |
| Admin app | **Tested** | `tsc` clean, `vite build` succeeds, 0 privileged strings in bundle |
| Security audit | **Tested** | See §11 |

---

## 4. Database connection — diagnosis and fix

**Root cause chain (each confirmed, not assumed):**

1. `backend/.env` had `DATABASE_URL=https://<ref>.supabase.co` — the **project URL**, not a
   PostgreSQL connection string. → replaced with a valid `postgresql+psycopg://` URL.
2. The owner-supplied password contains `[` and `]`. These are not valid literal characters in a
   URL and must be percent-encoded (`%5B`, `%5D`). → encoded.
3. The pooler shard was `aws-0-…`; the project resolves on **`aws-1-ap-south-1`**
   (`aws-0` returns `ENOTFOUND`, `aws-1` reaches the server). → corrected.
4. **Remaining defect:** after all of the above the server returns
   `password authentication failed`. A control test using a deliberately-wrong password produced
   the **identical** error, proving the server is reachable and the **supplied password does not
   match the database password**.

**Resolution (owner action — cannot be done safely from here):**

1. Supabase Dashboard → **Project Settings → Database**.
2. Either copy the current password, or **Reset database password**.
3. URL-encode it:
   ```bash
   python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" 'THE_PASSWORD'
   ```
4. Put the encoded value into `backend/.env` `DATABASE_URL`/`MIGRATION_DATABASE_URL` and
   `database/.env` `MIGRATION_DATABASE_URL`.

> No password was ever printed, logged, or committed. No database was reset or modified.

---

## 5. Backend endpoint verification (actual)

| Endpoint | HTTP | Behaviour |
|----------|------|-----------|
| `GET /health/live` | 200 | liveness, dependency-independent |
| `GET /health/ready` | **503** | `degraded` — correct, because the DB is down; each dependency listed with status |
| `GET /api/v1/health` | 200 | `status: degraded`, `unhealthy_dependencies: ["database"]` |
| `GET /api/v1/version` | 200 | name/version/api_version/environment/uptime |
| `GET /api/v1/ready` | 503 | versioned alias (same semantics) |
| `GET /docs` | 200 | OpenAPI UI (disabled in production) |
| `GET /api/v1/me` (no token) | 401 | `unauthenticated` envelope |
| `GET /api/v1/me` (real token) | 200 | correct identity returned |

Also verified: CORS allows `http://localhost:5173` and rejects unknown origins; `X-Request-Id`
propagates; error envelope contains `code`/`message`/`request_id` and no internals; lifespan
startup/shutdown logs run and contain no secrets.

---

## 6. Authentication verification (actual)

| Test | Result |
|------|--------|
| Real Supabase ES256 access token → `/api/v1/me` | **Accepted** (200) |
| Forged token (attacker key) | Rejected |
| Expired token | Rejected |
| Wrong audience | Rejected |
| Wrong issuer | Rejected |
| Garbage / missing header | 401 |

JWT strategy: **JWKS-first (ES256)**, `SUPABASE_JWT_SECRET` intentionally empty (no legacy HS256).
Issuer/audience validated. The JWT `role` claim is **not** used for authorization.

Test users created for verification were **deleted immediately**; project user count returned to 0.

---

## 7. Google OAuth readiness

- Provider enabled in Supabase (`external.google = true`).
- `/auth/v1/authorize?provider=google` → **302** to `accounts.google.com` with a `client_id`.
- App callback route exists (`/auth/callback`, PKCE, `detectSessionInUrl`).
- Google client secret is **not** present in any app env file or bundle.

**Manual verification still required** (dashboard-gated):

1. Google Cloud → OAuth client → authorised redirect URI
   `https://<ref>.supabase.co/auth/v1/callback`.
2. Supabase → Authentication → URL Configuration → add
   `http://localhost:5173/auth/callback`, `http://localhost:5174/auth/callback`.
3. Perform one interactive login; confirm the session is created.

---

## 8. Storage verification (actual)

| Check | Result |
|-------|--------|
| Service connectivity | Connected |
| Buckets | `public-assets` (public), `private-documents` (private) |
| Anonymous list of `private-documents` **with an object present** | `[]` — no leak |
| Anonymous download of private object | HTTP 400 — denied |
| Upload with disallowed MIME (`text/plain`) | Rejected (bucket policy) |
| Signed URL for public bucket | Refused by code |

Probe object was deleted; no storage policies were modified.

---

## 9. Admin foundation

- TypeScript check and production build succeed.
- Uses the **same** backend; no duplicate backend or database.
- No privileged credential strings in source or bundle.
- Admin authorization is documented as **server-side only**; no admin endpoints or default
  credentials were created.

---

## 10. System Status page

Development-only page showing live results for Backend, Frontend, PostgreSQL, Supabase Auth,
Google OAuth, Storage, API version, environment and **last-check timestamp**. Uses the exact
status vocabulary. Verified visually in a headless browser. Returns a plain "not available"
notice in production builds.

---

## 11. Security findings

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| S-1 | **Critical** | `DATABASE_URL` in `backend/.env` was the project URL (misconfiguration) | **Fixed** |
| S-2 | **High** | DB password not URL-encoded → all DB config invalid | **Fixed** (encoding); password mismatch remains (B-1) |
| S-3 | **High** | `react-router` had 13 advisories (XSS/open-redirect) | **Fixed** → 7.18.7 |
| S-4 | **High** | `zod` had advisories | **Fixed** → 4.6.7 |
| S-5 | **Medium** | `DATABASE_URL` uses owner-level credentials (no least-privilege role yet) | **Open** — create `app_runtime` |
| S-6 | Low | `SIGNING_SECRET` was a placeholder | **Fixed** — generated |
| S-7 | Info | Frontend bundle contains only the publishable anon key (public by design) | Accepted |
| S-8 | Info | `.env`, `.venv`, `node_modules`, build artifacts ignored; only `*.env.example` tracked | Verified |

Dependency audits after fixes: **frontend 0 vulnerabilities, admin 0 vulnerabilities.**

CORS verified restrictive; error responses leak nothing; logs scrub emails/phones/JWTs/URL
credentials.

---

## 12. Issues discovered and fixed during this task

1. `DATABASE_URL` contained a non-DB URL → corrected.
2. Password percent-encoding and a duplicated pooler port in the migration URL → corrected.
3. Wrong pooler shard (`aws-0` → `aws-1`) → corrected.
4. Missing health endpoints (`/health/live`, `/health/ready`, `/api/v1/version`, `/api/v1/ready`)
   → implemented, with the full status vocabulary.
5. Readiness did not signal failure → now returns **503** when degraded.
6. `/api/v1/health` reported "ok" despite a failed dependency → now consistent.
7. DB error detail leaked a host IP → sanitised to a safe reason.
8. Frontend called a non-existent readiness path → `/api/v1/ready` added.
9. Tailwind CSS was missing entirely → configured with brand tokens.
10. No frontend lint/test tooling → ESLint 9 + Vitest added; 2 unit tests.
11. Duplicate `/api/v1/health` route shadowed the versioned handler → removed duplicate.
12. Backend ruff violations (14) → all fixed; blind `pytest.raises(Exception)` replaced with
    `ValidationError`.
13. Liveness test asserted the old mixed behaviour → split into liveness / health / readiness /
    version tests.

---

## 13. Remaining blockers

| ID | Blocker | Owner action |
|----|---------|--------------|
| **B-1** | **Database password rejected** — blocks all DB work | Reset/copy DB password and update `DATABASE_URL`, `MIGRATION_DATABASE_URL`, `database/.env` |
| B-2 | Least-privilege `app_runtime` role not created | Run the SQL in `docs/architecture/03-auth-and-supabase-setup.md` §3.1 |
| B-3 | Google OAuth not exercised end-to-end | Interactive login after allowlisting redirect URLs |
| B-4 | No business tables / RLS policies | Phase 2 (intentional) |
| B-5 | Repo is not yet a git repository | `git init` + first commit |

---

## 14. Exact startup commands

```bash
# Backend
cd backend && python3 -m pip install -e . && python3 -m uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev        # http://localhost:5173

# Admin
cd admin && npm install && npm run dev           # http://localhost:5174

# Verification
python3 scripts/verify_foundation.py

# Migrations (after B-1 is resolved)
database/scripts/migrate.sh upgrade head
```

---

## 15. Phase 1 completion status

| Requirement | Status |
|-------------|--------|
| Repo/env audit | Complete |
| Backend foundation + endpoints | **Complete** |
| Frontend foundation | **Complete** |
| Admin foundation | **Complete** |
| System Status page | **Complete** |
| Security audit | **Complete** |
| Automated tests & builds | **Passing** |
| **Database connectivity** | **Blocked (B-1)** |
| **Migrations applied** | **Blocked (B-1)** |

**Phase 1 is therefore ~90% complete and NOT signed off.** The single blocking item is a
credential mismatch that only the project owner can resolve.

---

## 16. Recommended next step

1. Resolve **B-1** (database password), then re-run `python3 scripts/verify_foundation.py`
   until `postgres_runtime` and `postgres_migration` report **CONNECTED**.
2. Create the least-privilege `app_runtime` role (**B-2**) and point `DATABASE_URL` at it.
3. Apply the baseline migration and inspect the schema (read-only).
4. Then, and only then, begin **Phase 2 — Identity, Profiles, KYC, Organizations** once approved.

---

## Appendix — verification command output

```
KRISHIMA — Foundation Verification
env_validation       TESTED          Settings validated; env=development
supabase_auth        CONNECTED       health=v2.198.0; providers_enabled=['google', 'email']
google_oauth         CONFIGURED      Google provider enabled in Supabase (flow not yet tested end-to-end)
jwt_verification     TESTED          JWKS reachable; 1 key(s); algs=['ES256']
token_validation     TESTED          invalid token correctly rejected
postgres_runtime     FAILED          authentication failed — check the database password for this role.
postgres_migration   FAILED          OperationalError
storage              CONNECTED       expected=['public-assets', 'private-documents'] present=['public-assets', 'private-documents']
alembic_config       TESTED          offline SQL renders with schema + function
frontend_env         CONFIGURED      all VITE_* public vars present
Total: 10  Failed: 2
```
