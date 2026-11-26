# ADR-0005: Transactional Outbox for Background Processing

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** Principal Architect, Backend Lead
- **Related:** [System Design](../architecture/01-system-design.md) §7, §10 · [Database ER](../architecture/02-database-er-diagram.md) §4.10

## Context

Several flows emit side effects that should not block the request and must not be lost or
duplicated: notifications, payment reconciliation, KYC/document processing, search indexing.
Requirements: 10M+ users, incremental scaling, **no rewrite** when moving from in-process work
to a dedicated worker.

Naïve approaches:
- `BackgroundTasks` inline → lost on crash; no retry/DLQ.
- Publish to queue *after* commit → dual-write problem (DB committed, event lost).
- Publish *before* commit → event references uncommitted data (or data that rolls back).

## Decision

Adopt a **transactional outbox**:

- Business change and an `outbox_events` row are written in the **same DB transaction**.
- A **dispatcher** claims pending rows with `SELECT ... FOR UPDATE SKIP LOCKED`, executes
  registered handlers (idempotent), and marks them `done` / `failed` with backoff + `dead` (DLQ).
- Handlers live in a **registry** keyed by `event_type`; the dispatcher is a thin loop.
- **Phase 1–3:** dispatcher runs **in-process** (a supervised async task); acceptable because work
  is non-critical and the DB is the source of truth.
- **Phase 4+ / at scale:** move the **same dispatcher** into a dedicated worker container or a
  managed queue consumer. Domain code and handlers are unchanged — only the runner moves.

## Consequences

**Positive**
- At-least-once delivery with DB atomicity — no lost/phantom events.
- Handlers are idempotent by design → safe retries.
- Clear growth seam: in-process loop → dedicated worker, no domain rewrite.
- Works with a single Postgres; no extra infra needed initially (per requirement to avoid
  unnecessary infrastructure).

**Negative / risks**
- Handlers must be **idempotent** (dedupe by event id / business key) — a design discipline.
- Polling adds DB load; mitigate with index on `(status, available_at)` and batching; later cadence
  tuning or LISTEN/NOTIFY.
- Outbox table grows → retention/archival job needed (Phase ≥4).
- Ordering is best-effort per aggregate, not global.

**Mitigations**
- Idempotency keys on handlers; dedupe table where needed.
- Outbox retention policy + partition by `created_at` (partition-ready).
- Monitoring of outbox lag (Phase ≥4).

## Alternatives Considered

| Alternative | Why rejected (for now) |
|-------------|------------------------|
| Inline `BackgroundTasks` only | No durability/retry; lost on crash |
| Direct publish to Kafka/RabbitMQ/SQS sans outbox | Dual-write problem → lost or phantom events |
| CDC (Debezium) | Extra infrastructure/ops not justified yet; outbox is simpler and sufficient |
| Dedicated worker from day 1 | Unnecessary infra early; outbox keeps the option open |

## Revisit Trigger

When outbox lag or worker throughput becomes a bottleneck, or multiple consumers/streams are
needed → move dispatcher to dedicated queue consumer (new ADR for the specific queue).
