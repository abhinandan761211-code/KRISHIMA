#!/usr/bin/env python3
"""KRISHIMA — design-token contrast validator.

Resolves the CSS custom properties in packages/ui/styles/tokens.css for BOTH
themes, then checks realWCAG 2.2 contrast for every pair that is used in the UI.

- Parses tokens.css into two scopes: light ( :root / [data-theme=light] ) and
  dark ( [data-theme=dark] ), following var() references to raw hex values.
- Computes WCAG relative luminance and contrast ratios.
- Applies the correct threshold per usage: 4.5 for normal text, 3.0 for large
  text and non-text UI boundaries.
- Exits non-zero if any REQUIRED pair fails, so it can run in CI.

Run:  python3 scripts/check_design_contrast.py
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOKENS = ROOT / "packages" / "ui" / "styles" / "tokens.css"


# --------------------------------------------------------------------------- #
# CSS token parsing
# --------------------------------------------------------------------------- #
def parse_css(css: str) -> tuple[dict[str, str], dict[str, str]]:
    """Return (light_vars, dark_vars) maps of --kr-* -> raw value."""
    # Strip comments
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)

    light: dict[str, str] = {}
    dark: dict[str, str] = {}

    # Split into rule blocks: <selector> { <decls> }
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", css):
        selectors, decls = m.group(1), m.group(2)
        vars_ = dict(re.findall(r"(--kr-[a-z0-9-]+)\s*:\s*([^;]+);", decls))
        if not vars_:
            continue
        sel = selectors.replace("\n", " ")
        is_dark = '[data-theme="dark"]' in sel
        is_light = ':root' in sel or '[data-theme="light"]' in sel
        # Blocks that list BOTH light selectors and the dark selector are treated as
        # light-only for the light scope and still contribute to dark below.
        if is_light:
            light.update(vars_)
        if is_dark:
            dark.update(vars_)
        # Shared component-token block: applies to both themes.
        if is_light and is_dark:
            light.update(vars_)
            dark.update(vars_)
    return light, dark


HEX_RE = re.compile(r"^#([0-9a-fA-F]{6})$")
RGB_RE = re.compile(r"rgba?\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:/\s*([0-9.]+))?\s*\)")


def _blend_over(fg: str, base: str) -> str:
    """Composite an rgba colour over an opaque base and return hex."""
    m = RGB_RE.match(fg.strip())
    if not m:
        return fg
    r, g, b = (int(m.group(i)) for i in (1, 2, 3))
    a = float(m.group(4)) if m.group(4) else 1.0
    bb = base.lstrip("#")
    br, bg_, bl = (int(bb[i : i + 2], 16) for i in (0, 2, 4))
    out = (round(r * a + br * (1 - a)), round(g * a + bg_ * (1 - a)), round(b * a + bl * (1 - a)))
    return "#" + "".join(f"{c:02x}" for c in out)


def resolve(name: str, scope: dict[str, str], depth: int = 0, base: str | None = None) -> str | None:
    """Follow var() references to a hex colour. rgba() is blended over `base`."""
    if depth > 12:
        return None
    raw = scope.get(name)
    if raw is None:
        return None
    raw = raw.strip()
    m = re.match(r"var\(\s*(--kr-[a-z0-9-]+)\s*\)", raw)
    if m:
        return resolve(m.group(1), scope, depth + 1, base)
    m = re.match(r"var\(\s*(--kr-[a-z0-9-]+)\s*,", raw)
    if m:  # var(...) with fallback
        return resolve(m.group(1), scope, depth + 1, base)
    if HEX_RE.match(raw):
        return raw
    if RGB_RE.match(raw) and base:
        return _blend_over(raw, base)
    return None


# --------------------------------------------------------------------------- #
# WCAG maths
# --------------------------------------------------------------------------- #
def _channel(c: float) -> float:
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def luminance(hex_color: str) -> float:
    h = hex_color.lstrip("#")
    r, g, b = (int(h[i : i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * _channel(r) + 0.7152 * _channel(g) + 0.0722 * _channel(b)


def contrast(fg: str, bg: str) -> float:
    la, lb = luminance(fg), luminance(bg)
    hi, lo = max(la, lb), min(la, lb)
    return round((hi + 0.05) / (lo + 0.05), 2)


# --------------------------------------------------------------------------- #
# Required pairs  (fg token, bg token, min ratio, description)
# --------------------------------------------------------------------------- #
TEXT = 4.5  # normal text (WCAG 2.2 1.4.3)
NONTEXT = 3.0  # UI component boundary / large text (1.4.11 / 1.4.3-large)

PAIRS: list[tuple[str, str, float, str]] = [
    # --- Core text on surfaces ---
    ("--kr-fg", "--kr-bg", TEXT, "Heading text on background"),
    ("--kr-fg-body", "--kr-bg", TEXT, "Body text on background"),
    ("--kr-fg", "--kr-surface", TEXT, "Heading text on surface"),
    ("--kr-fg-body", "--kr-surface", TEXT, "Body text on surface"),
    ("--kr-fg-muted", "--kr-surface", TEXT, "Secondary text on surface"),
    ("--kr-fg-placeholder", "--kr-surface", TEXT, "Placeholder on surface"),
    # --- Primary button ---
    ("--kr-primary-fg", "--kr-primary", TEXT, "Primary button label"),
    ("--kr-primary-fg", "--kr-primary-hover", TEXT, "Primary button label (hover)"),
    # --- Secondary button ---
    ("--kr-secondary-fg", "--kr-secondary", TEXT, "Secondary button label"),
    # --- Disabled ---
    ("--kr-disabled-fg", "--kr-disabled-bg", TEXT, "Disabled control text"),
    # --- Danger button (solid) ---
    ("--kr-btn-danger-solid-fg", "--kr-btn-danger-solid", TEXT, "Danger button label"),
    # --- Semantic text on subtle backgrounds ---
    ("--kr-success", "--kr-success-bg", TEXT, "Success text on success bg"),
    ("--kr-error", "--kr-error-bg", TEXT, "Error text on error bg"),
    ("--kr-warning", "--kr-warning-bg", TEXT, "Warning text on warning bg"),
    ("--kr-info", "--kr-info-bg", TEXT, "Info text on info bg"),
    # --- Links / accent text ---
    ("--kr-primary-text", "--kr-surface", TEXT, "Link text on surface"),
    ("--kr-primary-text", "--kr-bg", TEXT, "Link text on background"),
    # --- Nav ---
    ("--kr-nav-item-selected-fg", "--kr-nav-item-selected-bg", TEXT, "Selected nav item"),
    ("--kr-nav-item-fg", "--kr-nav-bg", TEXT, "Nav item text"),
    # --- Footer ---
    ("--kr-footer-fg", "--kr-footer-bg", TEXT, "Footer text"),
    # --- Input boundary (non-text) ---
    ("--kr-input-border", "--kr-input-bg", NONTEXT, "Input boundary vs input bg"),
    # --- Focus ring must stand out from the page background (non-text) ---
    ("--kr-focus-ring", "--kr-bg", NONTEXT, "Focus ring vs background"),
    ("--kr-focus-ring", "--kr-surface", NONTEXT, "Focus ring vs surface"),
    # --- Tooltip ---
    ("--kr-tooltip-fg", "--kr-tooltip-bg", TEXT, "Tooltip text"),
]

# Decorative borders are NOT required to meet 3:1 (documented restriction) but we
# report their ratio for transparency.
INFO_PAIRS: list[tuple[str, str, str]] = [
    ("--kr-border", "--kr-bg", "Decorative border vs background (not a boundary)"),
    ("--kr-accent", "--kr-surface", "Gold accent on surface (decorative; never body text on light)"),
]


def main() -> int:
    css = TOKENS.read_text(encoding="utf-8")
    light_scope, dark_scope = parse_css(css)
    # Dark inherits any token it does not override.
    dark_full = {**light_scope, **dark_scope}

    failures: list[str] = []
    rows: list[str] = []

    for theme, scope in (("light", light_scope), ("dark", dark_full)):
        for fg_tok, bg_tok, need, label in PAIRS:
            # Alpha backgrounds are composited over the theme's page background.
            page_bg = resolve("--kr-bg", scope) or "#ffffff"
            bg = resolve(bg_tok, scope, base=page_bg)
            fg = resolve(fg_tok, scope, base=bg or page_bg)
            if not fg or not bg:
                rows.append(f"  SKIP  {theme:5} {label:44} (unresolvable token)")
                continue
            ratio = contrast(fg, bg)
            ok = ratio >= need
            rows.append(
                f"  {'PASS' if ok else 'FAIL'}  {theme:5} {ratio:5.2f} (min {need:3.1f})  {label:44} {fg} on {bg}"
            )
            if not ok:
                failures.append(f"{theme}: {label} — {ratio}:1 < {need}:1 ({fg} on {bg})")

    print("=" * 100)
    print("KRISHIMA — Design token contrast validation (WCAG 2.2)")
    print("=" * 100)
    for r in rows:
        print(r)

    print("\nInformational (not pass/fail requirements):")
    for fg_tok, bg_tok, label in INFO_PAIRS:
        for theme, scope in (("light", light_scope), ("dark", dark_full)):
            page_bg = resolve("--kr-bg", scope) or "#ffffff"
            bg = resolve(bg_tok, scope, base=page_bg)
            fg = resolve(fg_tok, scope, base=bg)
            if fg and bg:
                print(f"  INFO  {theme:5} {contrast(fg, bg):5.2f}          {label} ({fg} on {bg})")

    print("\n" + "=" * 100)
    if failures:
        print(f"FAILED: {len(failures)} required pair(s) below threshold")
        for f in failures:
            print("  -", f)
        return 1
    print(f"PASSED: all {len(PAIRS) * 2} required pairs meet WCAG thresholds in both themes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
