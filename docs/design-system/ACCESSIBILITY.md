# KRISHIMA — Accessibility

- **Standard:** **WCAG 2.2 Level AA**
- **Version:** 1.0 (Phase 2)
- **Verification:** automated (axe) **plus** manual keyboard/contrast review — see
  [validation report](../testing/DESIGN_SYSTEM_VALIDATION_REPORT.md).

> Automated tools catch roughly a third of issues. **Passing axe does not mean "accessible".**
> The manual checks in §4 are mandatory for every feature.

---

## 1. Contrast (WCAG 1.4.3 / 1.4.11)

| Content | Minimum | Our status |
|---------|---------|------------|
| Normal text (< 18.66px bold / 24px) | 4.5:1 | Verified — all 48 required pairs pass |
| Large text | 3:1 | Verified |
| UI component boundaries & states | 3:1 | Input borders verified at 3.93:1 (light), 4.78:1 (dark) |
| Focus indicator | 3:1 against adjacent colours | Verified 6.77:1 / 12.91:1 |

Run the live check at any time:

```bash
python3 scripts/check_design_contrast.py   # exits non-zero on failure
```

**Decorative borders are not input boundaries.** `--kr-border` (light `#DCE5D9` ≈ 1.2:1) is used
for card and section separators only; inputs always use `--kr-border-strong` (`#768478`).

**Gold `#D5A13A` is decorative only** — 2.1:1 on white. It is never used for body text on light
surfaces.

---

## 2. Colour independence (1.4.1)

- `StatusBadge` always renders a glyph **and** a text label.
- `Alert` includes an icon plus a screen-reader tone word ("Error:", "Warning:" …).
- `StatisticCard` deltas include a ▲/▼/■ glyph and text.
- Charts require a text `summary` (`ChartContainer`), rendered as a `role="img"` label and a
  visually hidden description.
- Form errors appear as text, not just a red border.

---

## 3. Keyboard & focus (2.1.1 / 2.4.7 / 2.4.3)

- Every interactive element is reachable with Tab and operable with Enter/Space.
- **Visible focus** is enforced globally (`:focus-visible` → 2px ring + 2px offset). It is never
  removed; components style it consistently.
- Focus order follows DOM order; no positive `tabindex` is used anywhere.
- **Tabs**: roving tabindex; Arrow keys/Home/End move selection.
- **DropdownMenu**: Enter/Space opens, arrows move, Escape closes and returns focus to trigger.
- **Dialog/Drawer**: native `<dialog>` traps focus, Escape closes, focus returns to the opener.
- Skip links are required on pages with large navigation (add per page when nav exists).

---

## 4. Manual checks required per feature

1. Tab through the whole page — visible focus on every control, logical order.
2. Operate every control with the keyboard only.
3. Zoom to 200% and to 400% — no clipped text, no horizontal page scroll.
4. Screen-reader spot check (VoiceOver/NVDA): names, roles, states, errors announced.
5. Check colour independence by viewing the page in greyscale.
6. Confirm all six data states exist (loading, empty, error, success, disabled, permission-limited).

---

## 5. Forms (1.3.1 / 3.3.1 / 3.3.2 / 4.1.3)

- Every control has a programmatic label (`<label for>` or wrapping label).
- Hints and errors are linked with `aria-describedby`.
- Invalid fields set `aria-invalid="true"`; the error text uses `role="alert"`.
- Required fields are marked visually **and** with the native `required` attribute.
- Errors describe **what happened and what to do next**, in plain language.
- Inputs are never identified by placeholder alone.

---

## 6. Motion & timing (2.3.3 / 2.2.2)

- `prefers-reduced-motion: reduce` disables animations and smooth scrolling globally and
  per-component (`motion-reduce:` variants).
- No content auto-advances; toasts persist 5s (errors 8s) and are dismissible by expiry.
- No animation library is used.

---

## 7. Target size (2.5.8 — AA in WCAG 2.2)

Interactive targets are at least **24×24 CSS px** by requirement, and KRISHIMA standardises on
**44×44** (`--kr-touch-target`) for primary controls, form fields, navigation items and switches.
Verified in the responsive pass — no undersized targets remain in the preview page.

---

## 8. Structure & semantics (1.3.1 / 2.4.6 / 4.1.2)

- Landmarks: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` used appropriately.
- One `<h1>` per page; heading levels never skip.
- Tables use `<th scope>`, `<caption>`; `DataTable` provides a visually hidden caption.
- Icon-only buttons require `aria-label` (enforced by the `IconButton` type).
- Decorative icons are `aria-hidden="true"`.
- Live regions: toasts (`aria-live="polite"`, errors `role="alert"`), auth status messages.

---

## 9. Multilingual accessibility

- `lang` is set on `<html>` (`en-IN`); Hindi content carries `lang="hi"`.
- Devanagari uses a taller line-height and its own font family.
- Layouts tolerate 30–40% text expansion without clipping.

---

## 10. Known limitations

- No screen-reader testing has been executed on a physical device yet (automated + keyboard only).
- Skip links are not yet implemented (no navigable product pages exist in Phase 2).
- Chart components provide a text summary but no data-table alternative yet.
- WCAG 2.2 **AAA** is not targeted.
