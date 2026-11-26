# KRISHIMA — Design System Specification

- **Version:** 1.0 (Phase 0)
- **Owner:** Professional UI/UX Designer / Frontend lead
- **Status:** Binding for web & admin (mobile reuse later)
- **Companions:** [Repository Structure](../standards/01-repository-structure.md) · [PRD](../product/01-product-requirements.md)

---

## 1. Principles

1. **Mobile-first & rural-ready** — designed for a mid-range Android phone on 3G first;
   desktop is an enhancement. Small payloads, few taps, large touch targets.
2. **Clarity over decoration** — agricultural users need legible, unambiguous screens in
   sunlight and with limited literacy. Text + icon + color, never color alone.
3. **Trust** — consistent, honest states (no fake data, clear errors, explicit "not available").
4. **Multilingual by design** — all strings externalized; layouts tolerate longer Hindi text.
5. **Accessible** — WCAG 2.1 AA minimum; keyboard operability; focus visible.

---

## 2. Brand

| Token | Value | Usage |
|-------|-------|-------|
| Brand **KRISHI** | `#15803D` | Primary actions, active nav, links, success-family accents |
| Brand **MA** | `#111111` | Wordmark, primary headings, high-emphasis text |
| Background | `#F8FAFC` | App canvas |
| Surface | `#FFFFFF` | Cards, sheets, inputs |

**Wordmark:** "KRISHI" in `#15803D` (weight 700) + "MA" in `#111111`. On dark surfaces, use
white text with the green accent; never recolor the wordmark arbitrarily.

---

## 3. Color System

Semantic tokens (Tailwind CSS variables, light theme; dark theme is deferred but tokens are
named so it can be added without renaming).

| Token | Hex | Use |
|-------|-----|-----|
| `--color-primary` | `#15803D` | Primary buttons, active states |
| `--color-primary-hover` | `#166534` | Hover/pressed |
| `--color-primary-foreground` | `#FFFFFF` | Text on primary |
| `--color-primary-subtle` | `#DCFCE7` | Selected rows, badges, focus halo |
| `--color-ink` | `#111111` | Primary text, wordmark "MA" |
| `--color-ink-muted` | `#475569` | Secondary text |
| `--color-ink-subtle` | `#64748B` | Placeholders, captions |
| `--color-bg` | `#F8FAFC` | App background |
| `--color-surface` | `#FFFFFF` | Cards, inputs, sheets |
| `--color-border` | `#E2E8F0` | Dividers, input borders |
| `--color-success` | `#16A34A` | Success text/icon |
| `--color-success-bg` | `#DCFCE7` | Success banner bg |
| `--color-warning` | `#B45309` | Warning text |
| `--color-warning-bg` | `#FEF3C7` | Warning banner bg |
| `--color-danger` | `#B91C1C` | Errors, destructive text |
| `--color-danger-bg` | `#FEE2E2` | Error banner bg |
| `--color-info` | `#1D4ED8` | Informational |
| `--color-focus` | `#15803D` | Focus ring (2px + 2px offset) |

**Contrast (WCAG AA):**
- `#111111` on `#F8FAFC` ≈ 18:1 ✔
- `#FFFFFF` on `#15803D` ≈ 4.9:1 ✔ (large & normal text)
- `#15803D` on `#FFFFFF` ≈ 4.9:1 ✔
- Danger text `#B91C1C` on `#FFFFFF` ≈ 6.4:1 ✔
- Never convey status by color alone — always pair with icon/text label.

> All color values live as tokens; components reference tokens, never raw hex.

---

## 4. Typography

| Role | Font | Size / line-height | Weight |
|------|------|--------------------|--------|
| Display / wordmark | Inter (Sans) | 28/36 | 700 |
| H1 | Inter | 24/32 | 600 |
| H2 | Inter | 20/28 | 600 |
| H3 | Inter | 18/26 | 600 |
| Body | Inter | 16/24 | 400 |
| Body-sm | Inter | 14/20 | 400 |
| Caption | Inter | 12/16 | 400 |
| Numeric (prices, qty) | Inter with `tabular-nums` | — | 500 |

- Base font ≥ 16px on mobile inputs (prevents iOS zoom).
- Devanagari: Inter supports basic Devanagari; fallback stack includes `'Noto Sans Devanagari'`
  for Hindi (Phase 2 i18n). Ensure line-height ≥ 1.6 for Devanagari.
- Max line length ~ 70ch for readability.

**Spacing scale (4px base):** `4, 8, 12, 16, 24, 32, 40, 48, 64`.
**Radius:** `sm 6px`, `md 10px`, `lg 14px`, `full`.
**Shadow:** subtle only — `sm` for cards, `md` for popovers; no heavy drop shadows.

---

## 5. Layout & Responsive

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| `sm` | ≥ 640 | 1 column |
| `md` | ≥ 768 | 2 columns / sidebar begins |
| `lg` | ≥ 1024 | content max-width 1200px, 3 columns |
| `xl` | ≥ 1280 | 4 columns for grids |

- **Mobile:** bottom nav (≤5 items) or hamburger per feature; sticky primary CTA.
- **Desktop web:** top bar + contextual left nav; content max-width `1200px`.
- **Admin:** persistent left sidebar, dense data tables, desktop-first but responsive ≥ tablet.
- Touch targets ≥ 44×44 CSS px.

---

## 6. Components (shadcn/ui-based, in `packages/ui`)

Each component ships with: default, hover, focus-visible, disabled, loading, error, and
empty (where applicable) states, and is keyboard operable.

**Primitives:** `Button`, `Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `Radio`,
`Switch`, `Tabs`, `Dialog`, `Sheet`, `Popover`, `Tooltip`, `Badge`, `Avatar`, `Card`,
`Table`, `Pagination`, `Breadcrumbs`, `Toast`, `Alert`, `Accordion`, `Skeleton`, `Progress`,
`Stepper`, `FileUpload`, `DatePicker`.

**Composite patterns:**
- `PageHeader` (title, breadcrumb, actions)
- `EmptyState` (illustration/icon + message + primary action)
- `ErrorState` (message + retry + support ref via `request_id`)
- `DataTable` (sortable, paginated, accessible header semantics)
- `FormField` (label + control + hint + error, wired to React Hook Form + Zod)
- `ConfirmDialog` (destructive action, requires explicit confirm)
- `MoneyDisplay` / `QuantityDisplay` (decimal formatting, unit)
- `StatusBadge` (status → color + label mapping, never color alone)

**Button variants:** `primary`, `secondary` (outline), `ghost`, `destructive`, `link`.
Sizes: `sm, md, lg`. Primary = brand green.

---

## 7. States (mandatory on every data view)

| State | Standard |
|-------|----------|
| **Skeleton loading** | Shimmer placeholders matching final layout; no layout shift |
| **Empty** | Friendly message in locale + clear next action ("Add your first listing") |
| **Error** | Explain + Retry + reference code; never raw technical text |
| **Partial/permission-limited** | Show locked state with explanation ("Verify KYC to sell") |
| **Success** | Toast + inline confirmation where relevant |
| **Disabled feature** | Visible but clearly marked "Coming soon" — never faked |

> Skeleton/empty/error are components, not one-off markup — reuse from `packages/ui`.

---

## 8. Forms & Validation

- React Hook Form + Zod; schema is the single source of validation on client.
- Inline, field-level errors below the field; summary at top for long forms.
- Validate on blur + on submit; never block typing.
- Required fields marked; hint text explains *why* a field is needed.
- Numeric fields: appropriate `inputmode` (`decimal`, `numeric`, `tel`) for mobile.
- Currency inputs: show `₹` prefix, accept decimals, format on blur.
- File uploads: show accepted type/size, progress, replace/remove controls.
- Error copy is actionable and localizable; never server stack text.

---

## 9. Accessibility (WCAG 2.1 AA)

- Semantic HTML; headings in order; landmark regions.
- Visible focus ring on every interactive element (`#15803D`, 2px + offset).
- Keyboard: full tab order; dialogs trap + return focus; ESC closes.
- ARIA only where semantics are insufficient (e.g., combobox, live region for toasts).
- Live regions announce async errors and toast messages.
- Form errors associated via `aria-describedby`; invalid via `aria-invalid`.
- Images: meaningful `alt`; decorative `alt=""`.
- Minimum contrast 4.5:1 text, 3:1 UI components.
- Respect `prefers-reduced-motion`.
- Language attribute on `<html lang>` per active locale.

---

## 10. Internationalization (i18n)

- All UI strings in translation files; no hardcoded copy in components.
- Launch locales: `en-IN`, `hi-IN`; architecture supports more (state names, crop names later).
- Locale affects: text, number/date format (`Intl`), currency display (`₹`, Indian grouping
  lakh/crore), and API `Accept-Language` for localized messages.
- Avoid text in images; allow 30–40% expansion for Hindi.
- Timezone: display in user TZ (default Asia/Kolkata), data stored UTC.

### 10.1 Implementation status (as built)

- Runtime: `packages/ui/src/i18n/i18n.ts` — dependency-free (no i18next yet), flat dot-separated
  keys, `initI18n()` / `translate()` / `translatePlural()` / `setLocale()`. API is a subset of the
  i18next surface so it can be swapped behind the same hook without touching pages.
- Exactly **one** `I18nProvider` per app (same rule as `ThemeProvider`), inside `AppProviders`.
  `initI18n()` runs at module scope in `main.tsx` before the first render.
- Locale persists in `localStorage` (`krishima.locale`); `<html lang>` is always kept in sync.
- Missing keys fall back to the default locale, then to the key id, and are reported via
  `onMissingKey` — never rendered as a blank string.
- `LanguageSwitcher` is a native `<select>` (most reliable on low-cost Android) using `useId()` so
  its label binding stays valid when it is mounted in header, mobile menu and footer together.
- **Hindi is complete and selectable** (OPEN-QUESTIONS A-15 resolved). The catalogue has full key
  parity with English, a unit test forbids untranslated values, and a dedicated e2e suite verifies
  Hindi layout, navigation and axe accessibility at 320–1920px. A native-speaker review before launch
  is recommended but is not a blocker for offering the language.
- Only locales marked `complete` appear in the selector; `partial` locales are excluded and refused
  by `setLocale()`.

## 10.2 Brand wordmark colour (dark theme)

The KRISHI wordmark must always read as **brand green**, never recoloured to a neutral. To keep that
identity *and* meet contrast, the wordmark uses the semantic token `--kr-logo-krishi`:

| Theme | Value | Contrast on surface |
|-------|-------|---------------------|
| Light | `#15803D` (green-700, the brand green) | 4.7:1+ on `--kr-surface` |
| Dark  | `#86EFAC` (green-300 — the same brand family, lightened) | 10.8:1 on `#121714` |

The original brand green on the dark surface measures **2.85:1**, below the 3:1 minimum for large
text and for the wordmark at small sizes. Using a lighter tint of the same green preserves the
identity while making it readable. `--kr-primary` is intentionally **not** reused for this: it also
backs the primary button, which must stay `#15803D` in both themes.

This is a token-level decision; no component hard-codes a colour for the logo.
- Details and verification: [`docs/testing/I18N_VALIDATION_REPORT.md`](../testing/I18N_VALIDATION_REPORT.md).

---

## 11. Admin Console Design (separate look)

- Same tokens, but **denser, desktop-first**: data tables, filters, bulk actions, side panels.
- Neutral chrome to distinguish from consumer app; brand used sparingly for primary actions.
- Every destructive staff action opens a `ConfirmDialog` with explicit consequences.
- Audit context surfaced: "You are acting as: <staff role>" + every sensitive action logged.
- No marketplace navigation; separate route tree & build.

---

## 12. Voice & Microcopy

- Plain language, short sentences, sentence case.
- Error copy: *What happened* + *What to do next*.
- Confirmation of destructive actions states the irreversible effect.
- Localizable placeholders; no jargon in farmer-facing flows.

---

## 13. Deliverables & Enforcement

| Item | Location | Enforced by |
|------|----------|-------------|
| Tokens | `packages/ui/styles/tokens.css` | Tailwind config references tokens only |
| Components | `packages/ui/src/*` | PR review; no raw hex in app code (lint rule) |
| Storybook (Phase 2+) | `frontend/.storybook` | Visual review |
| Axe a11y checks | Playwright + `@axe-core/playwright` | CI (Phase ≥2) |

**Definition of done for any UI feature:** responsive at `sm→xl`, all six states handled,
keyboard operable, passes axe (no critical violations), all strings localized, uses tokens &
shared components.
