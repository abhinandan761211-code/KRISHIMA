# ADR-0001: Domain-based Modular Monolith over Microservices

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** Principal Architect, Backend Lead
- **Related:** [System Design](../architecture/01-system-design.md) §1–3

## Context

KRISHIMA spans eight participant types and many domains (identity, catalog, orders, payments,
labour, equipment, logistics, storage, content, admin). The long-term target is 10M+ users.
We must choose an initial deployment architecture that:
- ships quickly with a small team,
- enforces clear module boundaries,
- scales incrementally **without a rewrite**,
- avoids premature operational complexity (many services, distributed transactions).

## Decision

Build a **single FastAPI deployable** organized as a **domain-based modular monolith**:

- Each domain is a package with explicit public interface (`router`, contracts, service functions).
- Strict layered architecture: API → Application → Domain → Infrastructure; dependencies point inward.
- Cross-module access only via exported service interfaces/contracts, never another module's ORM
  models or repositories (enforced by import-linter in CI).
- The app is **stateless**; all scaling is horizontal behind a load balancer.
- Background work uses a transactional outbox (ADR-0005) behind a seam that can later become a
  dedicated worker/queue **without domain-code change**.

## Consequences

**Positive**
- One deployment, one database, one transaction boundary → simple, fast, correct by default.
- Module boundaries are real (enforced), so a domain can be extracted into a service later if a
  genuine scaling need arises — the seam already exists.
- No distributed-transaction complexity now.

**Negative / risks**
- A single deployable is a single failure/blast-radius unit until we scale replicas.
- Discipline required: boundary rules must be enforced by tooling, or the monolith rots into a
  big ball of mud.
- Independent per-domain deploy cadence is not available (acceptable at this stage).

**Mitigations**
- import-linter contracts in CI.
- Module public-interface convention.
- Explicit rule: no cross-module ORM imports.

## Alternatives Considered

| Alternative | Why rejected (for now) |
|-------------|------------------------|
| Microservices per domain | Operational + distributed-transaction overhead not justified pre-scale; slows delivery |
| Layered monolith without domain modules | Hard to reason about; tends toward coupling; harder to extract later |
| Serverless functions per endpoint | Cold starts hurt rural/low-latency needs; harder local dev & transactions |

## Revisit Trigger

Extract a domain into a separate service only if: (a) it needs independent scaling by an order of
magnitude, or (b) a separate team owns it with a conflicting release cadence — documented via a
new ADR.
