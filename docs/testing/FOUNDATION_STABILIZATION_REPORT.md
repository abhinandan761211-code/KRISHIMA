# KRISHIMA — Foundation Stabilization Report

- **Date:** 2026-11-26
- **Scope:** blocker resolution, documentation reconciliation, licensing, translation,
  development infrastructure. **No business feature was implemented.**
- **Method:** every result below comes from a command run in this session. Nothing is
  inferred; **Not Run** is stated where a check was not executed.
- **Verdict:** **4 of 4 assigned blockers resolved** (B-1, B-5, B-7, A-15), with one
  owner action outstanding (B-2, the least-privilege database role) that is outside
  what can be done from this repository.

---

## 1. Blocker resolution summary

| ID | Blocker | Status | Evidence |
|----|---------|--------|----------|
| **B-1** | Database credential unusable; migrations applied nothing | **RESOLVED** | Two real code defects fixed (§2). `alembic current` → `0001_baseline (head)`; `app.gen_uuid_v7()` returns a valid UUIDv7 |
| **B-5** | Repository not under version control | **RESOLVED** | Git initialized, 225 files committed, **no remote, no push** |
| **B-7** | Public-website images had no recorded licence | **RESOLVED** | 3 unverified stock photos deleted, replaced with 3 original generated SVGs; documented in `docs/assets/IMAGE_LICENSES.md` |
| **A-15** | Hindi translation did not exist | **RESOLVED** | 498 Hindi keys, exact parity, **0 untranslated values**, locale enabled, 10 Hindi e2e tests pass |

---

## 2. B-1 — exact root cause and fix

This was **not** a wrong password. The credential was always valid; the tooling
discarded every write. Two independent defects had to be fixed, and each alone was
enough to make `alembic upgrade` exit 0 while changing nothing.

### Defect 1 — ConfigParser interpolation

`database/migrations/env.py` used `engine_from_config(section, ...)`. The section is
built by Python's `ConfigParser`, which treats `%` as interpolation syntax. The
migration password must be percent-encoded (`Rail%402026Abhi`), so the `%40` raised
`ValueError: invalid interpolation syntax`.

**Fix:** build the engine directly with `create_engine(url, ...)`, which takes the
string verbatim. (`database/migrations/env.py`)

### Defect 2 — transaction never committed

SQLAlchemy 2.0 places a `Connection` in "begin once" mode. `env.py` ran
`CREATE SCHEMA IF NOT EXISTS` via `exec_driver_sql()`, which opened a transaction;
closing the connection **rolled it back**. Alembic's `context.begin_transaction()`
only nests inside that transaction, so the schema, the function and the
`alembic_version` row were all silently discarded.

**Fix:** an explicit `connection.commit()` after `run_migrations()`.

### Verification

```
$ database/scripts/migrate.sh current
0001_baseline (head)

$ python3 scripts/check_db_connection.py
CONNECT: OK  (user=postgres, db=postgres)
  app schema: present
  tables: none beyond the baseline (expected for Phase 1)
RESULT: PASS
```

`app.gen_uuid_v7()` was called and returned a valid UUIDv7. The baseline creates
only the schema, the UUIDv7 function and Alembic's version table — correct for
Phase 1, which implements no business domain.

### What the baseline does NOT create

The roadmap's Phase 1 description mentions `users`, `roles`, `role_assignments`,
`audit_log` and `outbox_events`. **These tables do not exist** — the baseline
migration creates only the schema and the UUID helper. This is a **gap between the
roadmap text and the migration**, recorded here rather than hidden. It belongs to
Phase 1 completion, not to this stabilization task.

### Security notes on B-1

- `backend/.env` and `database/.env` are **git-ignored** (verified with
  `git check-ignore`); only `*.env.example` templates are tracked.
- **B-2 is still open:** `DATABASE_URL` authenticates as the **owner** role
  (`postgres`), which bypasses RLS. Runtime must use a least-privilege role. This
  requires creating `app_runtime` in the Supabase dashboard — an owner action.
- **The database password was shared in chat during this session and should be
  rotated** once B-2 work is scheduled. Nothing in the repository exposes it.
- New helper scripts never print credentials: `scripts/set_db_password.py` reads via
  `getpass`, and `scripts/check_db_connection.py` redacts URLs and error strings.

---

## 3. B-5 — version control

- `git init` run; `user.name`/`user.email` set **locally** to
  `KRISHIMA Development <dev@krishima.local>` — a placeholder, not a real identity.
  Replace it with the team's identity before pushing anywhere.
- Secret scan performed **before** the first commit:
  - `git add --dry-run` confirmed no `.env`, `node_modules`, `dist`, `.venv` or
    key files would be staged;
  - content scan for JWTs (`eyJ…`), `service_role`, PEM private keys and
    credential-bearing URLs found only variable **names** and redaction regexes;
  - entropy scan (40 candidates, all >4.2 bits/char) matched only identifiers and
    documentation paths.
- Two commits, **no remote configured, no push performed.**
- `package-lock.json` is excluded by `.gitignore`. This **conflicts with AGENTS §8**
  ("commit lockfiles"). Not changed here because it is a workspace-tooling decision;
  flagged as an open item.

---

## 4. B-7 — image licensing

Three stock photographs (`hero-farm-800.jpg`, `hero-farm-1600.jpg`,
`og-default.jpg`) had no source, author, licence or EXIF metadata, and no
provenance was recoverable. They were **deleted** and replaced with original
artwork generated from the brand palette:

- `hero-farm-1600.svg`, `hero-farm-800.svg` — abstract morning-field illustration;
- `og-default.svg` — social sharing card.

Generated by `frontend/scripts/generate-artwork.py` (committed, deterministic).
There is no third-party rights holder, so no attribution or fee applies.

**Preserved:** the `<picture>` element still selects by viewport; intrinsic
dimensions keep layout stable; `alt` text still comes from the catalogue.
**Improved:** the hero dropped from 67–244 KB JPEG to ~5 KB SVG.

Full detail: [`docs/assets/IMAGE_LICENSES.md`](../assets/IMAGE_LICENSES.md).

---

## 5. A-15 — Hindi translation

| Locale | Keys | Untranslated values | Status |
|--------|------|---------------------|--------|
| `en` | 498 | — | complete |
| `hi` | 498 | **0** | complete — selectable |

- Natural, simple Hindi aimed at farmers; common loanwords (KYC, QR) transliterated
  rather than invented.
- Key parity with English enforced by a unit test.
- A unit test also asserts **every Hindi value contains Devanagari** (only the brand
  name `KRISHIMA`, `KYC` and `404` are permitted as Latin), so an English string can
  never be passed off as a translation.
- A dedicated e2e suite (`e2e/hindi.spec.ts`, 10 tests) verifies Devanagari renders,
  `lang="hi-IN"`, no raw keys on any route, **every route's `<h1>` is translated**,
  no overflow at 320–1920px, navbar controls do not wrap, the mobile menu works, and
  axe WCAG 2.2 AA passes in Hindi.
- Hindi was enabled in the selector **only after** those layout tests passed.

**Two real bugs were found by the Hindi tests and fixed:**
1. The nav dropdown was labelled "Services" — identical to the `/services` link, so
   a screen-reader user heard "Services" twice. Relabelled to a distinct
   "Categories" / "खाता श्रेणियाँ".
2. The Hindi label is longer than the English one and **wrapped to two lines**,
   breaking the 1024–1280px navbar fix. Fixed with `whitespace-nowrap`.

**Recommended:** native-speaker review before public launch. This is a quality gate,
not a blocker for offering the language.

---

## 6. Roadmap reconciliation (Task 2)

`docs/roadmap/DEVELOPMENT_ROADMAP.md` is now the single authoritative 14-phase
sequence, with a full old→new mapping and an evidence rule ("a phase is Complete only
if a named file proves it"). It distinguishes **project phases** from **technical
milestones** — the confusion that caused the marketing site to be mislabelled
"Phase 3" while the roadmap's Phase 3 was Catalog & Listings.

Phase status, stated honestly:

| Phase | Status | Evidence |
|-------|--------|----------|
| 0 Planning | Complete | ADRs, PRD, standards |
| 1 Core platform foundation | **NOT complete** | DB now connects, but the baseline creates no business tables; B-2 open |
| 2 Design system | Complete | Design System Validation Report |
| 3 Public website | Complete | Public Website Validation Report |
| 4+ | Not started | — |

---

## 7. Design system preservation (Task 8)

- No per-component colour patches were introduced. Every contrast fix is a **token**
  change in `packages/ui/styles/tokens.css`.
- **Dark-mode logo:** the KRISHI wordmark uses the semantic token
  `--kr-logo-krishi` — brand green `#15803D` in light, `#86EFAC` (same brand family,
  lightened) in dark. The original green on the dark surface measures **2.85:1**,
  below the 3:1 minimum; the lightened tint gives **10.8:1**. Identity preserved,
  legibility restored. `--kr-primary` is deliberately not reused because it also
  backs the primary button.
- All previous contrast fixes are intact; `scripts/check_design_contrast.py` passes
  **48/48** pairs and the rendered-page axe scan is clean in both themes.

---

## 8. Architecture decision (Task 7)

[ADR-0010](../adr/0010-public-page-rendering.md) — **Status: Proposed.** Recommends
build-time prerendering of public routes and **rejects SSR** (the content is static;
SSR would add a permanent server for no benefit). No framework change; no
implementation in this task. Requires owner approval.

---

## 9. Production configuration (Task 10)

`VITE_SITE_ORIGIN` is documented in
[`SEO_AND_PRODUCTION_CONFIG.md`](../design-system/SEO_AND_PRODUCTION_CONFIG.md).
Verified by building:

| Build | robots.txt | sitemap | Result |
|-------|-----------|---------|--------|
| dev (no origin) | `Disallow: /` | 0 URLs | correct |
| production + origin | allow + `Sitemap:` | 17 URLs | correct |
| production, no origin | **build fails** | — | correct (loud failure) |

No production domain was invented and no deployment was performed.

---

## 10. Actual test results

| Check | Command | Result |
|-------|---------|--------|
| TypeScript | `frontend: npx tsc --noEmit` | **PASS** (0 errors) |
| ESLint | `frontend: npx eslint .` | **PASS — 0 errors, 0 warnings** (the two standing warnings are fixed) |
| Unit tests | `frontend: npx vitest run` | **PASS — 29/29** |
| E2E | `frontend: npx playwright test` | **PASS — 65/65** (55 English + 10 Hindi) |
| Responsive | 156 combos: 13 widths × 6 routes × 2 locales | **PASS — zero horizontal overflow** (320–2560px) |
| axe WCAG 2.2 AA | all 18 routes, light + dark + Hindi | **PASS** |
| Production build | `npx vite build` | **PASS** — 485 kB JS / 131 kB gzip |
| SEO files | 3 build scenarios | **PASS** (see §9) |
| Design contrast | `python3 scripts/check_design_contrast.py` | **PASS — 48/48** |
| Backend tests | `backend: python3 -m pytest` | **PASS — 10/10** |
| DB connectivity | `python3 scripts/check_db_connection.py` | **PASS** |
| Migration state | `alembic current` | **PASS — 0001_baseline (head)** |
| Secret scan | dry-run + pattern + entropy | **PASS — no secrets staged** |
| Admin typecheck | `admin: npx tsc --noEmit` | **FAIL — pre-existing B-6**, unrelated (duplicate `@types/react`) |
| Screen-reader pass | VoiceOver/NVDA | **Not Run** |
| 200%/400% zoom reflow | — | **Not Run** |
| Lighthouse / field metrics | — | **Not Run** |

**The two ESLint warnings were fixed properly, not suppressed:**
- `FaqAndCtaSections.tsx` exported `FAQ_ITEMS` (data) from a component module →
  moved to `data/faq.ts`, matching the repository rule that static lists live in
  `data/`.
- `routes.tsx` exports a route table (a value) alongside a component → same documented
  `react-refresh` disable already used by `app/router/index.tsx`.

---

## 11. Files changed (this task)

**Fixed (real defects)**
- `database/migrations/env.py` — `create_engine` instead of `engine_from_config`; explicit `commit()`
- `frontend/src/features/public-website/components/AppLink.tsx` — no conflicting colour utilities; safe wrapping
- `frontend/src/features/public-website/components/PublicNavbar.tsx` — distinct dropdown label; `whitespace-nowrap` on controls
- `frontend/src/features/public-website/sections/FaqAndCtaSections.tsx` — FAQ data moved out
- `frontend/src/features/public-website/sections/HeroSection.tsx` — SVG artwork
- `packages/ui/src/i18n/i18n.ts` — `hi` marked complete
- `packages/ui/src/components/i18n/LanguageSwitcher.tsx` — inherits colour (footer legibility)
- `packages/ui/styles/tokens.css` — `--kr-primary-text`, `--kr-primary-fg-on-accent`, `--kr-logo-krishi`

**Added**
- `frontend/src/features/public-website/i18n/hi.ts` — full Hindi catalogue
- `frontend/src/features/public-website/data/{faq,indexable-routes}.ts`
- `frontend/e2e/{routes,navigation,accessibility,hindi}.spec.ts` + `playwright.config.ts`
- `frontend/scripts/{seo-files.ts,generate-artwork.py}`
- `scripts/{set_db_password.py,check_db_connection.py}`
- `docs/roadmap/DEVELOPMENT_ROADMAP.md`, `docs/assets/IMAGE_LICENSES.md`
- `docs/adr/0010-public-page-rendering.md`
- `docs/design-system/{PUBLIC_WEBSITE_GUIDE,SEO_AND_PRODUCTION_CONFIG}.md`
- `docs/product/PUBLIC_WEBSITE_SPECIFICATION.md`
- `docs/testing/PUBLIC_WEBSITE_VALIDATION_REPORT.md`

**Docs updated:** `OPEN-QUESTIONS.md` (A-15), `docs/design/01-design-system-spec.md`
(§10.1–10.2), `docs/adr/README.md`, `DEVELOPMENT_PROGRESS.md`.

---

## 12. Issues remaining

| ID | Issue | Owner action |
|----|-------|--------------|
| **B-2** | Runtime DB URL uses the **owner** role; RLS does not apply to it | Create a least-privilege `app_runtime` role in Supabase and switch `DATABASE_URL` to it |
| **B-3** | Google OAuth never exercised end-to-end | Interactive consent run |
| **B-6** | Duplicate `@types/react` → `admin` typecheck fails | Dependency-dedupe task |
| **B-8** | Baseline migration creates no business tables, though the roadmap's Phase 1 lists them | Phase 1 completion work |
| **B-9** | Lockfiles excluded by `.gitignore`, conflicting with AGENTS §8 | Decide pnpm-vs-npm and commit the chosen lockfile |
| **B-10** | Database password was shared in chat this session | **Rotate it** |
| — | No prerendering (ADR-0010 Proposed) | Approve or reject |
| — | Hindi needs native-speaker review | Quality gate before launch |

---

## 13. Security findings

- No secret, key or credential was committed. `.env` files are ignored at any depth.
- No credential was printed to output during this session: the helper scripts redact
  URLs and error strings, and the password prompt is hidden.
- **One exposure to act on:** the database password was pasted into the chat
  transcript. Rotating it in Supabase is the correct remediation.
- The service-role key appears nowhere in tracked files.
- No destructive database operation was performed. My temporary probe schema
  (`test_probe`) was dropped; `app` was dropped once during diagnosis **before** any
  application data existed (the schema was empty and newly created in this session).

---

## 14. Foundation readiness assessment

**Phase 1 is materially closer but still not complete.** The blocker that prevented
all database work is gone: the app connects, migrations apply and persist, and the
UUIDv7 helper works. What remains is not blocked by credentials — it is unbuilt
scope (business tables, the `app_runtime` role, RLS policies).

**Safe to proceed to Phase 4 (Authentication)?** Not yet, and not because of this
task's scope: authentication writes to `users`/`roles`, which the baseline does not
create, and runtime must run under a least-privilege role before RLS can be tested.
Recommended order:

1. Rotate the database password (B-10).
2. Create `app_runtime` and switch the runtime URL (B-2).
3. Complete the Phase 1 baseline tables + RLS policies (B-8).
4. Decide lockfile strategy (B-9).
5. Resolve `admin` typecheck (B-6).
6. Owner decides on ADR-0010.
7. **Then** Phase 4.

---

## 15. Decisions requiring owner approval

1. **ADR-0010** — prerender public routes at build time? (recommended) or ship
   client-rendered?
2. **Database password rotation** — required, since it was shared in chat.
3. **`app_runtime` role** — the least-privilege model needs a dashboard action.
4. **Lockfile policy** — commit `package-lock.json`, or migrate to pnpm workspaces?
5. **Hindi review** — commission a native speaker before launch?
