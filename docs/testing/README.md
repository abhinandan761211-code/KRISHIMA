# KRISHIMA — Local Development Guide

> Practical commands for running, testing and troubleshooting the foundation.
> Never paste real credentials into this file or any tracked file.

---

## 1. Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Python | 3.11+ | backend |
| Node.js | 20+ | frontend/admin |
| npm | 10+ | pnpm workspace adoption is a later step |
| Supabase CLI | latest | linking, storage helpers (optional) |
| Docker | optional | only needed for the container path |

---

## 2. Environment files

Copy the template to the real file **in the same directory**:

```bash
cp backend/.env.example  backend/.env        # server secrets
cp frontend/.env.example frontend/.env.local # public config only
cp admin/.env.example    admin/.env.local    # public config only
cp database/.env.example database/.env       # migration credential
```

All real `.env*` files are git-ignored at any depth. Only `*.env.example` is tracked.

### Required variable names

**Backend** — `APP_ENV`, `API_BASE_URL`, `APP_FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`,
`DATABASE_URL`, `MIGRATION_DATABASE_URL`, `DB_POOL_SIZE`, `DB_MAX_OVERFLOW`, `DB_POOL_TIMEOUT`,
`DB_POOL_RECYCLE`, `DB_POOL_PRE_PING`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`,
`SUPABASE_ANON_KEY`, `SUPABASE_JWKS_URL`, `SUPABASE_JWT_SECRET`, `SUPABASE_JWT_AUDIENCE`,
`SUPABASE_JWT_ISSUER`, `SUPABASE_JWT_ALGORITHMS`, `JWKS_CACHE_TTL_SECONDS`,
`SUPABASE_OAUTH_GOOGLE_ENABLED`, `SUPABASE_STORAGE_PUBLIC_BUCKET`,
`SUPABASE_STORAGE_PRIVATE_BUCKET`, `MAX_UPLOAD_BYTES`, `SIGNING_SECRET`, `RATE_LIMIT_BACKEND`,
`RATE_LIMIT_DEFAULT_PER_MINUTE`, `LOG_LEVEL`, `SENTRY_DSN`, `PAYMENT_*`, `SMS_*`, `GEO_*`.

**Frontend / Admin** — `VITE_APP_ENV`, `VITE_API_BASE_URL`, `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`, `VITE_AUTH_CALLBACK_URL` (+ `VITE_ENABLE_GOOGLE_AUTH` frontend).

**Database tooling** — `MIGRATION_DATABASE_URL`, `DATABASE_CHECK_URL`, `DB_SCHEMA`, `APP_ENV`.

---

## 3. Database connection strings

Supabase Dashboard → **Project Settings → Database → Connection string**.

| Use | Tab | Port | Notes |
|-----|-----|------|-------|
| `DATABASE_URL` | Transaction pooler | 6543 | runtime, least-privilege role |
| `MIGRATION_DATABASE_URL` | Session pooler / Direct | 5432 | owner role, Alembic only |

Both must use the SQLAlchemy driver form:

```
postgresql+psycopg://USER:PASSWORD@HOST:PORT/postgres?sslmode=require
```

> **Passwords must be URL-encoded.** Characters such as `[ ] @ : / ? #` break URL parsing.
> Encode with:
> ```bash
> python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1], safe=''))" 'YOUR_PASSWORD'
> ```
> Then paste the encoded value into the URL (do **not** wrap it in brackets).

---

## 4. Startup commands

```bash
# Backend
cd backend
python3 -m pip install -e .
python3 -m uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev        # http://localhost:5173

# Admin
cd admin && npm install && npm run dev           # http://localhost:5174
```

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health/live` | liveness (always 200 while the process is up) |
| GET | `/health/ready` | readiness — **503** when a critical dependency is unavailable |
| GET | `/api/v1/health` | versioned health summary (200; `status` = ok/degraded) |
| GET | `/api/v1/version` | version + uptime metadata |
| GET | `/api/v1/ready` | versioned alias of readiness |
| GET | `/api/v1/auth/config` | public auth capabilities (no secrets) |
| GET | `/api/v1/me` | current identity (requires `Authorization: Bearer <jwt>`) |
| GET | `/docs` | OpenAPI UI (disabled in production) |

The dev-only **System Status** page at `/` (and `/system-status`) renders real results from
`/health/ready`. It is not available in production builds.

---

## 5. Migrations

```bash
# Apply all migrations (uses MIGRATION_DATABASE_URL from database/.env)
database/scripts/migrate.sh upgrade head

# Show current revision / history
database/scripts/migrate.sh current
database/scripts/migrate.sh history

# Render SQL without touching a database (safe, offline)
cd database && PYTHONPATH=../backend alembic upgrade 0001_baseline --sql
```

Rules: Alembic is authoritative; SQL in `database/policies|functions|triggers|views|indexes`
is applied **through** Alembic; never edit production schema in the dashboard; destructive
migrations require explicit approval and a rollback plan.

---

## 6. Storage

```bash
# Idempotent: creates buckets declared in database/storage/buckets/buckets.json
python3 database/scripts/create_storage_buckets.py
```

| Bucket | Visibility | Allowed types |
|--------|-----------|---------------|
| `public-assets` | public | image/jpeg, image/png, image/webp |
| `private-documents` | **private** | application/pdf, image/jpeg, image/png |

Private objects are served only via short-lived signed URLs (`expires_in` seconds, default 300).

---

## 7. Google OAuth

1. **Google Cloud Console → Credentials → OAuth client (Web application)**
   – Authorised redirect URI: `https://<PROJECT_REF>.supabase.co/auth/v1/callback`
2. **Supabase Dashboard → Authentication → Providers → Google** – paste Client ID + **Secret**
   (the secret lives only here, never in any app env file).
3. **Supabase Dashboard → Authentication → URL Configuration** – set Site URL and add redirect
   URLs:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5174/auth/callback
   ```
4. App side: `authService.signInWithGoogle()` → Supabase → Google → `/auth/callback`
   (`frontend/src/features/auth/pages/AuthCallbackPage.tsx`).

---

## 8. Testing commands

```bash
# Backend
cd backend
python3 -m ruff check app tests
python3 -m pytest tests/ -v

# Frontend
cd frontend
npm run lint
npm run typecheck
npm run test
npm run build

# Admin
cd admin && npm run typecheck && npm run build

# Cross-cutting foundation verification (honest dependency report)
python3 scripts/verify_foundation.py

# Dependency audits
cd frontend && npm audit --omit=dev
cd admin && npm audit --omit=dev
```

---

## 9. i18n (internationalisation)

- Runtime: `packages/ui/src/i18n/i18n.ts` (dependency-free, flat dot-separated keys).
- Provider: exactly **one** `I18nProvider` in `frontend/src/app/providers/AppProviders.tsx`.
- Catalogue: `frontend/src/features/public-website/i18n/{en,hi,index}.ts`;
  registered at entry via `initI18n(...)` in `main.tsx`.
- Persistence key: `krishima.locale` in localStorage; `<html lang>` is kept in sync.
- **Hindi (`hi`) is `partial`** — a structural mirror with `// TODO(hi)` tags, so it is **not
  offered** until professionally translated (OPEN-QUESTIONS A-15). Do not flip it to `complete`
  early. A test enforces `en`/`hi` key parity.
- Full report: [`docs/testing/I18N_VALIDATION_REPORT.md`](I18N_VALIDATION_REPORT.md).

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `authentication failed for user ...` | Wrong DB password, or password not URL-encoded | Re-copy the password; percent-encode special chars (§3) |
| `could not translate host name "aws-0-..."` | Wrong pooler shard | Use the shard reported by your project (e.g. `aws-1-<region>`) — copy it verbatim from the dashboard |
| Readiness returns **503** | A critical dependency is down | Open `/health/ready` and read each dependency's `status`/`detail` |
| `/api/v1/me` → 401 | Missing/expired token | Sign in again; tokens are short-lived and refreshed by the Supabase client |
| CORS blocked in browser | Origin not in `CORS_ALLOWED_ORIGINS` | Add the exact origin (scheme + host + port) |
| Frontend throws "Invalid frontend environment configuration" | Missing `VITE_*` value | Fill `frontend/.env.local`; restart Vite (env is read at startup) |
| Google login returns to wrong URL | Redirect not allowlisted | Add the exact callback URL in Supabase → URL Configuration |
| `Invalid URL`/`port out of range` from a DB URL | Password contains `@ : / ? #` unencoded | Percent-encode the password |
| `capsule`/`sslmode` errors with psycopg | Missing `?sslmode=require` | Append it to the URL |
| Migrations fail with "MIGRATION_DATABASE_URL is not configured" | Placeholder in `database/.env` | Set the real migration URL |

---

## 11. Known limitations (Phase 1)

- No business tables or RLS policies yet (deliberately out of Phase 1 scope).
- Google OAuth is **configured** but no interactive end-to-end login has been executed.
- `DATABASE_URL` uses an owner-level credential until a dedicated `app_runtime` role is created.
- Rate limiting is in-memory (single instance, development only).
- Mobile app is not implemented.
- `admin` typecheck currently fails on one error **inside `packages/ui`** caused by two physical
  copies of `@types/react@19.0.2` (one under `packages/ui/node_modules`, one under
  `admin/node_modules`). Admin's own `src/` is clean. Pre-existing monorepo dedupe issue — see
  `docs/testing/I18N_VALIDATION_REPORT.md` §7.
