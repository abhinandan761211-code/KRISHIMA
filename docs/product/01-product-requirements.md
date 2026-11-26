# KRISHIMA — Product Requirements Document (PRD)

- **Version:** 1.1 (Phase 0 + foundation standardization)
- **Owner:** Principal Software Architect / Product
- **Status:** Approved for Phase 1 planning pending review of open questions
- **Companions:** [Account & Permission Matrix](02-account-permission-matrix.md) · [System Design](../architecture/01-system-design.md) · [Roadmap](../ROADMAP.md) · [Open Questions](../OPEN-QUESTIONS.md)

---

## 1. Vision

KRISHIMA is an agriculture super-application for India that connects every participant in
the agricultural value chain — from farm to consumer, and the services between — in one
trusted, multilingual platform.

A single identity participates in whatever roles they need (a farmer may also be a buyer and
an equipment owner), with **independent workspaces**, **organization memberships**, and
**configurable permissions**, so that a smallholder's personal account and a 5,000-acre
agribusiness operate on the same platform without interfering.

**Scale target:** architecture prepared for **10,000,000+ registered users** without a full
application rewrite. Incremental infrastructure scaling only (stateless API, partition-ready
data model, async background processing).

## 2. Goals

| ID | Goal | Success signal |
|----|------|----------------|
| G1 | One identity, many roles, independent workspaces | A user can switch role/workspace with no data bleed between them |
| G2 | Trustworthy transactions | No duplicate payments/orders/bookings by construction (DB constraints) |
| G3 | Works for rural India | Mobile-first, low-bandwidth tolerant, multilingual, WCAG 2.1 AA |
| G4 | Safe by construction | Deny-by-default access, RLS enforced in DB, audit trail on sensitive ops |
| G5 | Operable at scale | Stateless API, horizontal scaling, async jobs, partition-ready tables |
| G6 | Modular evolution | A domain module can be changed without touching unrelated modules |
| G7 | Replaceable vendors | Payments/SMS/geo behind adapters; no vendor lock-in in domain logic |

## 3. Non-Goals (this product phase)

- Native mobile app (React Native/Expo is **future**; not Phase 1–5).
- Marketplace payments settlement/escrow complexity beyond adapter interface (Phase 4).
- Government scheme integration (e-NAM, APMC, subsidy portals) — future, noted as assumption A-07.
- Blockchain provenance, AI disease diagnosis — future, not committed.
- Offline-first sync engine — future; low-bandwidth is handled by responsive/lightweight UI first.

## 4. Personas & Core Account Types

Every account type is a **role** a user holds, not a separate account. See the
[Account & Permission Matrix](02-account-permission-matrix.md) for the full permission model.

| Role | Primary need | Key capabilities (summary) |
|------|--------------|-----------------------------|
| **Farmer** | Sell produce, buy inputs, find labour/equipment, track income | List produce, list/track crops, place input orders, book labour/equipment, request transport/storage |
| **Buyer** | Source quality produce at fair price | Browse/search listings, place orders, negotiate, track fulfilment |
| **Retailer** | Stock and resell inputs/produce | Manage catalog & stock, fulfill orders, manage customers |
| **Worker** | Find paid farm/agri labour | Find/apply to jobs, manage availability, get paid, build reputation |
| **Equipment Owner** | Monetize equipment | Publish equipment, manage availability & bookings, pricing |
| **Transporter** | Utilise vehicles | Publish vehicle capacity/route, accept transport requests, track delivery |
| **Warehouse** | Monetize storage | Publish capacity/location/rates, accept storage bookings, stock ledger |
| **Content Creator** | Publish agri knowledge | Publish articles/videos, earn recognition (monetization deferred) |

**Secondary roles (implied, not "core" but required for operations):** Support Agent,
Finance/Operations Staff, Platform Administrator, Super Administrator — these are
**internal staff roles** on the admin console, not marketplace participants.

**Organizations:** Any participant may operate alone (personal workspace) or as part of an
organization (e.g., a Farming Company, a Retail Chain, a Transport Fleet) with members
who each hold a role **within that organization's workspace**.

## 5. Domain Map

The system is a **domain-based modular monolith** (see [ADR-0001](../adr/0001-modular-monolith.md)).
Domains and their primary responsibilities:

| Domain | Responsibility | Phase introduced | Backend module dir(s) |
|--------|----------------|------------------|-----------------------|
| **Identity & Access** | Users, authentication, roles, workspaces, orgs, invitations, permissions | 1–2 | `identity`, `users`, `roles`, `organizations` |
| **Profile & KYC** | Personal/organization profiles, addresses, identity document verification | 2 | `verification`, `locations` |
| **Catalog & Listings** | Produce/input catalog, listings, pricing, media | 3 | `marketplace`, `farms`, `crops`, `media`, `procurement`, `retail` |
| **Orders & Payments** | Orders, line items, payments (adapter), invoices | 4 | `orders`, `payments`, `bookings` |
| **Labour** | Job postings, applications, engagements, wages | 5 | `employment` |
| **Equipment** | Equipment listings, availability, bookings | 5 | `equipment` |
| **Logistics** | Transport requests, shipments, vehicle capability | 6 | `logistics` |
| **Storage** | Warehouse listings, storage bookings, stock ledger | 6 | `warehouse` |
| **Content** | Articles/videos, moderation, categories | 7 (trimmed) | `creator`, `community` |
| **Notifications** | In-app + SMS/email fan-out via adapter | 2 (minimal) → expands | `notifications`, `messaging` |
| **Admin & Ops** | Moderation, user management, disputes, audit review, analytics | 2 → expands | `admin`, `support`, `analytics` |
| **Audit & Compliance** | Immutable audit log, consent, export/delete | 1 (foundation) | (cross-cutting: `shared` + `database/`) |

> **Module naming:** the directory column above is the authoritative backend module vocabulary
> (see [Repository Structure §3](../standards/01-repository-structure.md)). PRD requirement IDs
> (`FR-IAM`, `FR-PRO`, `FR-CAT`, `FR-LAB`) remain business-domain labels used in this document.

## 6. Functional Requirements

Requirement IDs: `FR-<domain>-<n>`. Priority: **M**ust / **S**hould / **C**ould.

### 6.1 Identity & Access (FR-IAM)
- **FR-IAM-1 (M):** A user registers/authenticates via Supabase Auth (email/password and
  phone OTP per provider capability). (See [ADR-0003](../adr/0003-supabase-auth.md).)
- **FR-IAM-2 (M):** One user can hold **multiple roles**; role assignment requires onboarding
  for that role (e.g., KYC for seller). (See [ADR-0004](../adr/0004-multi-role-workspaces.md).)
- **FR-IAM-3 (M):** A user has exactly one **personal workspace**; joining an organization
  grants a **separate workspace context** with its own role & permissions.
- **FR-IAM-4 (M):** Organization owners/admins can invite members with a role; invitations
  expire and are single-use.
- **FR-IAM-5 (M):** Permissions are **explicit grants**; absence of grant means deny.
- **FR-IAM-6 (M):** All protected API and DB operations validate **both** authentication and
  authorization (RLS + application layer defense in depth).
- **FR-IAM-7 (S):** Session revocation on role removal, org removal, or KYC suspension.
- **FR-IAM-8 (S):** Self-service account export and deletion request (soft-delete then purge
  per retention policy), respecting legal holds.

### 6.2 Profile & KYC (FR-PRO)
- **FR-PRO-1 (M):** Users maintain profile: name, locale, timezone (default Asia/Kolkata),
  contact.
- **FR-PRO-2 (M):** Sellers (Farmer selling, Retailer, Equipment Owner, Warehouse,
  Transporter) require **KYC verification** before they can transact.
- **FR-PRO-3 (M):** Identity documents are stored in a **private** bucket; access only via
  short-lived signed URLs; never publicly addressable.
- **FR-PRO-4 (M):** KYC states: `pending → in_review → verified | rejected → (resubmit)`.
  Only `verified` releases transactional permissions.
- **FR-PRO-5 (S):** Organization profiles (legal name, GSTIN, PAN) with their own KYC.

### 6.3 Catalog & Listings (FR-CAT)
- **FR-CAT-1 (M):** Sellers create listings with category, quantity (decimal + unit),
  price (decimal INR), location, availability window, optional media.
- **FR-CAT-2 (M):** Units use a controlled list (kg, quintal, tonne, litre, unit, acre, hour,
  day) with canonical conversion for sorting/comparison.
- **FR-CAT-3 (M):** Listings have lifecycle: `draft → active → paused → sold_out → expired →
  archived`. Only `active` is publicly discoverable.
- **FR-CAT-4 (S):** Search & filter by category, location radius, price range, quantity,
  availability. Pagination mandatory.

### 6.4 Orders & Payments (FR-ORD)
- **FR-ORD-1 (M):** A Buyer places an order against a listing; order line items snapshot
  price/quantity/unit **at time of order** (immutable snapshot).
- **FR-ORD-2 (M):** Orders have lifecycle: `draft → placed → confirmed → in_fulfilment →
  fulfilled → cancelled | disputed`.
- **FR-ORD-3 (M):** **Duplicate prevention:** idempotency key on order creation and on
  payment capture; DB unique constraints prevent double records.
- **FR-ORD-4 (M):** Payments are processed only through a **PaymentProvider adapter**;
  domain logic never calls a vendor SDK directly. Money is `NUMERIC(14,2)` minor-unit safe.
- **FR-ORD-5 (M):** A payment is recorded at most once per provider reference
  (unique constraint on `provider_reference`).
- **FR-ORD-6 (S):** Order history & invoice view per participant.
- **FR-ORD-7 (C):** Cancellation with policy-based refunds (policy definition → open Q).

### 6.5 Labour (FR-LAB)
- **FR-LAB-1 (M):** Employers post jobs (task, location, start/end, wage, workers needed).
- **FR-LAB-2 (M):** Workers apply; employer accepts; an **engagement** is created at most once
  per (job, worker) at a time (unique constraint).
- **FR-LAB-3 (S):** Workers maintain availability, skills, and reputation.

### 6.6 Equipment (FR-EQP)
- **FR-EQP-1 (M):** Owners publish equipment with rates, location, availability calendar.
- **FR-EQP-2 (M):** Bookings prevent **overlapping** bookings for the same equipment
  (exclusion constraint / transactional check).
- **FR-EQP-3 (S):** Booking lifecycle & owner approval.

*(Logistics FR-LOG and Storage FR-STO mirror the pattern: publish capacity → request →
accept → fulfil, each idempotent and non-duplicating. Fully specified when their phase starts.)*

### 6.7 Content (FR-CON)
- **FR-CON-1 (S):** Creators publish articles (rich text sanitized server-side) and video
  links; content requires moderation before public.
- **FR-CON-2 (S):** Content is categorized and multilingual-aware.

### 6.8 Notifications (FR-NOT)
- **FR-NOT-1 (M):** In-app notifications always; SMS/email via Notifier adapter.
- **FR-NOT-2 (S):** Per-user channel preferences and locale.

### 6.9 Admin & Ops (FR-ADM)
- **FR-ADM-1 (M):** Separate admin interface with its own build & route namespace.
- **FR-ADM-2 (M):** Staff roles: Support, Moderator, KYC Reviewer, Finance, Admin,
  Super Admin. All admin actions are audit-logged.
- **FR-ADM-3 (M):** KYC review queue, content moderation queue, order dispute handling.
- **FR-ADM-4 (S):** Read-only analytics dashboards (aggregate, no PII leakage).

### 6.10 Audit & Compliance (FR-AUD)
- **FR-AUD-1 (M):** Append-only audit log of security-relevant actions (login, role change,
  KYC decision, payment state change, admin action) with actor, action, target, timestamp
  (UTC), IP, correlation id. **No sensitive payloads** (no passwords, tokens, full doc numbers).
- **FR-AUD-2 (M):** Consent capture for data processing; export/delete workflows.
- **FR-AUD-3 (M):** PII minimization in API responses & logs.

## 7. Role → Domain Interaction (summary)

| Domain | Farmer | Buyer | Retailer | Worker | Equip Owner | Transporter | Warehouse | Creator |
|--------|:------:|:-----:|:--------:|:------:|:-----------:|:-----------:|:---------:|:-------:|
| Listings (sell) | ✔ | — | ✔ | — | ✔ | ✔(capacity) | ✔(storage) | — |
| Browse / buy | ✔ | ✔ | ✔ | — | — | — | — | ✔(read) |
| Labour (post) | ✔ | — | ✔ | — | — | — | — | — |
| Labour (work) | — | — | — | ✔ | — | — | — | — |
| Equipment (own) | — | — | — | — | ✔ | — | — | — |
| Logistics | (request) | (request) | (request) | — | — | ✔ | — | — |
| Storage | (request) | (request) | ✔ | — | — | — | ✔ | — |
| Content publish | — | — | — | — | — | — | — | ✔ |

*Full permission mapping:* [Account & Permission Matrix](02-account-permission-matrix.md).

## 8. Non-Functional Requirements

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-1 | Scale | Registered users | 10M+ design target |
| NFR-2 | Performance | API p95 latency (read) | < 300 ms at target load |
| NFR-3 | Performance | API p95 latency (write) | < 500 ms |
| NFR-4 | Availability | Monthly availability | 99.9% |
| NFR-5 | Security | AuthN/AuthZ on every protected op | 100% (no exceptions) |
| NFR-6 | Privacy | PII in logs | Zero |
| NFR-7 | Accessibility | WCAG | 2.1 AA |
| NFR-8 | i18n | Languages at launch | English + Hindi (extensible) |
| NFR-9 | Mobile | First-class mobile web | < 400 KB critical JS (budget) |
| NFR-10 | Observability | Structured logs + correlation id + error tracking | 100% of requests |
| NFR-11 | Data integrity | Money/quantity decimals | `NUMERIC`, never float |
| NFR-12 | Recoverability | RPO / RTO | RPO ≤ 15 min, RTO ≤ 2 h |
| NFR-13 | Compliance | India DPDP Act 2023 alignment | Design-compliant (see A-09) |

## 9. Constraints & Assumptions (summary)

Constraints: PostgreSQL via Supabase; Supabase Auth; FastAPI; React/Vite; modular monolith;
monorepo. All unresolved assumptions are in [OPEN-QUESTIONS.md](../OPEN-QUESTIONS.md) —
**nothing ambiguous will be implemented without an accepted assumption.**

## 10. Phase Scope Summary

| Phase | Theme | In scope |
|-------|-------|----------|
| 0 | Documentation | This document set |
| 1 | Foundation | Monorepo scaffold, tooling, CI, DB baseline, Auth + IAM skeleton, audit log, health |
| 2 | Identity depth | Profiles, KYC, organizations, invitations, admin skeleton |
| 3 | Catalog | Produce/input catalog & listings, media, search |
| 4 | Orders & Payments | Orders, payment adapter, invoices, idempotency |
| 5 | Labour & Equipment | Job/application/engagement, equipment booking |
| 6 | Logistics & Storage | Transport & warehouse flows |
| 7 | Content & polish | Content, notifications expansion, analytics |

Full detail: [ROADMAP.md](../ROADMAP.md).

## 11. Risks (product-level)

- **R1** Rural connectivity ⇒ must keep payloads small and degrade gracefully (A-05).
- **R2** Payment/duplicate order fraud ⇒ mandate idempotency + DB uniqueness (built-in).
- **R3** Multi-role permission leakage ⇒ workspace-scoped RLS + tests per role.
- **R4** Regulatory (DPDP) ⇒ consent & PII minimization from day one.
- **R5** Scope creep across 8 domains ⇒ strict per-phase boundaries (this doc §10).
- **R6** KYC verification provider not chosen ⇒ adapter interface + manual admin review fallback.

## 12. Acceptance Criteria for Phase 0

- [x] All eleven deliverables present (see [docs/README.md](../README.md)).
- [x] Every requirement traceable to a phase in the roadmap.
- [x] Every ambiguous point logged in [OPEN-QUESTIONS.md](../OPEN-QUESTIONS.md) with an assumption.
- [x] ADRs recorded for significant decisions.
- [x] **No application code written** (phase boundary respected).
