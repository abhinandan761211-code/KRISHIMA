# ADR-0010 — Public-page rendering: prerender at build time, keep the SPA

- **Status:** Proposed (awaiting owner approval — see §7)
- **Date:** 2026-11-26
- **Deciders:** Principal Architect, Frontend Lead
- **Related:** [ADR-0009](0009-root-level-repository-layout.md) · [Public Website Validation Report](../testing/PUBLIC_WEBSITE_VALIDATION_REPORT.md) §4

---

## Context

The public website is a client-rendered React SPA built with Vite. Per-route
`<title>`, description, Open Graph and canonical tags are written by a `useSeo`
hook at runtime, and `robots.txt` / `sitemap.xml` are generated at build time.

That works for users, but it has a known SEO limitation: a crawler that does not
execute JavaScript receives an empty `<div id="root">` — no headings, no copy, no
per-page metadata. Googlebot executes JS, but many social scrapers, some regional
search engines and most link-preview bots do not.

This ADR records the options, the recommendation, and — importantly — **what was
not done**, so the gap is a documented decision rather than an oversight.

## Options considered

### A. Keep client-side rendering only (status quo)

| | |
|---|---|
| Benefit | Zero new dependencies, zero build complexity, no framework change |
| Limitation | Non-JS crawlers see an empty shell; social previews depend on runtime tags |
| Cost | None |
| Verdict | Acceptable for a private/staging deployment, not for launch |

### B. Build-time prerendering of public routes

Render each public route to static HTML at build time and serve that HTML, then
hydrate the same React tree on the client.

| | |
|---|---|
| Benefit | Full HTML for every crawler; real per-page metadata; no server runtime |
| Limitation | Two render paths to keep working; needs a prerender step in the build; must stay in sync with `routes.tsx` |
| Compatibility | High — Vite already builds the SPA; the prerender step runs after it and reuses the same entry |
| Hosting | Unchanged (static hosting / CDN). No Node server required |
| Maintenance | Low–moderate: one build step, plus a test that asserts each route's HTML contains its `<h1>` |
| Cost | Days, not weeks |

### C. Server-side rendering (SSR)

| | |
|---|---|
| Benefit | Always-fresh HTML, per-request personalisation possible |
| Limitation | A Node server must run in production; hydration and data-loading complexity; auth/session concerns on every request |
| Compatibility | Would require reworking the entry point and the hosting model |
| Maintenance | High: server, caching, error handling, and a second failure surface |
| Cost | Weeks, and a permanent operational burden |

The public site is **entirely static content** — no per-user data, no personalisation,
no session-dependent output. SSR's main advantage (fresh, personalised HTML) buys
nothing here.

## Decision

**Adopt option B — build-time prerendering of the public routes — and keep React +
Vite.** Do not adopt SSR, and do not replace the framework.

Rationale:

1. The content is static, so rendering it once at build time is sufficient and
   removes the server entirely.
2. It is compatible with the existing architecture (no framework migration, no
   change to `routes.tsx`, `useSeo`, tokens or components).
3. It directly fixes the actual defect — non-JS crawlers seeing an empty shell —
   without paying SSR's operational cost.

## Implementation sketch (not implemented in this task)

1. Add a prerender step that runs **after** `vite build`, iterating
   `data/indexable-routes.ts` (already the single source of truth for the sitemap).
2. For each path, render the app to a string, inject it into `index.html`, and
   write `dist/<path>/index.html`.
3. Serve `dist/` as static files with a fallback to `index.html` for client-side
   navigation.
4. Add an e2e test asserting that the built HTML for each route contains a
   non-empty `<h1>` **without** executing JavaScript.

Constraints to respect:

- `packages/ui` and the design system must not change.
- `useSeo` remains the runtime source of metadata; prerendering must not create a
  second, divergent copy of titles/descriptions.
- No new runtime dependency in the shipped bundle.

## Consequences

**Positive**
- Every public route ships real HTML: headings, copy and metadata.
- Social previews work without JS.
- No production server, no new operational surface.
- The sitemap and the prerender list share one source of truth.

**Negative / accepted risks**
- A second render path exists; it must be covered by a test or it will silently
  rot. The e2e "HTML contains an `<h1>` without JS" test is mandatory.
- Build time increases slightly (one extra render pass per public route).
- Anything that depends on `window` at module scope must be guarded — the same
  constraint SSR has, but scoped to build time.

## What this ADR does NOT authorise

- Replacing React or Vite.
- Introducing a meta-framework.
- Any SSR server in production.
- Implementation within the current (foundation stabilization) task.

## Status of the gap today

Prerendering is **not implemented**. Until it is:

- `robots.txt` is generated per environment and disallows crawling when no
  production origin is configured, so an un-prerendered staging site is not indexed.
- The limitation is recorded in the validation report as a known issue, and in
  `docs/roadmap/DEVELOPMENT_ROADMAP.md` under Phase 13 (production readiness).

## Decision requested from the owner

Approve option B (prerender at build time) so it can be scheduled — recommended for
Phase 13, before public launch. If the owner prefers to stay on client-side
rendering (option A) for launch, that is a legitimate choice, but it should be
recorded here rather than left implicit.
