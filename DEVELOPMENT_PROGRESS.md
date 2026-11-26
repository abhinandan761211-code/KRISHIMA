# KRISHIMA — Development Progress

> Concise, append-only record of work state. Update at the end of every task.
> Verified results only — never intent. Unrun checks are marked **Not Run**.

---

## Session — 2026-11-26 — Public website ("Phase 3" brief) COMPLETE + VALIDATED

Reports: [`docs/testing/PUBLIC_WEBSITE_VALIDATION_REPORT.md`](docs/testing/PUBLIC_WEBSITE_VALIDATION_REPORT.md) ·
[Guide](docs/design-system/PUBLIC_WEBSITE_GUIDE.md) ·
[Specification](docs/product/PUBLIC_WEBSITE_SPECIFICATION.md)

### Defects found by the audit and fixed (all now covered by tests)
- **BUG-1** horizontal overflow at 1024–1179px (navbar needed 1123px; 99px overflow).
  Switchers moved `lg`→`xl`, nav labels `whitespace-nowrap`. Overflow now 0 everywhere.
- **A11Y-1** `--kr-primary-text` green-700 on muted surface = 4.39:1 → token → green-800 (6.25:1).
- **A11Y-2** announcement "Read more" green-on-green (1.27:1) caused by conflicting
  `text-[color:]` utilities → new `AppLink` `plain` variant that sets no colour.
- **A11Y-3** dark final-CTA white-on-#86EFAC (1.40:1) → new `--kr-primary-fg-on-accent` (6.49:1).
- **A11Y-4** final-CTA footnote 4.15:1 → removed decorative `opacity-80` on text.
- **A11Y-5** KRISHI wordmark 2.85:1 on dark → new `--kr-logo-krishi` (10.8:1).
- Tap targets: theme buttons 32→40px, announcement dismiss 36→44px, logo link 28→44px.

### Added
- `robots.txt` + `sitemap.xml` generated at build time (`frontend/scripts/seo-files.ts`),
  env-aware; production without `VITE_SITE_ORIGIN` fails the build. New `VITE_SITE_ORIGIN`.
- Playwright e2e suite (3 specs, **50 tests**): routes, nav keyboard, theme, axe WCAG 2.2 AA.
- `data/indexable-routes.ts` — single source for sitemap + tests (derives solutions from roles).
- npm scripts `test:e2e`, `test:e2e:ui`.
- Docs: PUBLIC_WEBSITE_GUIDE, PUBLIC_WEBSITE_SPECIFICATION, PUBLIC_WEBSITE_VALIDATION_REPORT.
- Corrected the `/help` copy that claimed users could switch between English and Hindi.

### Verified
| Check | Result |
|-------|--------|
| frontend tsc / eslint | **PASS** / **PASS** (0 errors, 2 pre-existing warnings) |
| unit tests | **PASS** 28/28 |
| **e2e** | **PASS 50/50** |
| axe WCAG 2.2 AA, all 18 routes + dark + 404 | **PASS** |
| responsive overflow 320→1920 (9 widths) | **PASS** — zero |
| build | **PASS** — 452.79 kB JS (127.40 kB gzip), CSS 50 kB |
| design contrast | **PASS** 48/48 pairs |
| backend pytest | **PASS** 10/10 |

### New blockers / open items
- **B-7 Image licensing undocumented** — photography is used with no recorded source or
  licence. **Must be resolved before launch.**
- **Hindi translation** (A-15) — `hi` remains `partial`; not selectable.
- **No prerendering** — non-JS crawlers see an empty shell; needs an ADR before launch.

### Foundation status (unchanged)
Phase 1 **incomplete** (B-1), Phase 2 **not started** (`backend/app/modules/` empty). The
website depends on neither, so it was safe to finish; this does not advance either phase.

---

## Session — 2026-11-26 — Task N-1 (i18n wire-up) COMPLETE

Report: [`docs/testing/I18N_VALIDATION_REPORT.md`](docs/testing/I18N_VALIDATION_REPORT.md)

### Done
- **Baseline was not clean.** The 2026-11-25 "typecheck PASS" was stale; 3 real errors existed in
  `public-website` (2× wrong `PageIntro` import, 1× icon prop typed as the farmer subset). All fixed.
- **i18n wired into the running app:** `initI18n({defaultLocale:"en", locales: messages})` in
  `main.tsx`; `I18nProvider` added to `AppProviders`; `LanguageSwitcher` added to `AppLayout`.
  Previously the public site called `useI18n()` with **no provider** and would have thrown.
- **Catalogues:** `en.ts` existed (497 keys); created `hi.ts` as a key-exact structural mirror and
  `i18n/index.ts` as the single catalogue entry.
- **Hindi deliberately NOT shipped as Hindi.** No translations exist, so `hi` was flipped from
  `complete` → **`partial`** in `LOCALE_REGISTRY`: excluded from the selector and refused by
  `setLocale`. Logged against OPEN-QUESTIONS A-15.
- **Accessibility fix:** `LanguageSwitcher` used a hardcoded element id and is mounted 3–4× per
  page → duplicate ids / broken label association. Now `useId()`.
- **Tests:** `frontend/tests/i18n.test.ts` — 11 new tests.
- **Docs:** validation report, design-system spec §10.1, repo-structure note (removed the fictional
  `packages/i18n` + `src/locales/` entries), dev-guide §9, OPEN-QUESTIONS A-15.

### Verified this session

| Check | Result |
|-------|--------|
| `frontend` tsc / eslint / vitest / vite build | **PASS** / PASS (0 errors) / **PASS 28/28** / **PASS** |
| `packages/ui` tsc | **PASS** |
| backend pytest | **PASS** — 10/10 |
| design contrast | **PASS** — 48/48 pairs, both themes |
| live render (headless Chromium, dev server) | **PASS** — h1 from catalogue, no raw-key leakage, 0 console errors, no duplicate ids, Hindi absent from selector, forcing `hi` is refused |
| `admin` tsc | **FAIL — pre-existing & out of scope**: one error inside `packages/ui/Icon.tsx` from two physical `@types/react` copies. Admin `src/` has 0 errors. **Not fixed here.** |

### Corrections to previous session's notes
- The WIP table claimed "frontend typecheck PASS" — untrue at the time; three errors were present.
- `hi.ts` did not exist, and no key-parity test existed despite `en.ts` saying one did. Both now true.

### Still open (owner action, unchanged)
- **B-1** DB password, **B-2** `app_runtime` role, **B-3** interactive Google OAuth, **B-5** not a git repo.
- **New B-6:** monorepo has duplicate `@types/react` copies → `admin` typecheck fails. Low risk,
  but admin is currently unverifiable by `tsc`/`build`.
- **Hindi translation** (A-15) — blocks flipping `hi` to `complete`.

---

## Session — 2026-11-25 (resumed after interrupted agent run)

### Repository state
- **Not a git repository.** `git status` fails (`fatal: not a git repository`). No branch, no
  history, no diff baseline. (Tracked as blocker **B-5** in the Foundation report.)
- Therefore "recently modified" was reconstructed from filesystem mtimes, not VCS.

### Files modified after the last validation report (19:53 → 20:53)
These are uncommitted, undocumented work-in-progress in `packages/ui` — an **i18n / extra UI
primitives extension** layered on top of the completed Phase 2 design system:

| File | Nature | State |
|------|--------|-------|
| `packages/ui/src/i18n/i18n.ts` | New dependency-free i18n runtime (locale registry, `t`, plurals, persistence) | Complete, compiles |
| `packages/ui/src/i18n/I18nProvider.tsx` | New React context provider + `useI18n` | Complete, compiles |
| `packages/ui/src/components/i18n/LanguageSwitcher.tsx` | New native-select language switcher | Complete, compiles |
| `packages/ui/src/components/display/Icon.tsx` | New inline-SVG icon set (`Icon`, `IconName`) | Complete, compiles |
| `packages/ui/src/components/navigation/Accordion.tsx` | New WAI-ARIA accordion | Complete, compiles |
| `packages/ui/src/components/feedback/States.tsx` | Extended empty/error/offline states | No TODO markers |
| `packages/ui/src/components/button/LinkButton.tsx` | Adjustment | No TODO markers |
| `packages/ui/src/index.ts` | Barrel now exports i18n + Icon + Accordion + LanguageSwitcher | Consistent |
| `packages/ui/styles/tokens.css` | Token additions | No TODO markers |
| `frontend/tailwind.config.ts`, `frontend/tsconfig.json` | Wiring/typing tweaks | Consistent |

**Assessment:** this WIP is *self-consistent and complete as a library layer*, but it is **not
wired into the running app**. `frontend/src/app/providers/AppProviders.tsx` has no `I18nProvider`,
`AppLayout` renders no `LanguageSwitcher`, and no message catalog is registered. There is **no
documentation** for the i18n layer yet (no design-system doc, no validation entry).

### Verification actually run this session

| Check | Command | Result |
|-------|---------|--------|
| Frontend typecheck | `cd frontend && npx tsc --noEmit` | **PASS** (exit 0) |
| Frontend lint | `cd frontend && npx eslint .` | **PASS** (0 problems) |
| Frontend unit tests | `cd frontend && npx vitest run` | **PASS** — 17/17 (3 files) |
| `@krishima/ui` typecheck | `cd packages/ui && npx tsc --noEmit` | **PASS** (exit 0) |
| Backend tests | `cd backend && pytest -q` | **PASS** — 10/10 |
| Frontend production build | `vite build` | **Not Run** this session (report shows PASS at 19:53) |
| Admin typecheck/build | — | **Not Run** this session |
| Contrast check | `scripts/check_design_contrast.py` | **Not Run** this session |
| DB connectivity / migrations | — | **Blocked (B-1)** — DB password rejected (owner action) |

No secret, `.env`, or credential file was read, printed, or modified.

---

## Phase status (authoritative summary)

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0 — Documentation | **Complete** | ADRs 0001–0009, PRD, architecture, standards |
| Phase 1 — Foundation & Tooling | **~90%, not signed off** | Code + tests pass; **blocked on B-1** (DB credential), B-2 (`app_runtime` role), B-5 (`git init`) |
| Phase 2 — Design System | **Complete & validated** | Report: `docs/testing/DESIGN_SYSTEM_VALIDATION_REPORT.md`; 0 axe violations, contrast PASS |
| Phase 2+ — i18n & extra primitives | **Wired, tested, documented** | Report: `docs/testing/I18N_VALIDATION_REPORT.md`. `hi` is `partial` pending translation (A-15) |
| Public website (marketing site, outside phased business scope) | **Complete & validated** | 18 routes; axe WCAG 2.2 AA clean on all routes in both themes; 50 e2e tests; zero overflow 320→1920. Blockers: image licensing (B-7), Hindi translation |
| Phase 3 (roadmap) — Catalog & Listings | **Not started** | 0 listing/category models, 0 backend modules, only `0001_baseline` migration exists |
| Phase 2 (domain) — Identity/Profiles/KYC/Orgs | **Not started** | Per roadmap; requires phase approval |

### Naming correction (2026-11-26)
`frontend/src/app/router/index.tsx` and `LandingPage.tsx` labelled the public website as
"Phase 3". That is wrong: per `docs/ROADMAP.md`, **Phase 3 = Catalog & Listings**, which has not
started. The public website is foundation work outside the phased business scope. Both comments
corrected; no code changed.

### Open blockers
- **B-1** DB password rejected → blocks all DB/migration/RLS work.
- **B-2** Least-privilege `app_runtime` role not created.
- **B-3** Google OAuth not exercised end-to-end (interactive).
- **B-5** Repository is not a git repo — **no rollback safety; should be fixed first.**
- **B-6** Two physical `@types/react@19.0.2` copies → `admin` typecheck fails inside `packages/ui`. Admin `src/` is clean. Dependency-hygiene fix, not a code bug.
- **B-7** Public-website images are used with no documented source or licence. Launch blocker.

---

## Next smallest task (recommended, not started)

**Task N-2 — resolve the duplicate `@types/react` copies (B-6)** so `admin` typechecks again:
hoist a single `@types/react`/`@types/react-dom` to the workspace root and delete
`packages/ui/node_modules/@types/react`, then run `admin: npx tsc --noEmit` and `vite build`.
This is dependency hygiene only; it unblocks verification of an app that is currently untested.

> **Still not doing:** Phase 2 domain modules (Identity/KYC/Orgs) — requires B-1 resolved and
> explicit phase approval (AGENTS §12). Recommended order: **B-5 (`git init`) → B-1 → N-2 → Phase 2**.
