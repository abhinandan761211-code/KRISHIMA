# ADR-0002: UUIDv7 Primary Keys

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** Database Architect, Backend Lead
- **Related:** [Database ER](../architecture/02-database-er-diagram.md) §1

## Context

We need primary keys that:
- do not leak record counts or enable trivial enumeration (security),
- work well for distributed generation and client-side idempotency,
- keep B-tree index locality good under high insert volume (10M+ users),
- are stable across services and environments.

Random UUIDv4 gives poor index locality (random inserts → page splits, bloat). Auto-increment
integers leak volume and complicate merging/sharding.

## Decision

Use **UUIDv7** (time-ordered UUIDs) as primary keys for all business tables, generated in the
application (and available as a DB function `gen_uuid_v7()` for SQL-side defaults).

- `id uuid primary key default gen_uuid_v7()`.
- UUIDv7 encodes a 48-bit Unix-ms timestamp + randomness → sortable by creation time, good index
  locality, still unguessable.
- External references always use the UUID; no sequential business identifiers exposed except
  human-facing reference numbers (e.g., `order_no`) which are separate, non-authoritative fields.

## Consequences

**Positive**
- Good insert locality vs UUIDv4 → less index bloat at scale.
- Non-enumerable, safe to expose in URLs (still enforce authz — see ADR-0008).
- Natural time-ordering aids cursor pagination and partitioning by `created_at`.

**Negative / risks**
- 16-byte keys vs 8-byte bigint → slightly larger indexes/storage.
- UUIDv7 reveals coarse creation time (millisecond) — acceptable; no sensitive ordering leaked.
- Library support: use a maintained UUIDv7 implementation; document the version (Phase 1).

**Mitigations**
- Keep hot join columns narrow where practical; rely on indexes + partitioning at scale.
- Do not treat UUID as a security control — authorization is enforced separately.

## Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| bigint identity | Enumerable, leaks volume, awkward for distributed/offline generation |
| UUIDv4 | Random insert locality hurts at scale |
| ULID (text) | Larger text storage vs binary uuid; uuidv7 gives same ordering in native type |
| Composite natural keys | Unstable, verbose, hard to evolve |

## Revisit Trigger

Only if storage/index size becomes a proven bottleneck and partitioning cannot compensate —
would require a new ADR (unlikely given partitioning plan).
