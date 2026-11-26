# KRISHIMA — Development Roadmap

- **Version:** 1.0 (Phase 0)
- **Owner:** Principal Architect / Delivery
- **Status:** Proposed (each phase gated on the previous phase's DoD + review)
- **Companions:** [PRD](product/01-product-requirements.md) · [Definition of Done](DEFINITION-OF-DONE.md) · [Open Questions](OPEN-QUESTIONS.md)

---

## Phase Discipline

Every phase:
1. Inspect repository & review docs → 2. Identify deps/assumptions/security → 3. Define acceptance
criteria → 4. Implement **only that phase** → 5. Run lint/typecheck/build/tests → 6. Report real
results + limitations → 7. Update docs & ADRs.

**A phase is not complete until its [Definition of Done](DEFINITION-OF-DONE.md) is met and reviewed.**

---

## Phase 0 — Documentation (COMPLETE)

**Deliverables (all in `docs/`):**
- Product Requirements Document — `product/01-product-requirements.md`
- System Design Document — `architecture/01-system-design.md`
- Account & Permission Matrix — `product/02-account-permission-matrix.md`
- Conceptual Database ER Diagram + standards — `architecture/02-database-er-diagram.md`
- API Design Standards — `standards/02-api-design-standards.md`
- Security Threat Model — `security/01-threat-model.md`
- Design System Specification — `design/01-design-system-spec.md`
- Repository Structure Specification — `standards/01-repository-structure.md`
- Development Roadmap (this) + Definition of Done
- ADRs 0001–0009 — `adr/` (0009: root-level repository layout)
- Open Questions & Assumptions — `OPEN-QUESTIONS.md`

**Exit criteria:** docs reviewed; open questions either accepted as assumptions or resolved.
→ **STOP at phase boundary** (per instructions) and await approval before Phase 1.

---

## Phase 1 — Foundation & Tooling

**Goal:** a running, testable skeleton — no business features.

**Scope**
- Monorepo scaffold: pnpm workspaces, `packages/config`, `packages/ui` (tokens + core
  primitives), `frontend/` shell, `admin/` shell, `backend/` skeleton.
- Backend: config (pydantic-settings, fail-fast), structured logging + correlation id, error
  envelope, `/health`, `/ready`, OpenAPI enabled, CORS, rate-limit middleware stub.
- DB: Alembic baseline (`database/migrations`), `app` schema, `gen_uuid_v7()`, `users` + `roles` +
  `role_assignments` + `audit_log` + `outbox_events` tables, RLS enabled + first policies in
  `database/policies`.
- Auth: Supabase JWT verification, `Principal` resolution, `/api/v1/me`, `/api/v1/me/workspaces`,
  `X-Workspace-Id` handling, authz middleware with permission catalog (deny-by-default).
- Frontend shell: providers (Query, Auth, i18n), guarded routes, login/logout, workspace switcher,
  layout with brand tokens. Admin shell: staff-guarded landing only (MFA-aware).
- Infra: `infrastructure/docker` + root `docker-compose.yml`, CI (lint, typecheck,
  pytest, vitest, build, secret scan, RLS test job), per-app `.env.example` files.
- Mobile app: **not created** (deferred).

**Acceptance:** `docker compose up` works locally; CI green; login works end-to-end against local
Supabase; `/api/v1/me` returns identity; RLS leak test passes; audit row written on login;
no business domain implemented.

**Security focus:** TM-02, TM-08, TM-12, TM-19, TM-23.

---

## Phase 2 — Identity, Profiles, KYC, Organizations, Admin Skeleton

**Scope**
- Profiles (personal + org), addresses, locale/timezone.
- KYC: submit → in_review → verified/rejected; private document upload w/ signed URLs;
  admin KYC review queue; every doc view audited.
- Organizations: create, memberships, org roles, invitations (hashed token, expiry, single-use);
  role revocation invalidates permissions.
- Notifications (in-app minimal); audit coverage of role/KYC/membership changes.
- Admin: staff roles + assignment; user management (read), KYC queue, audit viewer.
- Full authz matrix test suite (positive + negative per role × permission).

**Acceptance:** FR-IAM, FR-PRO, FR-ADM-1/2 (partial) met; full matrix tests pass; cross-workspace
RLS tests pass; PII-in-logs test passes; private docs unreachable publicly.

**Security focus:** TM-01, TM-05, TM-06, TM-07, TM-09, TM-10, TM-11, TM-16, TM-21, TM-26, TM-27.

---

## Phase 3 — Catalog & Listings

**Scope**
- Categories (tree, i18n names), listings (produce/input), media upload, lifecycle state machine,
  search & filters, pagination.
- Seller KYC gate enforced (business + RLS).
- Moderation hook for listings (admin).
- Tests: state transitions, KYC gate, search, RLS, media validation.

**Acceptance:** FR-CAT met; listings visible only when `active`; unverified seller blocked;
cross-workspace write blocked.

---

## Phase 4 — Orders & Payments

**Scope**
- Orders + immutable line-item snapshots; lifecycle; cancellation.
- PaymentProvider adapter (`noop` default), initiate/capture, webhook with signature verify,
  reconciliation; idempotency keys; **no duplicate payment** proofs.
- Invoices (record; PDF generation may be deferred & marked).
- Refunds with four-eyes rule.
- **Transactional outbox** dispatcher introduced (background processing seam).
- Tests: idempotent retry, webhook replay, refund invariant, state transitions, RLS.

**Acceptance:** FR-ORD met (except FR-ORD-7 policy open Q); duplicate-payment impossible;
no fake payment success with `noop` provider (fails loudly).

**Security focus:** TM-13, TM-14, TM-24.

---

## Phase 5 — Labour & Equipment

**Scope**
- Jobs, applications (UQ per job×worker), engagements, employer decisions.
- Equipment listings + bookings with DB exclusion constraint (no overlap).
- Tests: overlap prevention, duplicate application prevention, authz.

**Acceptance:** FR-LAB, FR-EQP met; DB-level exclusion proven by test.

---

## Phase 6 — Logistics & Storage

**Scope**
- Transport requests → shipment assignment → lifecycle.
- Warehouses, storage bookings (capacity-safe via lock + reconcile), stock movement ledger.
- Tests: capacity overbooking prevented/handled; ledger balance integrity.

**Acceptance:** Logistics + Storage flows met; stock ledger append-only proven.

---

## Phase 7 — Content, Notifications Expansion, Analytics

**Scope**
- Content items (sanitized), moderation queue, multilingual content.
- Notification channels (SMS/email via adapters), preferences, templating.
- Admin analytics (aggregate, read-only, read replica-ready).
- Performance pass (search adapter seam, caching seam), accessibility audit, i18n completeness.

**Acceptance:** FR-CON, FR-NOT, FR-ADM-4 met; a11y axe critical = 0; i18n strings complete.

---

## Phase 8+ — Scale & Hardening (post-launch incremental)

- Redis cache/rate-limit backend; read replicas; table partitioning activation.
- Dedicated worker pool / managed queue (handler registry unchanged).
- WAF/bot protection; device binding / step-up auth; virus scanning on uploads.
- React Native / Expo mobile app (own threat model).
- Each step documented by ADR; no domain rewrite.

---

## Dependency Graph (phases)

```
P0 ─▶ P1 ─▶ P2 ─▶ P3 ─▶ P4 ─▶ P5 ─▶ P6 ─▶ P7
                          └─(outbox)┤
P3 needed by P4 (listings → order items)
P2 needed by P3 (KYC gate), P4 (payment identity)
P5/P6 independent of each other, both depend on P2 (workspaces) & P3 (seller profile)
```

---

## Milestone Acceptance Gates

| Gate | Requirement |
|------|-------------|
| G-A (after P1) | CI green, local stack runs, auth end-to-end |
| G-B (after P2) | Full authz matrix tests green, RLS leak tests green |
| G-C (after P4) | No-duplicate-payment proof, idempotency tests, outbox working |
| G-D (after P7) | Accessibility audit clean, i18n complete, perf budget met |

---

## Risks & Mitigations (delivery)

| Risk | Mitigation |
|------|-----------|
| Scope creep across 8 domains | Phase boundaries enforced; PRD §10 |
| Payment vendor delays | Adapter + `noop`; manual/admin reconcile fallback |
| KYC vendor not chosen | Interface + manual review queue |
| RLS regressions | CI leak tests mandatory |
| Rural connectivity perf | JS budget (<400 KB critical), skeleton states, pagination |
