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
        # The hero is a licensed photograph (see docs/assets/IMAGE_LICENSES.md);
        # only the social card is generated, because it is typographic and needs
        # to match the brand exactly.
        "og-default.svg": og_card(),
    }
    for name, content in files.items():
        path = OUT / name
        path.write_text(content, encoding="utf-8")
        print(f"wrote {path.relative_to(OUT.parent.parent.parent)} ({len(content)} bytes)")


if __name__ == "__main__":
    main()
