# KRISHIMA — Security Policy

> This document is the **entry point**. Detailed threat analysis lives in
> [`docs/security/01-threat-model.md`](docs/security/01-threat-model.md); permanent rules in
> [`AGENTS.md`](AGENTS.md) §7.

## Reporting a vulnerability

**Do not open a public issue for security problems.** Report privately to the maintainers listed in
the repository's security contact (or the platform's private security advisory feature). Include:
affected component, reproduction steps, and impact. You will receive an acknowledgement and a
remediation timeline. Please allow reasonable time for a fix before disclosure.

> A dedicated security mailbox and disclosure SLA will be formalized in Phase 1
> (see [docs/OPEN-QUESTIONS.md](docs/OPEN-QUESTIONS.md) S-04).

## Security principles (must never be broken)

1. **Deny by default.** Every protected operation validates authentication **and** authorization.
2. **Two-layer authorization.** Application permission check **and** database RLS
   ([ADR-0008](docs/adr/0008-defense-in-depth-authz.md)).
3. **Least privilege.** The API runtime DB role is subject to RLS (no `BYPASSRLS`, no DDL).
   Migrations use a **separate** owner credential. The service-role key is server-side only.
4. **No secrets in the repository.** Only `.env.example` templates are tracked; real `.env`
   files are git-ignored at any depth.
5. **No privileged credentials in the browser.** Frontend/admin may contain only public config and
   publishable (anon) keys.
6. **Admin authority is server-side.** Admin/role permissions are never derived from frontend role
   selection or user-editable profile metadata.
7. **No sensitive data in logs or API responses.** PII is minimized and scrubbed.
8. **No destructive database operations without explicit authorization.**
9. **No production data in development or testing.**
10. **Never copy credentials from another project** (e.g., the legacy CenAGRI AI project).

## RLS & database connections (critical)

A privileged SQLAlchemy connection does **not** inherit an authenticated user's RLS context. RLS
applies only when the session variables (`app.current_user_id`, `app.current_workspace_id`) are set
**and** the connecting role is subject to RLS. Therefore:

- Request path = least-privilege runtime role + per-transaction session GUCs.
- Migrations = separate higher-privilege owner credential (`MIGRATION_DATABASE_URL`).
- Service role = server-side, narrow use (migrations/admin jobs/audit writer), audited.

## Environment & secrets

| Where | May contain |
|-------|-------------|
| `frontend/.env` · `admin/.env` | `VITE_*` public config + publishable anon key **only** |
| `backend/.env` | **all** server secrets (DB URLs, service-role key, JWT config, provider keys) |
| Root `.env.example` | shared non-secret local defaults only |

- Every variable is documented in the relevant `.env.example`.
- Rotate the service-role key, JWT signing config, and provider secrets on any suspected exposure.
- CI runs a secret scan and a dependency audit on every change (Phase 1).

## Threat model

The baseline STRIDE threat model (28 threats) with likelihood/impact and mitigations is maintained
in [`docs/security/01-threat-model.md`](docs/security/01-threat-model.md). It is **revisited every
phase**; newly identified threats must be added there and mitigated or explicitly accepted.

## Supported / planned controls

| Area | Status |
|------|--------|
| Local JWT verification (JWKS, alg allowlist, aud/iss/exp) | planned (Phase 1) |
| Deny-by-default authz + RLS leak tests in CI | planned (Phase 1–2) |
| Secret scanning + dependency audit in CI | planned (Phase 1) |
| MFA for admin/staff actions | planned (Phase 2) |
| Rate limiting, secure error envelope | planned (Phase 1) |
| Private storage + signed URLs for identity docs | planned (Phase 2) |
