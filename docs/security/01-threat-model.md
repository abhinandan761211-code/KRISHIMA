# KRISHIMA — Security Threat Model

- **Version:** 1.0 (Phase 0)
- **Owner:** Security Engineer
- **Methodology:** STRIDE + data-flow analysis; asset-centric
- **Status:** Baseline (revisit each phase; threats marked "deferred" are accepted for now)
- **Companions:** [System Design](../architecture/01-system-design.md) · [Permission Matrix](../product/02-account-permission-matrix.md) · [ADR-0008](../adr/0008-defense-in-depth-authz.md)

---

## 1. Scope & Assumptions

In scope: web app, admin app, FastAPI API, PostgreSQL (Supabase), storage buckets, auth
provider, external adapters, CI/CD, and developer workflow.

Assumed adversary capabilities:
- Unauthenticated internet attacker (enumeration, credential stuffing, scanning).
- **Authenticated malicious user** (holds a valid account in some workspace) — *the highest-value
  insider threat class*: attempts cross-workspace reads, privilege escalation, IDOR.
- Compromised user device / stolen session token.
- Malicious marketplace participant (dispute abuse, fake listings, payment manipulation).
- Supply-chain (dependency) and misconfigured infrastructure.

Out of scope for this document: nation-state actors, physical security of Supabase datacenters,
and mobile app threats (mobile is future).

---

## 2. Assets (what we protect)

| ID | Asset | Sensitivity |
|----|-------|-------------|
| A1 | Identity documents (Aadhaar/PAN/GSTIN scans) | **Critical** — PII |
| A2 | Personal contact info (phone, email, address) | High — PII |
| A3 | Authentication tokens / session | Critical |
| A4 | Payment records & financial data | High |
| A5 | Service-role DB key & JWT secret | **Critical** — full DB access |
| A6 | Cross-workspace business data (orders, listings, negotiations) | High — confidentiality |
| A7 | Audit log integrity | High — non-repudiation |
| A8 | Platform availability | High |
| A9 | Admin console & staff privileges | Critical |

---

## 3. Trust Boundaries

```
[Untrusted: Browser/User] --(1)--> [Edge: LB/TLS] --(2)--> [API: AuthN]
   [API: AuthZ] --(3)--> [DB: RLS] 
   [API: service-role context] --(4)--> [DB bypass RLS]   (migrations/jobs only)
   [API] --(5)--> [External adapters: payments/SMS] --(6)--> [Third-party]
   [Storage] --(7)--> [Supabase Storage: private bucket]
```
Each numbered boundary is an attack surface. Controls are mapped below.

---

## 4. Threat Register (STRIDE)

Legend: **L**ikelihood × **I**mpact → Risk = H/M/L. Status: Mitigated / Partially / Accepted / Deferred.

| ID | STRIDE | Threat | Asset | L×I | Controls | Status |
|----|--------|--------|-------|-----|----------|--------|
| TM-01 | Spoofing | Stolen Supabase JWT used from another device | A3 | M×H | Short-lived access tokens + refresh rotation; revocation on role/membership change; bind to `aud/iss`; optional device binding (deferred); anomaly on impossible travel (Phase ≥4) | Partially |
| TM-02 | Spoofing | Forged JWTs (wrong key, `alg=none`) | A3 | L×H | Verify signature via JWKS; allowlist algorithm; validate `exp/aud/iss/sub` server-side | Mitigated |
| TM-03 | Spoofing | Credential stuffing / OTP brute force | A3 | H×M | Rate-limit auth endpoints; OTP attempt caps; Supabase Auth lockouts; breach-password check (Phase ≥2) | Partially |
| TM-04 | Tampering | Mass assignment — client sets `status`,`workspace_id`, `amount`, role fields | A4,A6 | M×H | `extra=forbid` write schemas; explicit field whitelist; server-derived actor/workspace; never trust client ids for ownership | Mitigated |
| TM-05 | Tampering | Client sends another workspace's `X-Workspace-Id` | A6 | H×H | Verify membership for the header; mismatch → 403; RLS re-check | Mitigated |
| TM-06 | Information disclosure | **IDOR / cross-workspace data leak** via guessed UUID | A6 | M×H | UUIDv7 (non-enumerable but still random enough); app-layer ownership check; RLS as backstop; cross-workspace CI tests; 404 for hidden resources | Mitigated (defense-in-depth) |
| TM-07 | Information disclosure | Private KYC docs accessible via public URL | A1 | M×Critical | Private bucket; signed short-lived URLs; `kyc.document.view` permission + audit per view; no public ACL | Mitigated |
| TM-08 | Info disclosure | Secrets in repo / logs / responses | A5 | M×Critical | `.env` git-ignored; only `.env.example` (placeholders); service-role server-only; log PII/secret scrubber; CI secret scan (gitleaks); error envelope hides internals | Mitigated |
| TM-09 | Elevation | Self-assign a marketplace/staff role | A9 | M×H | Role assignment server-side only; staff roles assignable only by `super_admin`; audit | Mitigated |
| TM-10 | Elevation | Org `manager` grants higher roles (privilege escalation up the org) | A9 | M×H | Cannot grant a role with permission superset of own; owner-only for `owner` transfer | Mitigated |
| TM-11 | Elevation | Marketplace user reaches `/admin/*` | A9 | M×H | Separate namespace authz; staff function in RLS; separate admin build & token audience check | Mitigated |
| TM-12 | Elevation | Exploiting RLS misconfiguration (policy dropped/regressed) | A6 | M×H | RLS leak tests in CI fail build; migration review requires security sign-off for policy changes | Partially |
| TM-13 | Tampering (Fraud) | **Double payment / double order** via replay or retry | A4 | M×H | `Idempotency-Key` + UQ on `provider_reference`; webhook signature verify; reconcile job | Mitigated (design) |
| TM-14 | Tampering (Fraud) | Refund abuse by finance staff | A4 | L×H | Four-eyes above threshold (`approved_by ≠ initiated_by`); audit; refund ≤ captured invariant | Mitigated (design) |
| TM-15 | Tampering | Fake listings / phishing content | A6 | H×M | KYC gate for sellers; moderation; sanitized content; report/block | Partially |
| TM-16 | Repudiation | A user denies committing a sensitive action | A7 | M×M | Append-only audit log (no UPDATE/DELETE grants); actor+timestamp+IP hash+request id | Mitigated |
| TM-17 | DoS | API flooding / expensive search / large uploads | A8 | M×M | Rate limiting; `per_page` caps; `MAX_UPLOAD_BYTES`; query timeouts; CDN for assets | Partially |
| TM-18 | Info disclosure | Verbose errors / stack traces leak internals | A5,A8 | M×L | Global exception handler; typed envelope; debug off in prod | Mitigated |
| TM-19 | Elevation | SQL injection | A6 | L×H | SQLAlchemy parameterized queries; no string-built SQL; RLS uses session GUCs (typed uuid cast) | Mitigated |
| TM-20 | Tampering | XSS in listings/content | A2,A6 | M×M | Server-side sanitization (HTML allowlist); CSP; React escaping | Partially |
| TM-21 | Info disclosure | PII in logs / OCR'd doc data in payloads | A1,A2 | M×H | Scrubber; no sensitive payloads in audit/notification `payload` | Partially |
| TM-22 | Supply chain | Malicious/compromised dependency | A5 | L×H | Pinned versions + lockfiles; dependabot review; CI `pip-audit`/`npm audit`; no arbitrary postinstall | Partially |
| TM-23 | Tampering | CSRF on state-changing calls | A6 | L×M | Bearer token (not cookie) primary auth → CSRF-resistant; if cookies used, SameSite+CSRF token | Mitigated |
| TM-24 | Spoofing | Webhook forgery (fake payment success) | A4 | M×H | Verify provider signature; idempotent processing; reconcile with provider | Deferred (Phase 4) |
| TM-25 | Elevation | Dev/staging data leaking to prod or vice versa; prod data used in dev | A1,A2 | L×H | Separate projects/keys per env; synthetic data only in dev/test | Mitigated (policy) |
| TM-26 | Info disclosure | Account takeover via support social-engineering | A3 | L×H | Staff actions audit-logged; high-risk changes require Admin+ & four-eyes; support cannot read secrets | Partially |
| TM-27 | Tampering | Malicious file upload (doc/image) with embedded payloads | A8 | M×M | MIME/size validation; store in private/public buckets with restricted content types; no server-side execution; virus scan (deferred) | Partially |
| TM-28 | Elevation | Session persists after KYC suspension / role removal | A9 | M×H | On revocation, invalidate caches; short token TTL; permission re-check per request | Partially |

---

## 5. Security Controls by Boundary

### Boundary 1–2 (Client → API)
- Enforce TLS everywhere; HSTS; secure headers (`CSP`, `X-Content-Type-Options`,
  `Referrer-Policy`, `frame-ancestors 'none'`).
- CORS allowlist from `CORS_ALLOWED_ORIGINS` (no `*` with credentials).
- Bearer token validation (TM-02); rate limiting (TM-03/17).

### Boundary 2–3 (API → DB)
- Per-request DB session sets `app.current_user_id`, `app.current_workspace_id`.
- RLS enabled on all tenant tables (TM-06/12).
- Queries parameterized via SQLAlchemy (TM-19).
- Least-privilege DB role for the API runtime connection (no DDL, no `BYPASSRLS`).

### Boundary 4 (Service-role context)
- Used **only** by migrations, outbox admin jobs, and audit writer.
- Documented per call site; never combines with unvalidated user input.
- Separate credential from runtime DB role; rotate-able.

### Boundary 5–6 (Adapters → third party)
- Secrets in server env only; timeouts + retries; response schema validated.
- Webhook signature verification (TM-24); never trust provider "success" without state check.
- `noop` adapters fail loudly instead of faking success (no silent fake functionality).

### Boundary 7 (Storage)
- Private buckets for KYC; signed URL TTL minimal; access logged (TM-07).
- Public assets bucket only for listing images; content-type & size limits (TM-27).

---

## 6. Secure Error Handling

- Single error envelope: `{error:{code,message,details?,request_id}}`.
- `500` → generic message; details to internal logs only (with `request_id`).
- Validation errors never echo full request bodies (could contain secrets).
- No differential errors that reveal resource existence for hidden authz cases (use 404).

## 7. Logging & Audit

- **Never log**: passwords, OTPs, tokens, JWTs, cookies, service keys, full Aadhaar/PAN,
  card/bank data, unsigned URLs with secrets.
- Hash IP & user-agent in audit; keep correlation id.
- Audit log is append-only; only `audit.read` (Admin/Super) can query; all audit reads are
  themselves audited.

## 8. Secrets Management

- No secrets in git; `.env.example` placeholders only.
- Pre-commit hook + CI secret scanning (gitleaks) blocks accidental commits.
- Per-env secrets in platform secret store / GitHub Environments.
- Rotation plan for service-role key and JWT secret (**documented runbook — Phase 1**).

## 9. Data Protection & Privacy (India DPDP alignment — assumption A-09)

- Collect minimum PII; document purpose per field.
- Consent capture for processing & marketing; withdrawal supported.
- Data subject rights: export & deletion workflow (soft-delete then purge).
- PII at rest: rely on Supabase encryption; identity numbers hashed where full value not needed;
  full doc scans only in private bucket.

## 10. Residual Risks (explicitly accepted for now)

| Risk | Reason | Follow-up |
|------|--------|-----------|
| No device binding / step-up auth yet | Complexity vs. Phase 1 scope | Phase ≥4 security hardening |
| No WAF/realtime bot protection yet | Deferred infra | Before public launch |
| No virus scanning on uploads | Deferred | Before content/KYC scale |
| Storage capacity overbooking race (warehouse) | Sum-based capacity hard to express as DB exclusion only | Service-level lock + reconcile job in Storage phase |
| Mobile app threats | Mobile is future | Threat-model with mobile phase |

## 11. Security Test Requirements (per phase DoD)

- Authz matrix tests: every ✔ positive, every blank negative (`403`/empty).
- Cross-workspace leak tests (API + direct RLS query).
- No-PII-in-logs test (scan log capture for email/phone/token patterns).
- Idempotency/duplicate-payment tests.
- Secret scanning in CI; dependency audit in CI.
- JWT forgery/expiry/algorithm tests.
- Upload validation tests (size, type).
