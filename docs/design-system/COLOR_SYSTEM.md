# KRISHIMA — Colour System

- **Version:** 1.0 (Phase 2)
- **Source of truth:** [`packages/ui/styles/tokens.css`](../../packages/ui/styles/tokens.css)
- **Validator:** [`scripts/check_design_contrast.py`](../../scripts/check_design_contrast.py) (CI-runnable)

---

## 1. Three token levels

| Level | Prefix | Example | Rule |
|-------|--------|---------|------|
| **Primitive** | `--kr-color-*` | `--kr-color-green-700: #15803d` | Raw palette. **Never use in components.** |
| **Semantic** | `--kr-bg`, `--kr-fg`, `--kr-primary` | `--kr-fg-body: #374151` | What components consume. Theme-switchable. |
| **Component** | `--kr-btn-*`, `--kr-input-*`, `--kr-nav-*` | `--kr-btn-primary-bg` | Per-component defaults built from semantic tokens. |

Components use **semantic or component** tokens only. Raw hex in application code is a review
defect (lint/review enforced).

---

## 2. Light theme (default)

| Role | Token | Value |
|------|-------|-------|
| Main background | `--kr-bg` | `#F7FAF5` |
| Surface (cards) | `--kr-surface` | `#FFFFFF` |
| Muted surface | `--kr-surface-muted` | `#E8F3E8` |
| Secondary surface | `--kr-surface-secondary` | `#F3F4F6` |
| Primary text | `--kr-fg` | `#171717` |
| Body text | `--kr-fg-body` | `#374151` |
| Secondary text | `--kr-fg-muted` | `#4B5563` |
| Placeholder | `--kr-fg-placeholder` | `#6B7280` |
| Decorative border | `--kr-border` | `#DCE5D9` |
| Input border | `--kr-border-strong` | `#768478` |
| Primary button | `--kr-primary` | `#15803D` |
| Primary button text | `--kr-primary-fg` | `#FFFFFF` |
| Hover | `--kr-primary-hover` | `#166534` |
| Active | `--kr-primary-active` | `#14532D` |
| Disabled bg | `--kr-disabled-bg` | `#E5E7EB` |
| Secondary button | `--kr-secondary` | `#E8F3E8` |
| Secondary button text | `--kr-secondary-fg` | `#166534` |
| Focus ring | `--kr-focus-ring` | `#166534` |
| Disabled text | `--kr-disabled-fg` | `#4B5563` |
| Footer | `--kr-footer-bg` | `#14532D` |
| Decorative accent | `--kr-accent` | `#D5A13A` |

### Semantic (light)

| Role | Token | Value |
|------|-------|-------|
| Success | `--kr-success` / `--kr-success-bg` | `#166534` / `#DCFCE7` |
| Error | `--kr-error` / `--kr-error-bg` | `#B91C1C` / `#FEE2E2` |
| Warning | `--kr-warning` / `--kr-warning-bg` | `#92400E` / `#FEF3C7` |
| Information | `--kr-info` / `--kr-info-bg` | `#1D4ED8` / `#DBEAFE` |

---

## 3. Dark theme

| Role | Token | Value |
|------|-------|-------|
| Main background | `--kr-bg` | `#121714` |
| Surface | `--kr-surface` | `#1E2721` |
| Muted surface | `--kr-surface-muted` | `#253D2D` |
| Brand accent | `--kr-accent` | `#86EFAC` |
| Primary button | `--kr-primary` | `#15803D` (unchanged — brand stays stable) |
| Primary button text | `--kr-primary-fg` | `#FFFFFF` |
| Heading | `--kr-fg` | `#F3F4F6` |
| Body | `--kr-fg-body` | `#D1D5DB` |
| Secondary text | `--kr-fg-muted` | `#B5C5BB` |
| Placeholder | `--kr-fg-placeholder` | `#A3B5A8` |
| Decorative border | `--kr-border` | `#415447` |
| Input border | `--kr-border-strong` | `#829487` |
| Focus ring | `--kr-focus-ring` | `#86EFAC` |
| Logo "MA" | `--kr-logo-ma` | `#FFFFFF` |
| Success | `--kr-success` | `#86EFAC` |
| Error | `--kr-error` | `#FCA5A5` |
| Warning | `--kr-warning` | `#FCD34D` |
| Information | `--kr-info` | `#93C5FD` |

**Defined additionally for dark** (required by the brief, not in the base list):

| Concern | Dark value / approach |
|---------|----------------------|
| Secondary button | bg `#253D2D`, hover `#415447`, text `#86EFAC` |
| Hover states | surfaces step one ramp lighter (`#1E2721 → #253D2D`) |
| Disabled | bg `#253D2D`, text `#A3B5A8`, border `#415447` |
| Overlay / modal scrim | `rgb(0 0 0 / 0.6)` |
| Tooltip | bg `--kr-fg` (light gray), text `--kr-bg` |
| Semantic backgrounds | 15% alpha of the semantic hue over the surface |
| Tables | header `#253D2D`, row hover `#253D2D`, border `#415447` |
| Dropdowns | surface `#1E2721`, border `#415447`, shadow `0 4px 12px rgb(0 0 0/.5)` |
| Charts | `#4ADE80`, `#93C5FD`, `#FCD34D`, `#5EEAD4`, `#D8B4FE` |
| Selection | bg `rgb(134 239 172 / .16)`, text `#86EFAC` |

### Important dark-mode deviations (documented, deliberate)

1. **`--kr-primary-active` is `#86EFAC` in dark**, not `#14532D`. `#14532D` on a `#121714`
   background is ~1.6:1 — unusable as text. The pressed state of a *filled* button still uses
   `--kr-primary-hover`; `primary-active` is used only where the token tints **text**.
2. **Danger buttons do not use `--kr-error` as a fill.** In dark, `--kr-error` is the light-red
   `#FCA5A5`; white text on it is 1.9:1. Buttons use `--kr-btn-danger-solid` (`#B91C1C`, white
   text = 6.47:1); `--kr-error` remains the *text/icon* colour on dark surfaces.
3. **Semantic backgrounds use alpha**, because Solid light tints (`#FEE2E2`) would be unreadable
   behind light text. The validator composites them over the page background before measuring.

---

## 4. Module accents

Used **only** for icons, small labels, category chips and limited highlights. Never for primary
buttons or navigation. Each has a theme-specific variant that passes ≥4.5:1 on its theme's
background.

| Module | Light | Dark |
|--------|-------|------|
| Farmer | `#15803D` | `#4ADE80` |
| Buyer | `#1D4ED8` | `#93C5FD` |
| Retailer | `#B45309` | `#FCD34D` |
| Worker | `#0E7490` | `#67E8F9` |
| Equipment owner | `#C2410C` | `#FB923C` |
| Transporter | `#4338CA` | `#A5B4FC` |
| Warehouse | `#475569` | `#CBD5E1` |
| Creator | `#7E22CE` | `#D8B4FE` |
| Community | `#0F766E` | `#5EEAD4` |
| Administration | `#334155` | `#CBD5E1` |

> The brief supplied one value per module. On the dark background the light values fall below
> 4.5:1 (e.g. Buyer `#1D4ED8` ≈ 2.6:1), so the lighter variants above are the **accessible
> dark counterparts**. The light values are unchanged and remain the canonical brand reference.

---

## 5. Usage restrictions

| Rule | Reason |
|------|--------|
| `#D5A13A` (gold) must **not** be body text on light surfaces | 2.1:1 on white — decorative only |
| `#DCE5D9` / `#415447` decorative borders are **not** input boundaries | 1.2:1 / 1.6:1 — too low for 3:1 non-text contrast |
| Inputs always use `--kr-border-strong` | `#768478` (light) and `#829487` (dark) meet 3:1 |
| Status is never colour-only | Always pair with icon + text (WCAG 1.4.1) |
| No neon / excessive gradients | Brand and accessibility brief |

---

## 6. Verified contrast

`python3 scripts/check_design_contrast.py` resolves every token pair for both themes and applies
the correct threshold (4.5 text / 3.0 non-text). Current result:

```
PASSED: all 48 required pairs meet WCAG thresholds in both themes.
```

Selected ratios:

| Pair | Light | Dark |
|------|-------|------|
| Body on background | 9.79:1 | 12.30:1 |
| Primary button label | 5.02:1 | 5.02:1 |
| Placeholder on surface | 4.83:1 | 7.12:1 |
| Error text on error bg | 5.30:1 | 7.16:1 |
| Danger button label | 6.47:1 | 6.47:1 |
| Input border vs input bg | 3.93:1 | 4.78:1 |
| Focus ring vs background | 6.77:1 | 12.91:1 |
| Link text on surface | 5.02:1 | 10.94:1 |

Full output is captured in
[`docs/testing/DESIGN_SYSTEM_VALIDATION_REPORT.md`](../testing/DESIGN_SYSTEM_VALIDATION_REPORT.md).
