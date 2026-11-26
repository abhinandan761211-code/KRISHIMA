# i18n Layer — Wiring & Validation Note

> Scope: close-out of the interrupted i18n work (task **N-1**). Records what was
> already built as a library, what was wired into the running app, and the checks
> actually run. Verified results only; anything not run is marked **Not Run**.

- **Date:** 2026-11-26
- **Runtime:** `packages/ui/src/i18n/i18n.ts` (dependency-free, flat keys)
- **Provider:** `packages/ui/src/i18n/I18nProvider.tsx` (one per app)
- **Selector:** `packages/ui/src/components/i18n/LanguageSwitcher.tsx`
- **Catalogues:** `frontend/src/features/public-website/i18n/{en,hi,index}.ts`

---

## 1. What is registered

| Item | Value |
|------|-------|
| Catalogue entry point | `frontend/src/features/public-website/i18n/index.ts` → `messages` |
| Default locale | `en` |
| Stored-locale key | `krishima.locale` (localStorage) |
| Keys in `en` | **497** (flat, dot-separated) |
| Keys in `hi` | **497** (exact structural mirror; parity enforced by test) |
| Locale registry status | `en` = **complete**; `hi` = **partial** (not selectable) |

## 2. Why Hindi is `partial`

OPEN-QUESTIONS **A-15** requires professional translation. No translations were
available, so `hi.ts` is a **structural mirror**: every key exists with the
English string and a `// TODO(hi)` tag. Registering it keeps the key set complete
and testable, while `status: "partial"` in `LOCALE_REGISTRY` makes the runtime:

- exclude it from `availableLocales()` (so it never appears in the selector), and
- refuse `setLocale("hi")`, returning the current locale unchanged.

This is deliberate — showing English copy under a "हिन्दी" label would be a false
claim. **Do not** flip `hi` to `complete` until every `// TODO(hi)` is removed and
the copy has been reviewed.

## 3. Wiring (what changed)

| File | Change |
|------|--------|
| `frontend/src/main.tsx` | `initI18n({ defaultLocale: "en", locales: messages })` at module scope, before first render |
| `frontend/src/app/providers/AppProviders.tsx` | `I18nProvider` added — one instance, inside `ThemeProvider` |
| `frontend/src/app/layouts/AppLayout.tsx` | `LanguageSwitcher compact` in `Navbar` actions |
| `packages/ui/.../LanguageSwitcher.tsx` | Replaced hardcoded `id="kr-language-select"` with `useId()` — the switcher is mounted 3–4× per page and duplicate ids broke label association (WCAG 4.1.1) |
| `packages/ui/src/i18n/i18n.ts` | `hi` registry entry `complete` → `partial` |

The public website (`PublicLayout`, `PublicNavbar`, `PublicFooter`, all pages)
already consumed `useI18n().t(...)`; before this change it had **no provider** and
would have thrown. It now resolves real copy.

## 4. Baseline defects fixed (unrelated to i18n, found during verification)

The prior report claimed a clean typecheck; it was stale. Three real errors existed:

1. `ContactPage.tsx` — imported `PageIntro` from `ContentPage`, which does not
   re-export it → fixed to import from `components/PageIntro`.
2. `FaqHelpPages.tsx` — same wrong import → fixed.
3. `SolutionsSections.tsx` — `icons` prop typed as the *farmer* icon union, so the
   business icon set (`bag`, `store`, `truck`, …) was rejected → widened to
   `Record<string, IconName>`.

## 5. Checks run

| Check | Command | Result |
|-------|---------|--------|
| Frontend typecheck | `frontend: npx tsc --noEmit` | **PASS** (exit 0, 0 errors) |
| `@krishima/ui` typecheck | `packages/ui: npx tsc --noEmit` | **PASS** (exit 0) |
| Frontend lint | `frontend: npx eslint .` | **PASS** (0 errors, 2 pre-existing `react-refresh` warnings in untouched files) |
| Frontend unit tests | `frontend: npx vitest run` | **PASS** — 28/28 (4 files; i18n adds 11) |
| Frontend production build | `frontend: npx vite build` | **PASS** (exit 0) |
| Backend tests | `backend: python3 -m pytest -q` | **PASS** — 10/10 |
| Design contrast | `python3 scripts/check_design_contrast.py` | **PASS** — 48/48 required pairs, both themes |
| Live render (browser) | dev server, headless Chromium | **PASS** — see §6 |
| Admin typecheck | `admin: npx tsc --noEmit` | **FAIL — pre-existing, unrelated** (see §7) |

### i18n unit test coverage (`frontend/tests/i18n.test.ts`)

- default locale + `<html lang>` application
- `resolveInitialLocale`: unstored / invalid / unavailable stored value
- persistence + `subscribeToLocale` notification
- per-locale `translate` with fallback to the default catalogue
- missing key everywhere → returns the key id **and** invokes `onMissingKey`
- placeholder interpolation and one/other plural selection
- **partial locale cannot be activated**
- catalogue parity: `en` and `hi` have identical key sets; `missingKeys("hi")` empty
- no empty values in `en`
- `hi` is not in `availableLocales()`

## 6. Live render verification (headless browser)

Vite dev server (`http://localhost:5199`), headless Chromium:

| Observation | Result |
|-------------|--------|
| Page mounts | **Yes** — `bodyChars` 9,869, `load` 581 ms |
| `<html lang>` | `en-IN` |
| `<title>` | `KRISHIMA — one platform for Indian agriculture · KRISHIMA` |
| `<h1>` (from catalogue) | `Grow smarter. Trade better. Build a stronger future.` |
| Raw i18n keys leaked into text | **No** (`/hero\.|nav\.|common\./` → false) |
| Language selector options | **`en: English` only** — Hindi correctly withheld |
| Duplicate element ids | **None** (3 selects, all distinct ids) |
| Every select labelled (`label[for]`) | **Yes** |
| Programmatic attempt to select `hi` | Refused: value reverts to `en`, nothing stored, `lang` unchanged |
| Console errors / failed requests | **0 / 0** |

Screenshot (`/tmp/kr_home.png`) reviewed visually: real English copy throughout,
selector and theme controls aligned, no clipping or overlap.

> Note: `vite preview` (production build) reports `bodyChars 0` in a sandboxed
> headless run because `index.html` blocks on Google Fonts preconnect/style. The
> dev server and a normal browser load fine. This is an environment artifact, not
> an app fault — but it does mean the production bundle was verified by **build
> success**, not by a preview render.

## 7. Known limitation — admin typecheck (pre-existing, out of scope)

`admin` has **one** TypeScript error, inside
`packages/ui/src/components/display/Icon.tsx`:

```
Type '{…ref?: Ref<SVGSVGElement>…}' is not assignable to SVGProps<SVGSVGElement>
```

Cause: `@types/react@19.0.2` exists as **two physical copies** —
`packages/ui/node_modules/@types/react` and `admin/node_modules/@types/react`.
Same version, different type identities, so the shared `Icon` component is checked
against a mismatched `SVGProps`. **Zero errors in admin's own `src/`.**

The same duplication exists in `frontend/node_modules`, which is why that app
aliases React in `vitest.config.ts`. This is a monorepo dependency-dedupe issue,
not caused by i18n. Fixing it (hoisting `@types/react` to the workspace root, or
adding the same alias to `admin/tsconfig.json`) is a separate task and is **not**
done here.

## 8. Not run

- Admin build (`vite build`) — blocked by §7.
- Interactive manual review at 320/375/390/768/1024/1440 px in both themes — the
  language selector adds no layout of its own; **Not Run** this task.
- Hindi rendering — **Not Run** by design; the locale is not selectable.
