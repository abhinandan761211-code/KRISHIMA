# KRISHIMA — Development Roadmap (AUTHORITATIVE)

- **Version:** 2.0 — supersedes `docs/ROADMAP.md` (v1.0)
- **Owner:** Principal Architect / Delivery
- **Status:** Authoritative project sequence. This is the **only** phase list.
- **Companions:** [Definition of Done](../DEFINITION-OF-DONE.md) ·
  [Open Questions](../OPEN-QUESTIONS.md) · [ADR index](../adr/README.md) ·
  [Foundation Stabilization Report](../testing/FOUNDATION_STABILIZATION_REPORT.md)

> **Authority.** Where any other document disagrees with this file on phase
> numbering or phase status, **this file wins**. Disagreements are reconciled in
> §5. Historical validation results are preserved unchanged; they are evidence,
> not plans.

---

## 1. Phase discipline

Every phase:

1. Inspect the repository and review the docs → 2. identify dependencies,
assumptions and security implications → 3. define acceptance criteria → 4. implement
**only that phase** → 5. run lint / typecheck / build / tests → 6. report **actual**
results and limitations → 7. update docs and ADRs.

A phase is complete only when its [Definition of Done](../DEFINITION-OF-DONE.md) is
met, **evidence exists in the repository**, and it has been reviewed. A phase is
never marked complete because code "looks finished".

**Evidence rule.** Every "Complete" row in §3 must name a file that proves it.

---

## 2. Project phases vs technical milestones

These are two different things and must not be conflated:

- **Project phase** — a delivery boundary with a Definition of Done, reviewed and
  signed off. Phases are what §3 tracks.
- **Technical milestone** — an internal checkpoint inside a phase (e.g. "RLS
  policies applied", "authz matrix green"). Milestones are tracked in the phase's
  own validation report, never promoted to a phase number.

The earlier confusion (calling the marketing site "Phase 3" while the roadmap's
Phase 3 was Catalog & Listings) was exactly this error. §5 records the fix.

---

## 3. The authoritative sequence

| Phase | Name | Status | Evidence / blocker |
|-------|------|--------|--------------------|
| **0** | Planning and architecture | **Complete** | ADRs 0001–0009, PRD, architecture, standards, threat model, this roadmap |
| **1** | Core platform foundation | **NOT complete** | Code + tests pass, but **B-1** (database credential is a template placeholder) blocks migrations, schema inspection and RLS. See [Foundation Validation Report](../testing/FOUNDATION_VALIDATION_REPORT.md) |
| **2** | Professional UI/UX design system | **Complete** | `packages/ui`; [Design System Validation Report](../testing/DESIGN_SYSTEM_VALIDATION_REPORT.md) — 0 axe violations, contrast PASS |
| **3** | Public website | **Complete** | 18 routes; [Public Website Validation Report](../testing/PUBLIC_WEBSITE_VALIDATION_REPORT.md) — axe WCAG 2.2 AA clean on all routes, both themes. Launch items: image licensing, Hindi translation |
| **4** | Authentication | **Not started** | Requires Phase 1 sign-off (B-1). Supabase JWT verification foundation exists but the phase is not begun |
| **5** | Multi-role account management | **Not started** | `backend/app/modules/` is empty — no identity/profile/KYC/organization code |
| **6** | Admin control panel | **Not started** | Admin shell exists (staff-guarded landing only); no management functions |
| **7** | Shared platform services | **Not started** | Notifications, audit expansion, search, file/storage services |
| **8** | Farmer account | **Not started** | Farm/plot records, crops, seasons |
| **9** | Buyer and retailer | **Not started** | Catalog, listings, search, verification gate |
| **10** | Agriculture service accounts | **Not started** | Labour, equipment, transport, warehouse |
| **11** | Integrated business transactions | **Not started** | Orders, payments, invoices, refunds |
| **12** | Community and creator platform | **Not started** | Knowledge, video learning, moderation |
| **13** | Production readiness and launch | **Not started** | Hardening, observability, pen-test, DPDP review |
| **14** | AI and ML | **Not started** | Out of scope until the platform has real data |

**No phase from 4 onward may begin until Phase 1 is signed off**, because every
later phase depends on the database, migrations and RLS that Phase 1 establishes.

---

## 4. Phase detail (scope and acceptance)

### Phase 0 — Planning and architecture (Complete)
Deliverables: PRD, system design, permission matrix, ER model, API standards,
threat model, design-system spec, repository structure, ADRs, roadmap, DoD, open
questions. Exit: docs reviewed; open questions accepted or resolved.

### Phase 1 — Core platform foundation (NOT complete)
Scope: monorepo scaffold; `packages/ui` tokens + primitives; frontend/admin
shells; backend skeleton (config, logging, error envelope, health/ready, CORS,
rate-limit stub); Alembic baseline; `users`/`roles`/`role_assignments`/`audit_log`/
`outbox_events`; RLS enabled + first policies; Supabase JWT verification and
`/api/v1/me`; CI; per-app `.env.example`.

Acceptance: `docker compose up`; CI green; login end-to-end against Supabase;
`/api/v1/me` returns identity; RLS leak test passes; audit row on login; no
business domain implemented.

**Blocked by B-1** — see §6.

### Phase 2 — Professional UI/UX design system (Complete)
Scope: centralized tokens, semantic layer, Light/Dark/System themes, shared
primitives, accessibility (WCAG 2.2 AA), contrast validation.
Acceptance: 0 axe violations; contrast PASS; both themes verified.

### Phase 3 — Public website (Complete)
Scope: 18 public routes, 15 landing sections, public navigation and footer,
i18n foundation, SEO metadata, responsive behaviour, automated accessibility.
Acceptance: routes render with real copy; no raw i18n keys; no horizontal overflow
320→1920; axe clean in both themes; build passes.

### Phase 4 — Authentication
Scope: Supabase Auth integration end-to-end, session handling, guarded routes,
login/logout, Google OAuth, MFA seam. **Not started.**

### Phase 5 — Multi-role account management
Scope: profiles (personal + org), addresses, locale/timezone; KYC submit → review →
verified/rejected with private documents and signed URLs; organizations,
memberships, roles, invitations; audit coverage; admin user management; full
authz matrix tests. **Not started.**

### Phase 6 — Admin control panel
Scope: staff roles and assignment, KYC review queue, audit viewer, moderation
hooks, destructive-action confirmation, MFA for sensitive actions. **Not started.**

### Phase 7 — Shared platform services
Scope: notifications (in-app minimal), search, file/storage service layer, audit
expansion, background jobs. **Not started.**

### Phase 8 — Farmer account
Scope: farm and plot records, crop timelines, seasons, harvest records. **Not started.**

### Phase 9 — Buyer and retailer
Scope: categories (tree, i18n names), listings, media, lifecycle state machine,
search and filters, pagination, KYC gate, moderation hook. **Not started.**

### Phase 10 — Agriculture service accounts
Scope: labour listings and applications; equipment listings with overlap-proof
bookings; transport requests; warehouse capacity and storage requests. **Not started.**

### Phase 11 — Integrated business transactions
Scope: orders with immutable line snapshots, payment adapter, webhook signature
verification, idempotency, invoices, refunds with four-eyes approval. **Not started.**

### Phase 12 — Community and creator platform
Scope: knowledge publishing, video learning, community Q&A, moderation policy. **Not started.**

### Phase 13 — Production readiness and launch
Scope: hardening, observability, backups and restore drills, penetration test,
DPDP Act compliance review, runbooks, launch checklist. **Not started.**

### Phase 14 — AI and ML
Scope: advisory and forecasting features, only once real platform data exists. **Not started.**

---

## 5. Reconciliation with the previous roadmap

`docs/ROADMAP.md` (v1.0) used a 9-phase list that mixed delivery boundaries with
domain modules. It is now a **redirect stub**. The mapping:

| Old (v1.0) | New (v2.0) | Note |
|------------|------------|------|
| Phase 0 — Documentation | **0** — Planning and architecture | Unchanged |
| Phase 1 — Foundation & Tooling | **1** — Core platform foundation | Unchanged, still blocked by B-1 |
| — (not in old roadmap) | **2** — Professional UI/UX design system | The design system was delivered outside the old numbering |
| — (not in old roadmap) | **3** — Public website | Previously mislabelled "Phase 3" in code comments; that label was wrong and has been corrected |
| Phase 2 — Identity, Profiles, KYC, Orgs, Admin Skeleton | **5** — Multi-role account management (+ **6** Admin) | Split: admin console separated into its own phase |
| Phase 3 — Catalog & Listings | **9** — Buyer and retailer | Moved behind farmer accounts |
| Phase 4 — Orders & Payments | **11** — Integrated business transactions | |
| Phase 5 — Labour & Equipment | **10** — Agriculture service accounts | Merged with logistics/storage |
| Phase 6 — Logistics & Storage | **10** — Agriculture service accounts | |
| Phase 7 — Content, Notifications, Analytics | **7** + **12** | Notifications → shared services; content → community |
| Phase 8+ — Scale & Hardening | **13** — Production readiness and launch | |
| — (not in old roadmap) | **4** — Authentication | Now an explicit phase |
| — (not in old roadmap) | **14** — AI and ML | Explicitly last |

**Preserved historical results.** The old roadmap's phase descriptions and every
validation report remain in the repository unchanged. They are historical evidence;
this file is the plan. Where an old report says "Phase 2 (Identity)" it now maps to
new Phase 5 — the report itself is not edited.

### Naming corrections applied
- `frontend/src/app/router/index.tsx` — comment no longer calls the marketing site
  "Phase 3" in the old sense; it references this roadmap.
- `frontend/src/features/public-website/pages/LandingPage.tsx` — same correction.
- `docs/product/PUBLIC_WEBSITE_SPECIFICATION.md` — carries the phase-naming note.

---

## 6. Blocker register

| ID | Blocker | Impact | Owner action required |
|----|---------|--------|----------------------|
| **B-1** | `DATABASE_URL` and `MIGRATION_DATABASE_URL` contain the literal template placeholder `[YOUR-DATABASE-PASSWORD]` (URL-encoded). No real password is present. | Blocks all DB connectivity, migrations, schema inspection, RLS work → blocks Phase 1 sign-off and every later phase | Supply the real database password in `backend/.env` and `database/.env` (percent-encoded). Instructions: [Foundation Stabilization Report](../testing/FOUNDATION_STABILIZATION_REPORT.md) §B-1 |
| **B-2** | Least-privilege `app_runtime` role does not exist | Runtime still uses an owner-level credential | Create the role and grant it in the Supabase dashboard (needs B-1 first) |
| **B-3** | Google OAuth never exercised end-to-end | Unknown whether the flow works | Interactive consent run by the owner |
| **B-5** | Repository was not under version control | **RESOLVED** — initialized, 225 files committed, no remote, no push | — |
| **B-6** | Two physical `@types/react@19.0.2` copies → `admin` typecheck fails inside `packages/ui` | Admin cannot be verified by `tsc`/build | Dependency-dedupe fix (separate task) |
| **B-7** | Public-website photography has no recorded source or licence | **RESOLVED** — unverified images replaced with original, licence-free illustrations; see [IMAGE_LICENSES](../assets/IMAGE_LICENSES.md) | — |
| **A-15** | Hindi translation did not exist (English strings under a Hindi label) | **RESOLVED** — full Hindi translation, key parity enforced, locale enabled after layout tests | Professional native review recommended before launch |
