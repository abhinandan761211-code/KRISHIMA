# KRISHIMA — Typography

- **Version:** 1.0 (Phase 2)
- **Tokens:** [`packages/ui/styles/tokens.css`](../../packages/ui/styles/tokens.css)
- **Component:** `Heading`, `Text`, `NumericText` in `@krishima/ui`

---

## 1. Typefaces

| Language | Family | Weights loaded |
|----------|--------|----------------|
| English (default) | **Inter** | 400, 500, 600, 700 |
| Hindi / Devanagari | **Noto Sans Devanagari** | 400, 500, 600 |
| Fallback | `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif` | — |
| Numeric / code | `ui-monospace, SFMono-Regular, Menlo, monospace` | — |

Loaded via a single `<link>` with `display=swap` and `preconnect`, so text is never invisible and
there is no layout shift. Only four weights are requested — no unnecessary font payload.

---

## 2. Scale

| Role | Token | Size / line-height | Weight | Component |
|------|-------|--------------------|--------|-----------|
| Display | `--kr-text-display` | 36 / 1.25 | 600 | `<Heading level={1} as="p">` |
| H1 | `--kr-text-h1` | 30 / 1.25 | 600 | `<Heading level={1}>` |
| H2 | `--kr-text-h2` | 24 / 1.25 | 600 | `<Heading level={2}>` |
| H3 | `--kr-text-h3` | 20 / 1.375 | 600 | `<Heading level={3}>` |
| H4 | `--kr-text-h4` | 18 / 1.375 | 600 | `<Heading level={4}>` |
| H5 | `--kr-text-h5` | 16 / 1.5 | 600 | `<Heading level={5}>` |
| H6 | `--kr-text-h6` | 14 / 1.5 | 600, uppercase | `<Heading level={6}>` |
| Body | `--kr-text-body` | **16 / 1.5** | 400 | `<Text>` |
| Small | `--kr-text-sm` | 14 / 1.5 | 400 | `<Text size="sm">` |
| Caption | `--kr-text-caption` | 12 / 1.5 | 400 | `<Text size="caption">` |
| Label | `--kr-text-label` | 14 / 1.5 | 500 | `<Label>` |
| Button | inherits `--kr-text-sm`/`body` | 14–15 | 500 | `<Button>` |
| Numeric | inherits body | — | 500, `tabular-nums` | `<NumericText>` |

**Body text is never smaller than 16px in farmer-facing interfaces.** 14px is reserved for dense
admin tables, captions and secondary metadata.

---

## 3. Multilingual rules

1. `:lang(hi)` / `[lang="hi"]` switches to `--kr-font-hindi` and `--kr-leading-relaxed` (1.625).
   Devanagari needs a taller line box for matras and conjuncts.
2. Allow **30–40% horizontal expansion** for Hindi. Never fix widths on text containers; use
   `min-w-0` + `truncate` only where truncation is acceptable, and wrap otherwise.
3. Do not bake text into images or SVG.
4. Numerals and currency follow the locale (`Intl.NumberFormat("en-IN")` → lakh/crore grouping).
5. Future languages (Marathi, Telugu, Tamil, Bengali, …) add a font family to the fallback chain
   and a `:lang()` rule; no component changes required.

---

## 4. Readability

- Maximum line length ~70ch for body copy.
- Headings keep semantic order (`h1 → h2 → h3`); never skip levels for visual size — use
  `<Heading level={2} as="h3">` to keep structure while adjusting appearance.
- Exactly **one `h1`** per page (typically `PageHeader`).
- Text resizes with browser zoom to 200% without clipping (no fixed-height text containers).

---

## 5. Usage

```tsx
import { Heading, Text, NumericText } from "@krishima/ui";

<Heading level={1}>My farm</Heading>
<Text>You have 3 orders awaiting dispatch.</Text>
<Text size="sm">Updated 2 minutes ago</Text>
<Text size="caption">Illustrative sample</Text>

<NumericText emphasis>₹1,24,500.00</NumericText>
```

**Do not** apply raw `font-size`/`font-family` in app code — use these components or the tokens.
