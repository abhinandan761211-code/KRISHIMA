# KRISHIMA — Definition of Done (DoD)

- **Version:** 1.0 (Phase 0)
- **Owner:** Principal Architect / QA
- **Status:** Binding
- **Companions:** [Roadmap](ROADMAP.md) · [API Standards](standards/02-api-design-standards.md) · [Threat Model](security/01-threat-model.md) · [Design System](design/01-design-system-spec.md)

> A feature is **not done** unless its required UI, API, database, authorization, business logic,
> and tests are working. No exceptions, no "will add tests later".

---

## 1. Task-Level DoD (applies to every PR)

### Functionality
- [ ] Implements exactly the scoped requirement (no unrelated changes).
- [ ] No fake working functionality; incomplete parts are visibly disabled/labelled.
- [ ] Errors are surfaced, never silently swallowed.

### Code quality
- [ ] Strong typing (`mypy`/`tsc` clean, no `any` escapes without justification).
- [ ] No duplicated implementations; reuses existing modules/components.
- [ ] Functions focused; no unnecessary abstractions.
- [ ] Naming follows [Repository Standards](standards/01-repository-structure.md).
- [ ] Dependencies pinned; lockfile updated; no unreviewed new deps.

### Database
- [ ] Migration written (Alembic) — forward-only, reviewed; destructive changes explicitly approved.
- [ ] Constraints encode invariants (FK, UQ, CK, exclusion where applicable).
- [ ] Indexes on FKs and hot filters; decimals for money/quantity; UTC timestamps.
- [ ] RLS enabled + policies for new tenant tables.

### API
- [ ] Meets every item in [API Standards §13 checklist](standards/02-api-design-standards.md).
- [ ] AuthN + explicit authz (deny-by-default) + workspace scope (app + RLS).
- [ ] OpenAPI updated; typed client regenerated where consumed.
- [ ] Idempotency-Key enforced for money/booking endpoints.

### Security
- [ ] No secrets/PII in code, logs, audit payloads, or responses.
- [ ] Input validation on all inputs; output whitelists prevent PII leaks.
- [ ] New threats considered against [Threat Model](security/01-threat-model.md); log + mitigate.
- [ ] Sensitive mutations write an audit entry.

### Frontend (if applicable)
- [ ] Uses design tokens & shared components (no raw hex, no one-off primitives).
- [ ] Responsive `sm→xl`, mobile-first.
- [ ] All six states implemented: loading (skeleton), empty, error(+retry), success, disabled, permission-limited.
- [ ] Keyboard operable, focus visible; axe: no critical violations.
- [ ] All strings localized (en-IN, hi-IN); no hardcoded copy.

### Tests
- [ ] Unit tests for domain logic & validation.
- [ ] Integration test for API + DB happy path.
- [ ] Negative tests: authz-denied, validation error, conflict/state error.
- [ ] Cross-workspace leak test for any tenant table touched.
- [ ] Idempotency/duplicate test for money/booking paths.
- [ ] Frontend: component test (Vitest) for non-trivial UI; Playwright e2e for critical flows.

### Docs
- [ ] Relevant docs updated (PRD/ERD/API/matrix) in the same PR.
- [ ] New significant decision → ADR.
- [ ] New env var → documented in `.env.example`.

### Verification
- [ ] Lint clean, typecheck clean, build succeeds, all tests pass — **results reported, not assumed**.
- [ ] For UI work: verified in a real browser (headless screenshot/DOM check), not just "compiles".

---

## 2. Phase-Level DoD

A phase is complete only when **all** apply:

1. All task-level DoD items satisfied across the phase's PRs.
2. Acceptance criteria in [Roadmap](ROADMAP.md) for that phase met and demonstrated.
3. Authz matrix tests pass for every new role × permission cell (positive + negative).
4. RLS cross-workspace leak tests pass on CI.
5. No PII/secrets in logs (automated scan) ; secret scan clean.
6. Migrations apply cleanly to a fresh DB; no destructive change without approval.
7. CI pipeline green (lint, typecheck, unit, integration, build, e2e where applicable).
8. Documentation updated; ADRs recorded; open questions updated.
9. A written phase report: what shipped, actual test results, known limitations, deferred items,
   and explicit confirmation that no out-of-scope work was done.

---

## 3. Explicit "Not Done" Signals (red flags)

Any of these means the work is **not** complete:
- "It compiles" without a passing test or browser verification.
- Endpoint exists but lacks authz or writes no audit entry.
- UI renders but has no loading/empty/error states.
- Table created with no RLS or no constraints.
- Tests asserted against mocked DB that hide real RLS/schema issues.
- Fake data or stubbed success in place of real integration (unless it's the documented `noop`
  adapter that fails loudly).
- Untranslated hardcoded strings.

---

## 4. Testing Matrix (which tests are required where)

| Layer | Tool | Required for |
|-------|------|--------------|
| Domain logic | Pytest (unit) | Every business rule/state machine |
| API integration | Pytest + test DB | Every endpoint (happy + negative) |
| RLS / isolation | Pytest (direct SQL) | Every tenant table |
| Idempotency | Pytest | Money/booking endpoints |
| Frontend components | Vitest + Testing Library | Non-trivial UI |
| Frontend flows | Playwright | Auth, core journeys, permission gates |
| Accessibility | axe (Playwright) | Every page in a phase |
| Security | gitleaks, pip-audit, npm audit | CI every PR |

---

## 5. Review & Sign-off

- PR requires: 1 code review + security sign-off (for authz/RLS/payment/upload changes).
- Phase requires: architect review of the phase report before next phase begins.
- Production migration requires: explicit human approval + rollback plan documented.
