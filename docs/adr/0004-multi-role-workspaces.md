# ADR-0004: Multi-Role Identity with Workspace Scoping

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** Principal Architect, Security Engineer
- **Related:** [Permission Matrix](../product/02-account-permission-matrix.md) · [Database ER](../architecture/02-database-er-diagram.md) §4.1

## Context

The product specifies one user identity that can hold multiple roles (farmer, buyer, retailer,
worker, equipment owner, transporter, warehouse, content creator), plus organization
memberships and configurable permissions. Naïve designs fail in predictable ways:
- a `role` column on `users` → cannot hold multiple roles,
- treating roles as separate accounts → duplicate identities, data fragmentation,
- a single global permission set → data leaks across "hats" a user wears.

## Decision

Model access as **role assignments scoped to a workspace**, with organizations as containers:

```
User ──< RoleAssignment(role, scope=personal | organization:<org>) 
User ──< OrganizationMember(org, org_role) ──< RoleAssignment(marketplace roles in that org)
```

- **Personal workspace:** every user has exactly one; holds personal-scope role assignments.
- **Organization workspace:** created per membership; holds org-scope role assignments and an
  org role (`owner/admin/manager/staff/viewer`).
- **Active workspace** is explicit per request (`X-Workspace-Id`), verified against membership.
- Every tenant-owned row carries `workspace_id` → all reads/writes are workspace-scoped (RLS).
- **Permissions** are atomic (`domain.action`), granted via role → permission mapping; deny by
  default.
- **Staff roles** are platform-scoped and mutually exclusive with marketplace roles.
- KYC status gates role capabilities (e.g., selling requires `verified`).

## Consequences

**Positive**
- One identity, many hats — no duplicate accounts; consistent reputation.
- Strong isolation: switching workspace changes the data context; cross-workspace access is a
  hard failure caught by tests.
- Organizations (agribusiness, retail chain, fleet) fit naturally with member roles.
- Maps cleanly to RLS via `app.current_workspace_id`.

**Negative / risks**
- More complex authorization than a single role column → more test surface (mitigated by the
  full matrix test suite).
- UX must clearly communicate the active workspace/role to avoid user confusion.
- Migration/backfill of role assignments must be careful if the model evolves.

**Mitigations**
- Full role × permission matrix tests (positive + negative) in Phase 2.
- Persistent, visible workspace switcher in the UI.
- Role assignment changes are audited; sessions re-evaluated.

## Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Single `role` per user | Cannot satisfy multi-role requirement |
| Separate account per role | Duplicate identities, poor UX, fragmented data |
| Global permissions without workspace scope | Cross-context data leakage |
| Attribute-based policy engine (OPA/Cedar) now | Premature complexity; revisit at scale if policy needs explode |

## Revisit Trigger

If permission rules become highly dynamic/data-dependent at scale, consider a policy engine — via
new ADR — behind the existing `authorize()` interface.
