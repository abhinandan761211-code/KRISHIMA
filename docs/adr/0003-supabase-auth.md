# ADR-0003: Supabase Auth for Authentication

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** Security Engineer, Backend Lead
- **Related:** [System Design](../architecture/01-system-design.md) §5 · [Threat Model](../security/01-threat-model.md) TM-01–03

## Context

The mandated stack specifies Supabase (PostgreSQL) and Supabase Auth. We need authentication that:
- supports email/password and phone OTP (relevant for rural India),
- issues tokens the API can verify without a network round-trip per request,
- integrates with Postgres RLS via JWT claims,
- minimizes bespoke security surface (password hashing, token rotation, MFA later).

## Decision

Use **Supabase Auth** as the identity provider for authentication (AuthN) only.

- The API verifies Supabase-issued **JWTs locally** against the project **JWKS**
  (cached), validating signature, algorithm allowlist, `exp`, `aud`, `iss`, `sub`.
- `auth.users.id` is mirrored into `app.users.auth_uid`; all business data references
  `app.users.id` (our own UUID), decoupling business schema from the auth schema.
- Authorization (roles/permissions/workspaces) is **ours**, stored in application tables
  (ADR-0004, ADR-0008) — Supabase Auth is not used for business RBAC beyond raw identity.
- Tokens are sent as `Authorization: Bearer` (not cookies) → CSRF-resistant.
- Revocation: on role/membership/KYC changes we invalidate permission caches and rely on short
  access-token TTL + refresh rotation.

## Consequences

**Positive**
- No custom password/OTP implementation → smaller attack surface.
- JWT + JWKS verification is fast and stateless → horizontal scaling friendly.
- Phone OTP available (configurable provider) for low-literacy/rural onboarding.
- Native Postgres integration for RLS GUCs.

**Negative / risks**
- Vendor coupling to Supabase Auth; migrating providers later is non-trivial.
- Access tokens are bearer tokens: theft → impersonation until expiry (TM-01). Mitigate with short
  TTL, refresh rotation, revocation on privilege change, later device binding/step-up.
- Staff and marketplace identities share the same IdP; separation enforced by our authz, not IdP.

**Mitigations**
- Abstract token verification behind a `TokenVerifier` interface so the IdP can be swapped with a
  contained change.
- Document a rotation/revocation runbook (Phase 1).
- Keep business schema independent of `auth.users` (only `auth_uid` FK-ish mirror).

## Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Custom auth (bcrypt + own JWT) | Large bespoke security surface; slow; error-prone |
| Auth0/Cognito | Extra vendor + cost; mandated stack is Supabase; phone OTP/rural fit weaker |
| Session cookies only | CSRF surface; stateless scaling harder |

## Revisit Trigger

If Supabase Auth cannot meet a hard requirement (e.g., specific KYC-linked identity assurance,
regulatory constraint), add a new ADR to migrate behind the `TokenVerifier` seam.
