# KRISHIMA — Account & Permission Matrix

- **Version:** 1.0 (Phase 0)
- **Owner:** Security Engineer / Principal Architect
- **Status:** Proposed (drives Phase 1–2 implementation)
- **Companions:** [PRD](01-product-requirements.md) · [System Design](../architecture/01-system-design.md) · [Threat Model](../security/01-threat-model.md) · [ADR-0004](../adr/0004-multi-role-workspaces.md)

---

## 1. Core Concepts

```
User (identity, from Supabase Auth)
  │ 1..n
  ├── RoleAssignment   (role, scope)        ← "what can this user do, and where"
  │       scope ∈ {personal, organization:<org_id>, platform}
  │
  └── Workspace (derived)                    ← the active context the UI operates in
          ├── personal workspace (one per user)
          └── organization workspace (one per org membership)
```

**Definitions**

| Term | Meaning |
|------|---------|
| **User** | A single authenticated identity (`auth.users` in Supabase → mirrored in `app.users`). |
| **Role** | A named bundle of permissions: `farmer`, `buyer`, `retailer`, `worker`, `equipment_owner`, `transporter`, `warehouse`, `content_creator` (marketplace); `support_agent`, `moderator`, `kyc_reviewer`, `finance`, `admin`, `super_admin` (staff). |
| **Workspace** | An isolated data context. Personal = the user as an individual; Organization = the user acting on behalf of an org. Data is **scoped** and never bleeds across workspaces. |
| **Organization** | A legal or operational entity (farm company, retail chain, fleet, warehouse operator) with its own members and org-level KYC. |
| **Membership** | A user's link to an organization, carrying one or more roles **within that org**. |
| **Permission** | Atomic capability `domain.action` (e.g., `listing.create`). |
| **Scope** | Where a role assignment applies. Personal role → personal workspace only. Org role → that org only. Platform role → admin console. |

**Hard rule (deny-by-default):** a request is permitted only if an **explicit** permission
grant exists for the **active workspace** (or a platform role grants it). Anything else is
`403`, and at the DB it is `403`/empty result via RLS.

---

## 2. Roles and Role Assignment Rules

### 2.1 Marketplace roles — onboarding requirements

| Role | Auto-granted on signup | Requires KYC to transact | Requires KYC to be *visible* in search | Notes |
|------|:----------------------:|:------------------------:|:--------------------------------------:|-------|
| Farmer | ✔ (buying side) | Only to **sell/lease** | Only when selling | Can buy inputs immediately |
| Buyer | ✔ | No | n/a | Can browse immediately |
| Retailer | ✘ (opt-in) | Yes (GSTIN/PAN) | Yes | Business identity |
| Worker | ✘ (opt-in) | No (phone-verified) | No | Reputation gated |
| Equipment Owner | ✘ (opt-in) | Yes | Yes | Can list equipment |
| Transporter | ✘ (opt-in) | Yes (vehicle + operator docs) | Yes | Can accept transport |
| Warehouse | ✘ (opt-in) | Yes (facility docs) | Yes | Can list capacity |
| Content Creator | ✘ (opt-in) | No (profile-complete) | No | Moderation gated |

*Assumption A-01/A-02 (see OPEN-QUESTIONS): which roles are auto-granted is configurable;
defaults above.*

### 2.2 Staff roles — admin console only

| Role | Description |
|------|-------------|
| `support_agent` | Read-only user/order assist, raise escalations. |
| `moderator` | Content & listing moderation. |
| `kyc_reviewer` | Approve/reject KYC, view private docs (logged). |
| `finance` | View payments/invoices, trigger refunds (with approval). |
| `admin` | Manage staff, configuration, most moderation. |
| `super_admin` | All admin + security configs + staff role assignment. **Break-glass.** |

Staff roles are **platform-scoped**, never granted to marketplace users, and every action
writes an audit entry.

### 2.3 Rules
- **R1** A user may hold **any number** of marketplace roles simultaneously.
- **R2** Marketplace roles and staff roles are **mutually exclusive**.
- **R3** An organization role exists **only** within a membership; losing membership removes it.
- **R4** Only `super_admin` may assign/revoke staff roles; only org `owner`/`admin` may
  assign org roles (cannot grant a role with more permission than their own).
- **R5** KYC suspension instantly revokes transactional permissions for that role.

---

## 3. Permission Catalog (atomic)

Format `domain.action`. These are the only grantable permissions. *(`*` = all actions in domain.)*

### Identity & Account
`profile.read.self` · `profile.update.self` · `profile.read.org` · `profile.update.org`
`member.invite` · `member.remove` · `member.role.assign` · `member.read`
`workspace.switch` · `org.create` · `org.update` · `org.delete`

### KYC
`kyc.submit` · `kyc.read.self` · `kyc.read.all` · `kyc.decide` · `kyc.document.view`

### Catalog & Listings
`listing.create` · `listing.update.own` · `listing.update.any` · `listing.delete.own` ·
`listing.pause.own` · `listing.read.public` · `listing.read.any` · `listing.moderate`

### Orders & Payments
`order.create` · `order.read.own` · `order.read.org` · `order.read.any` ·
`order.cancel.own` · `order.update.status` · `payment.initiate` · `payment.read.own` ·
`payment.read.any` · `payment.refund` · `invoice.read.own`

### Labour
`job.create` · `job.read.own` · `job.read.public` · `job.apply` · `application.read.own` ·
`application.decide` (employer accept/reject) · `engagement.read.own` · `engagement.confirm`

### Equipment
`equipment.create` · `equipment.update.own` · `equipment.read.public` ·
`booking.request` · `booking.decide` (owner) · `booking.read.own` · `booking.cancel.own`

### Logistics
`transport.request` · `transport.accept` (transporter) · `shipment.read.own` ·
`shipment.update.status`

### Storage
`warehouse.create` · `warehouse.update.own` · `storage.request` · `storage.accept` ·
`storage.read.own`

### Content
`content.draft` · `content.publish.own` · `content.read.public` · `content.moderate`

### Notifications
`notification.read.own` · `notification.settings.update`

### Administration / Platform
`user.read.any` · `user.suspend` · `staff.role.assign` · `config.update` ·
`audit.read` · `dispute.read` · `dispute.decide` · `analytics.read`

---

## 4. Role → Permission Matrix

✔ = granted. Blank = denied. All grants are **workspace-scoped** except staff.

| Permission | Farmer | Buyer | Retailer | Worker | Equip Owner | Transporter | Warehouse | Creator | Support | Moderator | KYC Rev | Finance | Admin | Super |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| profile.read/update.self | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| profile.read/update.org | ✔¹ | — | ✔¹ | — | ✔¹ | ✔¹ | ✔¹ | — | — | — | — | — | ✔ | ✔ |
| org.create | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — | — | — | — | — |
| member.invite/remove/role.assign | ✔¹ | — | ✔¹ | — | ✔¹ | ✔¹ | ✔¹ | — | — | — | — | — | ✔ | ✔ |
| kyc.submit / read.self | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — | — | — | ✔ | ✔ |
| kyc.read.all / decide / document.view | — | — | — | — | — | — | — | — | — | — | ✔ | — | ✔ | ✔ |
| listing.create / update.own | ✔² | — | ✔² | — | ✔² | ✔² | ✔² | — | — | — | — | — | — | — |
| listing.read.public | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| listing.moderate | — | — | — | — | — | — | — | — | — | ✔ | — | — | ✔ | ✔ |
| order.create | ✔ | ✔ | ✔ | — | — | — | — | — | — | — | — | — | — | — |
| order.read.own / org | ✔ | ✔ | ✔ | — | — | — | — | — | ✔ | — | — | ✔ | ✔ | ✔ |
| order.update.status | ✔³ | ✔³ | ✔³ | — | ✔³ | ✔³ | ✔³ | — | — | — | — | — | ✔ | ✔ |
| payment.initiate / read.own | ✔ | ✔ | ✔ | — | — | — | — | — | — | — | — | — | — | — |
| payment.refund | — | — | — | — | — | — | — | — | — | — | — | ✔⁴ | ✔⁴ | ✔ |
| job.create | ✔ | — | ✔ | — | — | — | — | — | — | — | — | — | — | — |
| job.apply / application.read.own | — | — | — | ✔ | — | — | — | — | — | — | — | — | — | — |
| application.decide | ✔ | — | ✔ | — | — | — | — | — | — | — | — | — | — | — |
| equipment.create / update.own | — | — | — | — | ✔² | — | — | — | — | — | — | — | — | — |
| booking.request | ✔ | — | ✔ | — | — | — | — | — | — | — | — | — | — | — |
| booking.decide | — | — | — | — | ✔ | — | — | — | — | — | — | — | — | — |
| transport.request | ✔ | ✔ | ✔ | — | — | — | — | — | — | — | — | — | — | — |
| transport.accept | — | — | — | — | — | ✔ | — | — | — | — | — | — | — | — |
| warehouse.create / storage.accept | — | — | — | — | — | — | ✔² | — | — | — | — | — | — | — |
| storage.request | ✔ | ✔ | ✔ | — | — | — | — | — | — | — | — | — | — | — |
| content.draft / publish.own | — | — | — | — | — | — | — | ✔ | — | — | — | — | — | — |
| content.moderate | — | — | — | — | — | — | — | — | — | ✔ | — | — | ✔ | ✔ |
| notification.read.own | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| user.read.any / suspend | — | — | — | — | — | — | — | — | ✔⁵ | — | — | — | ✔ | ✔ |
| dispute.read / decide | — | — | — | — | — | — | — | — | ✔(read) | — | — | ✔(read) | ✔ | ✔ |
| audit.read | — | — | — | — | — | — | — | — | — | — | — | — | ✔ | ✔ |
| staff.role.assign / config.update | — | — | — | — | — | — | — | — | — | — | — | — | — | ✔ |
| analytics.read | — | — | — | — | — | — | — | — | — | — | — | ✔ | ✔ | ✔ |

**Footnotes**
1. Only within an organization where the member holds `owner`/`admin` org-role. Personal workspace has no members.
2. Gated by KYC `verified`.
3. Only for orders where the actor is a participant in the required lifecycle transition (state-machine enforced, not blanket).
4. Refund above a threshold requires a second approver (four-eyes) — see threat model TM-13.
5. Support is read-only + can trigger suspension **request** (not direct suspend); direct suspend is Admin+.
¹‑⁵ apply per-role workspace scope only.

---

## 5. Organization Roles (within a membership)

| Org role | Grants (relative to org workspace) |
|----------|-------------------------------------|
| `owner` | Everything an `admin` can + delete org, transfer ownership, billing |
| `admin` | `profile.update.org`, `member.*`, all org resource actions |
| `manager` | Operate org resources (orders, listings, bookings) — no member management |
| `staff` | Read + assigned operational actions (e.g., fulfil orders) |
| `viewer` | Read-only |

Clients call these **org roles**; they are distinct from marketplace roles and from staff roles.
A membership = `(org_id, user_id, org_role, marketplace_roles[])`.

---

## 6. Access-Control Enforcement Model (defense in depth)

```
Request → API middleware
  1. Authenticate: verify Supabase JWT (signature, exp, aud, iss) → user_id
  2. Resolve workspace: from path/header (`X-Workspace-Id`) + verify membership
  3. Authorize (app layer): permission check against RoleAssignment for that workspace
  4. Persist: SQLAlchemy session sets `app.current_user_id` + `app.current_workspace_id`
  5. Database RLS: policies re-check ownership/scope → row-level filter
  6. Resource-level: transition guards (state machines), ownership guards (own vs any)
```

- **Both layers are mandatory.** App-layer check gives a clean `403`; RLS is the last line of
  defense if the app layer has a bug (see [Threat Model](../security/01-threat-model.md) TM-06).
- **RLS is enabled on every table** in the `public`/`app` schema that holds tenant or personal data.
- **Service-role key** is used **only** for migrations, admin background jobs, and audit writes —
  never in request-path code that handles user input without an explicit documented reason.

### 6.1 Resource-level rules matrix

| Resource action | Rule |
|-----------------|------|
| `listing.update.own` | `listing.owner_workspace_id = active_workspace` |
| `order.read.own` | actor ∈ {buyer_workspace, seller_workspace} of that order |
| `order.update.status` | actor's role permits the **specific transition** from current state |
| `payment.refund` | funding state = captured; amount ≤ captured − refunded; approver ≠ initiator if > threshold |
| `application.decide` | actor owns the job's employer workspace |
| `booking.decide` | actor owns the equipment's owner workspace |
| `kyc.document.view` | staff KYC role **only**, and every view is audit-logged |
| `content.publish.own` | content.status = approved OR actor has `content.moderate` |

---

## 7. Invitation & Membership Lifecycle

```
owner/admin invites  → invitation(status=pending, token hash, expiry, single-use)
invitee accepts      → membership created (org_role + marketplace roles) → audit
role change          → old grants revoked atomically → sessions for lost perms re-validated
member removed       → membership deleted + role assignments for that org revoked + audit
```

- Invitations hashed in DB (never store raw token); expiry default 7 days (config).
- On any membership/role change, **permission caches are invalidated** (short TTL + event).

## 8. Test Requirements (drives Phase 2 DoD)

- For **every role × permission cell** marked ✔, a positive test; for **every blank cell**, a
  negative test asserting `403`/empty.
- Cross-workspace leak test: user in workspace A cannot read B's rows (API **and** direct DB
  query under RLS).
- Deny-by-default test: a request with no role assignment gets `403`.
- KYC gate test: unverified seller cannot `listing.create` (business rule + RLS).
- Elevation test: org `manager` cannot `member.role.assign`.
- Staff separation test: marketplace user cannot access `/admin/*`.

## 9. Open Items

- **Q1** Should a Farmer selling produce create an *org* workspace implicitly, or sell from the
  personal workspace? → **Assumption A-02:** sell from personal workspace by default; org
  optional. (Logged in OPEN-QUESTIONS.)
- **Q2** Refund four-eyes threshold value → **Assumption A-06:** ₹10,000; configurable.
- **Q3** Whether `content_creator` is monetizable (payouts) → deferred; no `payment.payout`
  permission exists yet, intentionally.
