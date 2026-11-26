# KRISHIMA — API Design Standards

- **Version:** 1.0 (Phase 0)
- **Owner:** Principal Architect / API Owner
- **Status:** Binding for all API work from Phase 1
- **Companions:** [System Design](../architecture/01-system-design.md) · [Permission Matrix](../product/02-account-permission-matrix.md)

---

## 1. Fundamentals

| Rule | Standard |
|------|----------|
| Style | REST, resource-oriented, JSON (`application/json; charset=utf-8`) |
| Versioning | URI path version: `/api/v1/...` (breaking changes → `/api/v2`) |
| Base URL | `{API_BASE_URL}/api/v1` |
| Docs | OpenAPI 3.1 auto-generated; `/api/v1/openapi.json`; `/docs` UI **disabled in prod** |
| IDs | UUIDv7 strings |
| Time | ISO-8601 UTC with `Z` (e.g. `2026-11-25T10:15:30Z`); client renders local TZ |
| Money | `{ "amount": "1250.00", "currency": "INR" }` — amount as **string** decimal (no float) |
| Quantity | `{ "value": "10.500", "unit": "quintal" }` |
| Casing | `snake_case` for JSON fields (matches DB/Python; consistent across all layers) |
| Nullability | Absent ≠ null. Optional fields omitted; nullable fields explicitly `null`. |
| Booleans | Prefixed `is_`/`has_` where natural (`is_verified`) |

---

## 2. Resource Naming

- Plural nouns: `/listings`, `/orders`, `/equipment-bookings`.
- Nested only for true ownership (max one level): `/orders/{order_id}/items`.
- Actions that aren't CRUD use a **sub-resource + POST**:
  `POST /orders/{id}/cancel`, `POST /bookings/{id}/confirm`, `POST /kyc/{id}/decide`.
  Avoid verbs on the collection.
- Filtering/search on collection via query params, never new endpoints.

---

## 3. HTTP Methods & Status Codes

| Method | Use | Success |
|--------|-----|---------|
| GET | read (safe, idempotent) | 200 |
| POST | create / action | 201 (created) or 200 (action) or 202 (async accepted) |
| PATCH | partial update | 200 |
| PUT | full replace (rare) | 200 |
| DELETE | remove (or soft-delete) | 204 |

Error codes: `400` validation, `401` unauthenticated, `403` forbidden (authz), `404` not found
(or hidden for authz), `409` conflict/state, `422` semantic validation (Pydantic), `429` rate
limited, `500` unexpected, `503` unavailable.

**Authz non-disclosure:** for resources the caller may not see, return `404` (not `403`) where
existence itself is sensitive (e.g., another workspace's order). Document per endpoint.

---

## 4. Standard Response Envelopes

### 4.1 Single resource
```json
{ "data": { "id": "0193...", "status": "active" } }
```

### 4.2 Collection (offset pagination)
```json
{
  "data": [ ... ],
  "meta": { "page": 1, "per_page": 20, "total": 143, "total_pages": 8 }
}
```
Query: `?page=1&per_page=20` (`per_page` max 100, default 20).

### 4.3 Cursor pagination (high-volume feeds)
```json
{ "data": [ ... ], "meta": { "next_cursor": "eyJpZCI6...", "has_more": true } }
```
Query: `?cursor=...&limit=20`. Cursor is opaque (base64 of sort key + id).

### 4.4 Error envelope (single shape everywhere)
```json
{
  "error": {
    "code": "validation_error",
    "message": "Request validation failed.",
    "details": [ { "field": "price_amount", "issue": "must be >= 0" } ],
    "request_id": "01J..."
  }
}
```
- `code` is a stable machine string (never localized, never changes). `message` is human,
  localizable by the client. `details` optional. `request_id` always present for support.
- **Never** include stack traces, SQL, internal paths, tokens, or PII in errors.

### 4.5 Error code catalog (extract)

| code | HTTP | Meaning |
|------|------|---------|
| `validation_error` | 422 | Schema/semantic validation |
| `unauthenticated` | 401 | Missing/invalid token |
| `forbidden` | 403 | Authz denied |
| `not_found` | 404 | Missing or hidden |
| `conflict` | 409 | State/unique conflict |
| `duplicate_request` | 409 | Idempotency key reused with different payload |
| `rate_limited` | 429 | Too many requests |
| `kyc_required` | 403 | Action needs verified KYC |
| `invalid_state_transition` | 409 | e.g., cancel a fulfilled order |
| `provider_unavailable` | 503 | Adapter upstream down |
| `internal_error` | 500 | Unexpected (logged with request_id) |

---

## 5. Authentication & Authorization Headers

| Header | Required | Notes |
|--------|----------|-------|
| `Authorization: Bearer <jwt>` | Protected routes | Supabase access token |
| `X-Workspace-Id: <uuid>` | When acting in a workspace | Must match a membership; else `403` |
| `X-Request-Id` | Optional (server generates) | Propagated in response + logs |
| `Idempotency-Key` | Mutating money/booking ops | See §7 |
| `Accept-Language` | Optional | `en-IN`, `hi-IN` — affects localized `message` only |

Authorization is **deny-by-default**: absence of an explicit permission grant → `403`. The
permission required is documented per endpoint in OpenAPI (`x-required-permission`).

---

## 6. Idempotency (mandatory for money & bookings)

- Client sends `Idempotency-Key` (UUID) on `POST` for: create order, initiate payment, capture,
  refund, create booking, storage request, transport request.
- Server: `idempotency_keys` table scoped by `(route, user_id, key)`.
  - Same key + same request hash → replay stored response (same status/body).
  - Same key + different request hash → `409 duplicate_request`.
  - No key on a required endpoint → `400`.
- Keys expire (default 24h).

---

## 7. Validation & Pydantic Conventions

- Request/response models are **separate** (`XxxCreate`, `XxxUpdate`, `XxxRead`).
- `XxxRead` explicitly whitelists fields — **never** serialize ORM objects directly (prevents PII
  leaks). PII fields are omitted unless the caller has the permission.
- Decimal fields typed as `Decimal` in Pydantic with `max_digits`/`decimal_places` set.
- Enums shared between DB and API via `packages/types` (TS) / Python enums (single source).
- Reject unknown fields on write schemas (`model_config = {"extra": "forbid"}`) — prevents mass
  assignment.

---

## 8. Pagination, Filtering, Sorting, Search

- Filters are explicit query params (`status=active&category_id=...`), whitelisted per endpoint.
- Sorting: `sort=-created_at,title` (`-` = desc); whitelisted sortable fields only.
- Search: `q=` with a documented min length; backed by SQL trigram initially, adapter later.
- Unbounded list endpoints are forbidden — pagination is required.

---

## 9. Rate Limiting

- Per-IP and per-user token bucket; defaults from env (`RATE_LIMIT_DEFAULT_PER_MINUTE`).
- Sensitive endpoints (auth, OTP, payment) get stricter limits.
- Response on limit: `429` + `Retry-After` header + `error.code = rate_limited`.

---

## 10. Versioning & Deprecation

- `/v1` stable; breaking change requires `/v2` (new base path, old kept during migration window).
- Additive changes (new optional fields, new endpoints) are non-breaking and allowed in `/v1`.
- Deprecation: mark endpoint `deprecated: true` in OpenAPI + `Deprecation`/`Sunset` headers,
  documented in a changelog; minimum one release cycle notice.

---

## 11. Admin API

- Namespace: `/api/v1/admin/*`.
- Same envelopes; **staff-role authorization only**; every mutating call writes an audit entry.
- Never reachable by marketplace tokens (separate authz check + RLS staff function).
- Read-heavy analytics endpoints are aggregate-only; no raw PII dumps.

---

## 12. Example Endpoints (contract illustration)

```
GET    /api/v1/me
GET    /api/v1/me/workspaces
POST   /api/v1/listings                 {listing create}
GET    /api/v1/listings?category_id=&q=&page=
POST   /api/v1/orders                    [Idempotency-Key]
GET    /api/v1/orders/{id}
POST   /api/v1/orders/{id}/cancel
POST   /api/v1/payments                  [Idempotency-Key]
POST   /api/v1/payments/webhook          [provider signature verified]
POST   /api/v1/equipment-bookings        [Idempotency-Key]
POST   /api/v1/equipment-bookings/{id}/confirm
GET    /api/v1/admin/kyc?status=in_review
POST   /api/v1/admin/kyc/{id}/decide
GET    /api/v1/health
GET    /api/v1/ready
```

---

## 13. Non-negotiables (checklist for every endpoint PR)

- [ ] AuthN + explicit permission check; deny-by-default.
- [ ] Workspace scope enforced (app + RLS).
- [ ] Request/response schemas separate; no ORM serialization; PII whitelisted.
- [ ] Validation errors use the standard envelope + `request_id`.
- [ ] Money/quantity as decimal strings; no float.
- [ ] Pagination on lists; bounded `per_page`.
- [ ] Idempotency-Key required where money/booking.
- [ ] OpenAPI updated; `x-required-permission` set.
- [ ] Rate-limit class assigned.
- [ ] Tests: happy path, authz-denied, validation, duplicate/idempotency, and RLS leak where relevant.
- [ ] Audit entry for sensitive mutations.
