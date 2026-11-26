#!/usr/bin/env python3
"""Generate the KRISHIMA public-website artwork as ORIGINAL SVG illustrations.

Why generated artwork instead of stock photography
--------------------------------------------------
Blocker B-7: the previous hero and social images were stock photographs with no
recorded source, author or licence, and no metadata that could recover it. Using
them would have been an unresolved licensing risk on a commercial site.

These illustrations are produced by this script from simple geometric shapes and
the KRISHIMA brand palette. They are original works commissioned for this project:
there is no third-party rights holder, so no attribution and no licence fee apply.
The output is deterministic (same input -> same bytes), so it can be regenerated
and reviewed.

What this preserves
-------------------
- Responsive behaviour: the hero `<picture>` still selects by media query. SVG is
  resolution-independent, so the 800/1600 sources now differ only in framing.
- Accessibility: every image keeps its `alt` text from the i18n catalogue.
- Performance: SVG is a few KB and compresses far better than JPEG.

Usage
-----
    python3 frontend/scripts/generate-artwork.py
Writes into frontend/public/images/. Re-run after changing a palette or layout.
"""
from __future__ import annotations

from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "public" / "images"

# Brand palette (matches packages/ui/styles/tokens.css). Hard-coded here on
# purpose: this is an asset generator, not UI code, and it must not depend on
# the app's CSS custom properties.
GREEN_700 = "#15803D"
GREEN_800 = "#166534"
GREEN_900 = "#14532D"
GREEN_300 = "#86EFAC"
GREEN_100 = "#DCFCE7"
GOLD = "#D5A13A"
SKY_TOP = "#EAF4E6"
SKY_BOTTOM = "#F7FAF5"


def hero(width: int = 1600, height: int = 900, *, narrow: bool = False) -> str:
    """A morning field: sky, sun, layered hills, and a cultivated foreground.

    Deliberately abstract and flat — it must read as 'agriculture' at a glance
    without pretending to be a photograph of a specific place.

    Composition is three horizontal bands (sky / distant hills / field) plus
    evenly spaced crop rows drawn in perspective. An earlier version fanned every
    row from one vanishing point, which piled into an opaque dark wedge; separate
    bands keep the image calm and legible at every size.
    """
    horizon = height * 0.58
    sun_x = width * (0.72 if not narrow else 0.68)
    sun_y = height * 0.24
    sun_r = height * 0.10

    # Distant hills: two soft overlapping arcs.
    hills = (
        f'<path d="M0 {horizon:.0f} Q {width * 0.22:.0f} {horizon - height * 0.10:.0f} '
        f'{width * 0.46:.0f} {horizon - height * 0.03:.0f} T {width:.0f} {horizon - height * 0.01:.0f} '
        f'V {horizon + 4:.0f} H 0 Z" fill="{GREEN_300}" opacity="0.55"/>\n'
        f'  <path d="M0 {horizon + height * 0.02:.0f} Q {width * 0.3:.0f} {horizon - height * 0.05:.0f} '
        f'{width * 0.62:.0f} {horizon + height * 0.01:.0f} T {width:.0f} {horizon:.0f} '
        f'V {horizon + 8:.0f} H 0 Z" fill="{GREEN_700}" opacity="0.35"/>'
    )

    # Field: a solid band, then evenly spaced furrows that widen toward the viewer.
    field_top = horizon + height * 0.03
    furrows = []
    n = 7
    for i in range(1, n + 1):
        t = i / n
        y = field_top + (height - field_top) * (t ** 1.35)
        # Slight curvature reads as a ploughed row rather than a ruler line.
        bow = 6 * t
        furrows.append(
            f'<path d="M0 {y - bow:.0f} Q {width * 0.5:.0f} {y + bow:.0f} {width:.0f} {y - bow:.0f}" '
            f'stroke="{GREEN_800}" stroke-width="{1.5 + 3 * t:.1f}" fill="none" opacity="{0.10 + 0.12 * t:.2f}"/>'
        )

    # Crop tufts standing along the nearest furrow — small, even, not scattered.
    tufts = []
    count = 22
    base_y = field_top + (height - field_top) * 0.52
    for i in range(count):
        x = width * (0.03 + 0.94 * (i / (count - 1)))
        h = height * 0.045 * (0.75 + 0.5 * ((i * 7) % 5) / 5)
        tufts.append(
            f'<path d="M{x:.0f} {base_y:.0f} q {h * 0.22:.0f} {-h * 0.7:.0f} 0 {-h:.0f} " '
            f'stroke="{GREEN_900}" stroke-width="{max(2, h * 0.12):.1f}" fill="none" '
            f'stroke-linecap="round" opacity="0.62"/>'
        )

    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}" role="img" aria-label="Abstract illustration of a morning field with a rising sun and rows of crops">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{SKY_TOP}"/>
      <stop offset="1" stop-color="{SKY_BOTTOM}"/>
    </linearGradient>
    <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="{GOLD}" stop-opacity="0.38"/>
      <stop offset="1" stop-color="{GOLD}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="field" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{GREEN_300}"/>
      <stop offset="0.55" stop-color="{GREEN_300}" stop-opacity="0.9"/>
      <stop offset="1" stop-color="{GREEN_700}" stop-opacity="0.55"/>
    </linearGradient>
    <!-- Furrows intentionally run edge to edge; the clip keeps them on canvas. -->
    <clipPath id="frame">
      <rect width="{width}" height="{height}"/>
    </clipPath>
  </defs>

  <g clip-path="url(#frame)">
    <rect width="{width}" height="{height}" fill="url(#sky)"/>
    <circle cx="{sun_x:.0f}" cy="{sun_y:.0f}" r="{sun_r * 2.8:.0f}" fill="url(#sunGlow)"/>
    <circle cx="{sun_x:.0f}" cy="{sun_y:.0f}" r="{sun_r:.0f}" fill="{GOLD}" opacity="0.9"/>

    {hills}

    <rect x="0" y="{field_top:.0f}" width="{width}" height="{height - field_top:.0f}" fill="url(#field)"/>
    {chr(10).join('  ' + f for f in furrows)}
    {chr(10).join('  ' + t for t in tufts)}
  </g>
</svg>
'''


def og_card(width: int = 1200, height: int = 630) -> str:
    """Social-sharing card: brand wordmark, tagline band, and a field motif.

    Text is rendered as vector paths-free plain <text>; it is Latin-only here
    (brand name + one line), so no font-subsetting concern arises.
    """
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}" role="img" aria-label="KRISHIMA — one platform for Indian agriculture">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="{GREEN_900}"/>
      <stop offset="1" stop-color="{GREEN_800}"/>
    </linearGradient>
  </defs>
  <rect width="{width}" height="{height}" fill="url(#bg)"/>

  <!-- field motif -->
  <path d="M0 {height * 0.74:.0f} Q {width * 0.28:.0f} {height * 0.62:.0f} {width * 0.55:.0f} {height * 0.74:.0f}
           T {width:.0f} {height * 0.7:.0f} V {height} H 0 Z" fill="{GREEN_700}" opacity="0.55"/>
  <path d="M0 {height * 0.84:.0f} Q {width * 0.35:.0f} {height * 0.76:.0f} {width * 0.7:.0f} {height * 0.86:.0f}
           T {width:.0f} {height * 0.82:.0f} V {height} H 0 Z" fill="{GREEN_900}" opacity="0.8"/>
  <circle cx="{width * 0.85:.0f}" cy="{height * 0.22:.0f}" r="{height * 0.09:.0f}" fill="{GOLD}" opacity="0.8"/>

  <text x="80" y="{height * 0.42:.0f}" font-family="Inter, Helvetica, Arial, sans-serif"
        font-size="104" font-weight="700" letter-spacing="-2">
    <tspan fill="{GREEN_300}">KRISHI</tspan><tspan fill="#FFFFFF">MA</tspan>
  </text>
  <text x="82" y="{height * 0.55:.0f}" font-family="Inter, Helvetica, Arial, sans-serif"
        font-size="34" fill="{GREEN_100}" opacity="0.92">one platform for Indian agriculture</text>
</svg>
'''


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    files = {
        # Hero: same artwork, two framings so the <picture> element keeps working.
        "hero-farm-800.svg": hero(800, 450, narrow=True),
        "hero-farm-1600.svg": hero(1600, 900),
        "og-default.svg": og_card(),
    }
    for name, content in files.items():
        path = OUT / name
        path.write_text(content, encoding="utf-8")
        print(f"wrote {path.relative_to(OUT.parent.parent.parent)} ({len(content)} bytes)")


if __name__ == "__main__":
    main()
