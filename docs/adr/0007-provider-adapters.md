# ADR-0007: Adapter Pattern for External Providers

- **Status:** Accepted
- **Date:** 2026-11-25
- **Deciders:** Principal Architect, Backend Lead
- **Related:** [System Design](../architecture/01-system-design.md) §11 · [Threat Model](../security/01-threat-model.md) TM-24

## Context

KRISHIMA depends on third-party services whose vendors are not yet chosen and may change:
payments, SMS/OTP, geocoding/address, object storage, error tracking, and later search and KYC
providers. Hard-coding a vendor SDK into domain logic causes:
- lock-in and painful migration,
- vendor calls inside business rules (untestable, non-deterministic),
- secret handling scattered across the codebase,
- accidental "fake success" (mocked vendor) leaking into production behavior.

## Decision

All external providers sit behind **explicit adapter interfaces** in `adapters/`:

```
adapters/<provider_type>/
  interface.py     # Protocol/ABC: the only thing domain & application code may import
  noop.py          # Honest default: raises ProviderNotConfigured (no fake success)
  <vendor>.py      # Real implementation (added when vendor chosen)
```
- Domain/application layers depend **only** on the interface type, injected at the composition
  root (wiring in `main.py`/container).
- Selection via environment (`PAYMENT_PROVIDER=noop|razorpay`, etc.) documented in `.env.example`.
- Adapters own: credentials usage, timeouts, retries, response schema validation, error mapping
  into our taxonomy, and **webhook signature verification** where applicable.
- **`noop` adapters are honest**: they raise "not configured" — they never return fabricated
  success. This preserves the "no fake working functionality" rule.

## Consequences

**Positive**
- Vendor is replaceable with a single new file + env change; no domain rewrite.
- Domain logic is testable with a fake/in-memory adapter (no network).
- Security surface centralized (secrets used in one place).
- Honest behavior in unconfigured environments.

**Negative / risks**
- Interfaces may not perfectly cover every vendor's capabilities (lowest-common-denominator risk).
- Extra indirection for simple providers.
- Misconfiguration (e.g., forgetting to set a real provider) surfaces at call time.

**Mitigations**
- Keep interfaces minimal but extensible; add capability methods when genuinely needed.
- Boot-time validation warns when a non-`noop` provider is expected in staging/prod.
- Contract tests per adapter verify interface compliance.

## Alternatives Considered

| Alternative | Why rejected |
|-------------|-------------|
| Call SDKs directly in services | Lock-in, untestable, secret sprawl, fake-success risk |
| Generic "integration service" god-module | Loses type safety and per-provider clarity |
| Vendor-specific domain code branches | Couples domain to vendors; violates inward-dependency rule |

## Revisit Trigger

If a provider introduces capabilities the interface cannot express without vendor leakage, extend
the interface (or add a capability-specific port) via a new ADR rather than importing the SDK into
domain code.
