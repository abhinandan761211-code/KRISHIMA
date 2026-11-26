# ADR-0008: Two-Layer Authorization (Application + Row-Level Security)

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** Security Engineer, Principal Architect
- **Related:** [Permission Matrix](../product/02-account-permission-matrix.md) §6 · [Threat Model](../security/01-threat-model.md) TM-05, TM-06, TM-12

## Context

With multi-role, multi-workspace data (ADR-0004) and 10M+ users, authorization mistakes are the
single largest data-leak risk (IDOR / cross-workspace reads). A single enforcement layer is
insufficient:
- App-only checks are easy to forget on a new endpoint → silent IDOR.
- DB-only (RLS) checks give poor, opaque errors and can't express complex business rules
  (state machines, KYC gates) cleanly, nor produce good API semantics.

## Decision

Enforce authorization in **two independent layers** (defense in depth):

1. **Application layer (primary semantics):**
   - Authenticate JWT → resolve `Principal`.
   - Resolve active workspace from `X-Workspace-Id` + membership check.
   - Check the required **permission** (deny-by-default) → clean `403`.
   - Enforce **resource-level rules** (ownership, state-machine transitions, KYC gates) in the
     domain/application layer.
2. **Database layer (backstop):**
   - RLS **enabled on every tenant/personal table**.
   - Per-request session sets `app.current_user_id` and `app.current_workspace_id` (validated UUIDs,
     parameterized).
   - Policies filter rows to the active workspace (plus public-visibility predicates, e.g.
     `status='active'`) and grant staff access via `app.is_staff()`.
   - The API runtime DB role is **least-privilege** (no `BYPASSRLS`, no DDL). The service-role/owner
     connection is used **only** by migrations, audited admin jobs, and the audit writer.

**Both layers are mandatory.** A bug in one must be caught by the other.

## Consequences

**Positive**
- A forgotten app check does not automatically leak data (RLS still filters).
- A misconfigured RLS policy does not automatically grant access (app check still denies).
- Region/tenant isolation becomes inherent to the data model (workspace_id everywhere).
- Cross-workspace leak tests become a concrete CI gate.

**Negative / risks**
- Complexity: two places to reason about; need consistent setting of session GUCs.
- RLS performance overhead on large tables (must index `workspace_id`, test query plans).
- Service-role usage is a bypass — misuse defeats RLS (TM-08). Must be tightly scoped.
- Policies in raw SQL → require careful review (ADR-0006).

**Mitigations**
- Middleware/dependency always sets session GUCs before queries (no exceptions, tested).
- Code review + security sign-off for any use of the service-role connection.
- CI: mandate that every new tenant table has RLS + a leak test; fail build otherwise.
- Benchmarks for RLS-affected query plans at scale; composite indexes `(workspace_id, ...)`.

## Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| App-layer only | One missed check → silent IDOR at scale |
| RLS only | Poor API semantics, can't express state machines/KYC cleanly, harder to debug |
| Separate schema per tenant | Heavy at 10M users; RLS + workspace_id is simpler and proven |
| External policy engine now | Premature; interfaces allow adding later (ADR-0004 revisit) |

## Revisit Trigger

If RLS overhead becomes a measured bottleneck, or a policy engine is adopted, revisit — but the
**two-layer principle stays** (never a single enforcement point for tenant data).
