# KRISHIMA — Design Tokens

- **Version:** 1.0 (Phase 2)
- **File:** [`packages/ui/styles/tokens.css`](../../packages/ui/styles/tokens.css)
- **Consumers:** `frontend/`, `admin/` (via `@krishima/ui`); future `mobile/`

---

## 1. Architecture

```
packages/ui/styles/tokens.css        ← the ONLY place visual values are defined
        │  CSS custom properties (--kr-*)
        ▼
frontend/tailwind.config.ts          ← maps tokens → Tailwind utilities (var(--kr-*))
admin/tailwind.config.ts             ← same mapping, admin subset
        │
        ▼
components (@krishima/ui + app code) ← consume utilities/tokens, never raw hex
```

**Why CSS custom properties:** the installed Tailwind is **v3.4.17**. Tailwind v3 supports
`darkMode: ["selector", '[data-theme="dark"]']` and arbitrary `var()` values natively, so tokens
switch theme by changing one attribute on `<html>` — **no class duplication, no dependency
upgrade, no v4 migration risk**.

---

## 2. Token groups

### 2.1 Colour
See [COLOR_SYSTEM.md](COLOR_SYSTEM.md). Prefixes: `--kr-color-*` (primitive), semantic roles,
`--kr-btn-*` / `--kr-input-*` / `--kr-nav-*` / `--kr-card-*` / `--kr-table-*` (component).

### 2.2 Typography

| Token | Value | Notes |
|-------|-------|-------|
| `--kr-font-sans` | Inter, system-ui, … | English UI |
| `--kr-font-hindi` | Noto Sans Devanagari, Inter, … | Hindi / Devanagari |
| `--kr-font-mono` | ui-monospace, … | codes, IDs |
| `--kr-text-display` | 2.25rem (36px) | hero |
| `--kr-text-h1` | 1.875rem (30px) | page title |
| `--kr-text-h2` | 1.5rem (24px) | section |
| `--kr-text-h3` | 1.25rem (20px) | |
| `--kr-text-h4` | 1.125rem (18px) | |
| `--kr-text-h5` | 1rem (16px) | |
| `--kr-text-h6` | 0.875rem (14px) | uppercase label |
| `--kr-text-body` | 1rem (16px) | **minimum for farmer-facing text** |
| `--kr-text-sm` | 0.875rem (14px) | |
| `--kr-text-caption` | 0.75rem (12px) | |
| `--kr-text-label` | 0.875rem (14px) | form labels |
| `--kr-leading-*` | tight 1.25 … relaxed 1.625 | Devanagari uses relaxed |
| `--kr-weight-*` | 400 / 500 / 600 / 700 | |

Only **400/500/600/700** are loaded (no unnecessary weights).

### 2.3 Spacing (4px base)

`--kr-space-1` 4 · `-2` 8 · `-3` 12 · `-4` 16 · `-5` 20 · `-6` 24 · `-8` 32 · `-10` 40 ·
`-12` 48 · `-16` 64 (px).

Usage guidance:

| Context | Token |
|---------|-------|
| Page padding | `space-4` mobile → `space-6`/`space-8` desktop |
| Card padding | `space-5` / `space-6` |
| Form field gap | `space-3` between label/control, `space-4` between fields |
| Section spacing | `space-6` / `space-8` |
| Grid gap | `space-3` (mobile) → `space-4` (desktop) |

### 2.4 Radius

| Token | Value | Use |
|-------|-------|-----|
| `--kr-radius-sm` | 4px | small chips, inner elements |
| `--kr-radius-md` | 8px | **inputs and buttons** |
| `--kr-radius-card` | 12px | cards |
| `--kr-radius-lg` | 16px | large containers, dialogs |
| `--kr-radius-full` | 9999px | pills, avatars, switches |

### 2.5 Shadow (minimal, purposeful)

`--kr-shadow-xs` / `-sm` / `-md`. Cards are **flat by default** (border carries separation);
`elevation="raised"` opts into `-sm`. Dark theme increases opacity and leans on borders instead.

### 2.6 Motion

| Token | Value |
|-------|-------|
| `--kr-motion-fast` | 120ms |
| `--kr-motion-base` | 200ms |
| `--kr-ease-standard` | `cubic-bezier(0.2, 0, 0.2, 1)` |

All motion is suppressed under `prefers-reduced-motion: reduce` (global CSS rule + per-component
`motion-reduce:` variants). No animation library is used.

### 2.7 Layout & responsive

| Token | Value |
|-------|-------|
| `--kr-container-sm` | 640px |
| `--kr-container-md` | 768px |
| `--kr-container-lg` | 1024px |
| `--kr-container-xl` | 1200px |
| `--kr-container-2xl` | 1440px |
| `--kr-touch-target` | 44px |
| `--kr-focus-width` | 2px |
| `--kr-focus-offset` | 2px |

Breakpoints use Tailwind defaults: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.

### 2.8 Component tokens (examples)

| Token | Purpose |
|-------|---------|
| `--kr-btn-primary-bg` / `-fg` / `-bg-hover` / `-bg-active` | primary button |
| `--kr-btn-danger-solid` / `-fg` | danger button (guaranteed contrast) |
| `--kr-input-bg` / `-border` / `-fg` / `-placeholder` / `-border-focus` / `-border-error` | inputs |
| `--kr-card-bg` / `-border` / `-radius` / `-padding` | cards |
| `--kr-nav-bg` / `-item-fg` / `-item-selected-bg` / `-item-selected-fg` | navigation |
| `--kr-table-header-bg` / `-row-hover` | tables |
| `--kr-skeleton-bg` / `-shine` | loading placeholders |
| `--kr-tooltip-bg` / `-fg` | tooltips |

---

## 3. Tailwind mapping

Tokens are exposed to Tailwind utilities in `frontend/tailwind.config.ts`:

```ts
const token = (n: string) => `var(--kr-${n})`;
colors: {
  bg: token("bg"),
  surface: { DEFAULT: token("surface"), muted: token("surface-muted"), ... },
  fg: { DEFAULT: token("fg"), body: token("fg-body"), muted: token("fg-muted"), ... },
  primary: { DEFAULT: token("primary"), text: token("primary-text"), ... },
  success: { DEFAULT: token("success"), bg: token("success-bg") },
  ...
}
```

So `bg-surface`, `text-fg-body`, `border-border-strong`, `ring-ring` all resolve to the active
theme automatically.

> **Content globs must include `../packages/ui/src/**/*.{ts,tsx}`** — otherwise classes used only
> inside the shared components are purged.

---

## 4. Rules for contributors & agents

1. **Never hardcode a colour, spacing, radius, shadow, or duration.** Use a token (via Tailwind
   utility or `var(--kr-*)`).
2. **Never reference primitive tokens** (`--kr-color-*`) in components — use semantic ones.
3. **Never create a second token file** in an app. `packages/ui/styles/tokens.css` is the only one.
4. New visual values require updating the token file **and** the contrast validator if they are
   text/UI colours.
5. Theme differences are expressed **only** in the `[data-theme="dark"]` block.
6. Component-specific colours belong in the component-token section, built from semantic tokens.
