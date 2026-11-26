# Supabase & Google Authentication — Setup & Verification

- **Version:** 1.0 (Phase 1 foundation)
- **Owner:** Security Engineer / Backend Lead
- **Status:** Auth foundation implemented and partially verified — see §6 status matrix
- **Companions:** [ADR-0003](../adr/0003-supabase-auth.md) · [ADR-0008](../adr/0008-defense-in-depth-authz.md) · [Threat Model](../security/01-threat-model.md) · [SECURITY.md](../../SECURITY.md)

---

## 1. Project

| Item | Value |
|------|-------|
| Supabase project | **KRISHIMA** — ref `rbmphlmqmfuxwxypxhzd`, region **ap-south-1** (Mumbai) |
| Project URL | `https://rbmphlmqmfuxwxypxhzd.supabase.co` |
| Pooler host | `aws-1-ap-south-1.pooler.supabase.com` |
| API version | Postgres 17.x |

> Never use the legacy CenAGRI AI project. Its database is untouched by this work.

---

## 2. Environment variables (names only — no values here)

### backend/.env (server-only)
| Variable | Purpose |
|----------|---------|
| `APP_ENV`, `API_BASE_URL`, `APP_FRONTEND_URL`, `CORS_ALLOWED_ORIGINS` | Runtime |
| `DATABASE_URL` | **Runtime** least-privilege pooled URL (session GUCs → RLS) |
| `MIGRATION_DATABASE_URL` | **Migration** owner credential (Alembic only) |
| `DB_POOL_SIZE`, `DB_MAX_OVERFLOW`, `DB_POOL_TIMEOUT`, `DB_POOL_RECYCLE`, `DB_POOL_PRE_PING` | Pooling |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin/storage (bypasses RLS) |
| `SUPABASE_ANON_KEY` | Public reads / auth settings probe |
| `SUPABASE_JWKS_URL` | JWKS endpoint (preferred verification) |
| `SUPABASE_JWT_SECRET` | Legacy HS256 only; **left empty** by design |
| `SUPABASE_JWT_AUDIENCE`, `SUPABASE_JWT_ISSUER`, `SUPABASE_JWT_ALGORITHMS` | Token validation |
| `JWKS_CACHE_TTL_SECONDS` | Key cache |
| `SUPABASE_OAUTH_GOOGLE_ENABLED` | Informational |
| `SUPABASE_STORAGE_PUBLIC_BUCKET`, `SUPABASE_STORAGE_PRIVATE_BUCKET`, `MAX_UPLOAD_BYTES` | Storage |
| `SIGNING_SECRET` | Internal signed links |
| `RATE_LIMIT_*`, `LOG_LEVEL`, `SENTRY_DSN` | Ops |
| `PAYMENT_PROVIDER*`, `SMS_PROVIDER*`, `GEO_PROVIDER*` | Adapters (noop) |

### frontend/.env.local & admin/.env.local (browser-visible — publishable only)
`VITE_APP_ENV`, `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
`VITE_ENABLE_GOOGLE_AUTH` (frontend), `VITE_AUTH_CALLBACK_URL`.

### database/.env (migration tooling)
`MIGRATION_DATABASE_URL`, `DATABASE_CHECK_URL`, `DB_SCHEMA`, `APP_ENV`.

**Rule:** `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`, `DATABASE_URL`,
`MIGRATION_DATABASE_URL`, `SIGNING_SECRET` and any provider secret must **never** appear in
`VITE_*` or the `admin/` bundle. Enforced by review + the CI secret scan (Phase 1 follow-up).

---

## 3. Obtaining the PostgreSQL connection strings

> The owner already has the URL, anon/publishable key, service-role key, JWT secret and Google
> credentials. **The PostgreSQL connection strings are not derivable from those** — they include
> the database password and must be copied from the dashboard.

**Supabase Dashboard → Project Settings → Database → Connection string**

| Use | Connection string tab | Port | User | Notes |
|-----|-----------------------|------|------|-------|
| `DATABASE_URL` (runtime) | *Transaction pooler* | `6543` | a dedicated **least-privilege** role, e.g. `app_runtime.<ref>` | Pooled; the API creates pooled sessions. RLS applies to the role. |
| `MIGRATION_DATABASE_URL` (Alembic) | *Session pooler* (or *Direct*) | `5432` | `postgres.<ref>` | Owner-level; used **only** by migrations. |

Convert to the SQLAlchemy driver form before pasting:

```
postgresql+psycopg://USER:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:PORT/postgres
```

### 3.1 Creating the least-privilege runtime role (one-time, by owner)

Run in the Supabase SQL editor (as owner). This creates a role that is **subject to RLS** and
cannot perform DDL:

```sql
-- Replace <PASSWORD> with a strong generated password; never commit it.
create role app_runtime login password '<PASSWORD>' noinherit;
grant connect on database postgres to app_runtime;
grant usage on schema app to app_runtime;
-- Grants on specific tables are added per module in the phase that introduces them.
alter default privileges in schema app grant select, insert, update, delete on tables to app_runtime;
```

> ⚠ **Do not** grant `bypassrls` or make this role a superuser. A privileged connection does **not**
> inherit a user's RLS context; the API sets `app.current_user_id` / `app.current_workspace_id`
> per transaction (see `backend/app/core/db.py`), and RLS denies anything not explicitly allowed.

---

## 4. JWT verification strategy

| Aspect | Decision |
|--------|----------|
| Signing | Project uses **asymmetric ES256 (P-256)** keys — confirmed via JWKS |
| Verification | **JWKS first** (`https://<ref>.supabase.co/auth/v1/.well-known/jwks.json`), cached |
| Key selection | By token header `kid`; algorithms allow-listed (`ES256,RS256`) |
| Legacy HS256 | Only if JWKS is absent **and** `SUPABASE_JWT_SECRET` is explicitly set (currently empty) |
| Always validated | signature, `exp`, `iss`, `aud`, presence + UUID format of `sub` |
| Trust model | The JWT `role` claim is **informational only**. Application roles/permissions are resolved **server-side** from our own tables (ADR-0004/0008). Client-provided roles are never trusted. |

Implementation: `backend/app/core/security.py`. Negative tests confirm tampered/garbage/absent
tokens are rejected with `401 unauthenticated` (`backend/tests/test_foundation.py`).

---

## 5. Google OAuth (brokered by Supabase Auth)

**The Google Client Secret must live ONLY in the Supabase dashboard** — never in the frontend,
admin, or backend env files.

### 5.1 Google Cloud Console
1. **APIs & Services → OAuth consent screen** — configure (External), add scopes `email`, `profile`,
   `openid`. Add test users while in *Testing*.
2. **Credentials → Create credentials → OAuth client ID → Web application**.
3. **Authorised redirect URI** (exact):
   ```
   https://rbmphlmqmfuxwxypxhzd.supabase.co/auth/v1/callback
   ```
4. Copy the **Client ID** and **Client secret**.

### 5.2 Supabase Dashboard
**Authentication → Providers → Google** → enable, paste **Client ID** + **Client secret**, save.

Current state: Google is **enabled** in the project (confirmed via the public auth settings
endpoint, which returns `external.google = true`), and the `/auth/v1/authorize?provider=google`
endpoint returns a valid Google authorize redirect (HTTP 302).

### 5.3 Supabase redirect URLs (required for the callback to return to the app)
**Authentication → URL Configuration**
- **Site URL:** `http://localhost:5173` (dev) / production domain
- **Redirect URLs** (add each):
  ```
  http://localhost:5173/auth/callback
  http://localhost:5174/auth/callback
  ```
> If `redirect_to` is not in this allowlist, Supabase falls back to the Site URL and OAuth will
> appear to "log in" but land on the wrong page. This is the most common misconfiguration.

### 5.4 App side
`frontend/src/features/auth/pages/AuthCallbackPage.tsx` handles the return, establishes the
session, and redirects to `/`. `frontend/src/services/auth.ts` provides
`signInWithGoogle()`, which only redirects to Supabase (no Google secret involved).

> **Not yet claimed operational:** no full browser round-trip through Google's consent screen has
> been executed (requires a real Google account interaction). Status: **Configured** (Google
> enabled + authorize redirect verified), **not Tested end-to-end**.

---

## 6. Verification status matrix (actual, from this task)

| Item | Status | Evidence |
|------|--------|----------|
| Environment files (all 8) | **Configured** | present; validated by `pydantic-settings` |
| Env validation at startup | **Tested** | `Settings` fails fast on invalid values; unit test passes |
| Supabase Auth service | **Connected** | `/auth/v1/health` → 200 |
| Google provider (enabled) | **Configured** | settings `external.google=true`; authorize → 302 to Google |
| Google end-to-end login | **Not Tested** | needs interactive Google consent |
| JWKS reachable | **Connected** | JWKS returns ES256 key(s) |
| JWT verification (valid token) | **Tested** | real Supabase ES256 token accepted; `/api/v1/me` returned correct identity |
| JWT verification (invalid) | **Tested** | tampered/garbage/missing → `401` |
| Storage service | **Connected** | service-role bucket list returns both buckets |
| Storage buckets | **Configured** | `public-assets`, `private-documents` present |
| PostgreSQL runtime connection | **Not Configured** | `DATABASE_URL` still placeholder (owner must add password) |
| PostgreSQL migration connection | **Not Configured** | `MIGRATION_DATABASE_URL` still placeholder |
| Alembic configuration | **Tested** | offline SQL renders `app` schema + `gen_uuid_v7()` |
| Frontend build | **Tested** | `tsc --noEmit` clean; `vite build` succeeds |
| Admin build | **Tested** | `tsc --noEmit` clean; `vite build` succeeds |
| Backend tests | **Tested** | 7/7 pass |

---

## 7. Secret hygiene

- `.gitignore` ignores `.env`, `.env.*`, `*.env.local`, `*.env.<stage>`, keys/certs, `secrets/`;
  only `*.env.example` is tracked (verified with `git check-ignore`).
- Service-role key and DB passwords exist only in git-ignored files.
- A CI secret-scan job is planned for Phase 1 (gitleaks); local pre-commit hook recommended.
