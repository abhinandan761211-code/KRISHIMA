# KRISHIMA — Open Questions & Proposed Assumptions

- **Version:** 1.0 (Phase 0)
- **Owner:** Principal Architect / Product
- **Purpose:** Business & technical requirements that the brief leaves ambiguous. Each has a
  **proposed assumption** so implementation can proceed *only after acceptance at review*. Nothing
  below is silently assumed in code.

**Status legend:** `OPEN` (needs decision) · `ASSUMED` (proposed default; blocking if wrong) ·
`RESOLVED`

> **Rule:** if an item is still `OPEN`/`ASSUMED` when its phase starts, the related feature is
> implemented behind the stated assumption **and clearly marked**, or deferred with a visible
> "disabled / coming soon" state. We do not invent behavior.

---

## A. Business / Product Questions

| ID | Question | Proposed assumption (default) | Impact if wrong | Status |
|----|----------|-------------------------------|-----------------|--------|
| A-01 | Which marketplace roles are auto-granted at signup vs opt-in? | Auto: `farmer` (buying side) + `buyer`. Opt-in: retailer, worker, equipment owner, transporter, warehouse, creator. | Onboarding UX, permission matrix | ASSUMED |
| A-02 | Does a farmer selling produce act from a **personal** workspace or must they create an **organization**? | Sell from personal workspace by default; organization optional for multi-person farms. | Data model UX, listing ownership | ASSUMED |
| A-03 | Currency & multi-currency support? | INR only at launch (`currency='INR'` everywhere). | DB columns, formatting | ASSUMED |
| A-04 | Commission / platform fees on transactions? | **No platform fee in v1.** Payment = buyer→seller full amount via provider; fee model deferred. | Payment split logic, payouts | OPEN |
| A-05 | Minimum connectivity target / offline support? | Mobile-first, low-bandwidth (small payloads, skeletons, pagination). **No offline-first sync in v1.** | Frontend architecture | ASSUMED |
| A-06 | Refund four-eyes approval threshold | Refunds > ₹10,000 require a second approver ≠ initiator (configurable). | Finance policy, schema (approver columns) | ASSUMED |
| A-07 | Government integration (e-NAM, APMC, subsidy, e-KYC/Aadhaar)? | **Out of scope for v1.** Architecture leaves room via adapters. | Compliance, integrations | OPEN |
| A-08 | Search sophistication (location radius, crop names, synonyms) | v1: SQL `ILIKE`/trigram + pincode filter. PostGIS/geo search & external search deferred behind adapter. | Search UX, infra | ASSUMED |
| A-09 | DPDP Act 2023 compliance scope | Design-compliant (consent, minimization, export/delete); formal legal review pending. | Legal, retention, consent UI | OPEN |
| A-10 | KYC vendor / verification method (manual review vs automated)? | v1: **manual admin review** of uploaded docs; automated provider later via adapter. | KYC queue capacity, SLA | ASSUMED |
| A-11 | Worker wage payments — in-platform or off-platform? | v1: wages **recorded**, offline settlement; no worker payouts in v1. | Labour payment, payouts | OPEN |
| A-12 | Content creator monetization? | **Not in v1.** No payout permission exists. | Content schema, payments | ASSUMED |
| A-13 | Organization KYC vs personal KYC required for org selling? | Org-level KYC `verified` required for org-scoped selling; member personal KYC also required for the acting user. | KYC gating, UX | ASSUMED |
| A-14 | Cancellation & refund policy per domain (orders/bookings/storage)? | Deferred to each domain phase; no automatic refunds in v1 unless policy defined in that phase. | Payment logic | OPEN |
| A-15 | Language set at launch and who translates? | `en-IN` + `hi-IN` at launch; professional translation, strings externalized. | i18n scope | **RESOLVED (translation delivered in-repo)** — full Hindi catalogue (498 keys, exact parity with English, zero untranslated values), `hi-IN` enabled in the selector and covered by e2e layout/navigation/axe tests. **Recommended:** native-speaker review before public launch; it is a quality gate, not a blocker for offering the language. See `docs/testing/FOUNDATION_STABILIZATION_REPORT.md` §A-15. |
| A-16 | Ratings/reviews across participants? | Deferred post-v1; reputation noted in PRD but not implemented early. | Schema for reviews | OPEN |
| A-17 | Dispute resolution workflow depth? | v1: admin can view & decide (manual); automated escrow arbitration deferred. | Orders/disputes | ASSUMED |
| A-18 | Data retention periods (audit, KYC docs, soft-deleted records)? | Proposed: audit 7 yrs, KYC docs 5 yrs after relationship end, deleted user purge 30-day grace. **Needs legal confirmation.** | Compliance, purge jobs | OPEN |

## B. Technical Questions

| ID | Question | Proposed assumption | Impact | Status |
|----|----------|---------------------|--------|--------|
| T-01 | DB schema name: `app` vs `public`? | Use dedicated `app` schema; keep Supabase `auth` untouched. | Migrations, RLS naming | ASSUMED |
| T-02 | SQLAlchemy sync vs async? | **Sync** SQLAlchemy 2.x (simpler, predictable) initially; async driver variant documented (`DATABASE_URL_ASYNC`) for future. | Concurrency model | ASSUMED |
| T-03 | When to introduce Redis? | Only when rate-limit/cache needs exceed in-memory (multi-replica). Behind `RATE_LIMIT_BACKEND` / cache adapter. | Infra timing | ASSUMED |
| T-04 | PII encryption at rest for identity numbers? | Hash where full value unnecessary; full doc scans only in private bucket; column-level encryption deferred pending legal (A-09). | DB schema, crypto | OPEN |
| T-05 | Money stored as minor units (paise) vs `numeric(14,2)` INR? | `numeric(14,2)` INR decimals with strict rounding rules; API sends decimal strings. | Payments accuracy | ASSUMED |
| T-06 | Partitioning activation threshold? | Design partition-ready; activate when table row/latency thresholds hit (documented in roadmap P8). | Performance | ASSUMED |
| T-07 | Monorepo tool: pnpm workspaces + (Turbo?) | pnpm workspaces; add Turbo only if build time justifies. | DX, CI time | ASSUMED |
| T-08 | API client generation source of truth? | Generate TS client from OpenAPI (`scripts/gen-api-client`); commit generated output for reproducibility. | Frontend typing | ASSUMED |
| T-09 | Admin and web share Supabase project? | Yes (same DB, same IdP) but **separate apps & builds & platform roles**; authz separates them. | Security model | ASSUMED |
| T-10 | Production error tracking vendor? | Sentry (config-gated, optional). | Observability | ASSUMED |
| T-11 | Notification dedupe policy? | Best-effort dedupe by (user, template, subject, window) in notification service; exact policy TBD. | UX (spam) | OPEN |
| T-12 | Warehouse capacity overbooking handling? | Service-level lock + reconcile job (sum-based capacity not expressible as DB exclusion). | Storage correctness | ASSUMED |
| T-13 | API field casing (`snake_case` vs `camelCase`)? | `snake_case` across DB/Python/JSON for zero-mapping consistency; generated TS client keeps same names. | Frontend ergonomics | ASSUMED |
| T-14 | Mobile strategy timing? | React Native/Expo after web stabilizes (Phase ≥8); not before. | Resourcing | ASSUMED |
| T-15 | Hosting/deployment platform (container host)? | Container-based (Docker) with env-specific deploy; concrete host TBD in Phase 1 infra task. | DevOps | OPEN |

## C. Data / DB Questions

| ID | Question | Proposed assumption | Status |
|----|----------|---------------------|--------|
| Q-DB-1 | Schema naming (`app` vs `public`)? | `app` schema (see T-01). | ASSUMED |
| Q-DB-2 | Identity-number encryption approach? | See T-04 (hash + private storage now, column encryption later). | OPEN |
| Q-DB-3 | Soft-delete retention & purge policy? | See A-18. | OPEN |
| Q-DB-4 | Do we need a `workspaces` table or derive from user/org? | Derive: personal workspace = `workspace_id = user_id` convention; org workspace = org id. **No separate table** unless needed. | ASSUMED |
| Q-DB-5 | `order_no` / invoice numbering scheme? | Human-readable prefixed sequence (e.g., `KR-ORD-YYYYMM-######`) generated transactionally; not a PK. | ASSUMED |

## D. Security / Compliance Questions

| ID | Question | Proposed assumption | Status |
|----|----------|---------------------|--------|
| S-01 | Is MFA/step-up auth required at launch? | Not at launch; design leaves seam; add before handling high-value payments (P≥4). | OPEN |
| S-02 | Data residency requirement (India-only)? | Assume Supabase region in/near India where available; confirm. | OPEN |
| S-03 | Pen-test / external security audit timing? | Before public launch (pre-G-D). | OPEN |
| S-04 | Incident response & breach-notification process owner? | Defined in Phase 1 runbook; owner TBD (Ops). | OPEN |

---

## Review Gate

At the Phase 0 review, the reviewer should:
1. Mark each `OPEN` item **resolved** or **accepted-as-assumption**.
2. Any `ASSUMED` item that is **wrong** must be flagged — it will change schema, permissions, or
   payments during Phase 1–4.
3. Items left `OPEN` when their phase begins will cause the related feature to ship **disabled**
   (clearly marked) rather than with invented behavior.

**Highest-impact items to decide before Phase 1:** A-01, A-02, A-03 (currency), T-01 (schema),
T-02 (sync/async), T-05 (money representation), Q-DB-4 (workspace derivation).
