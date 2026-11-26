# KRISHIMA — Image Licenses

- **Last updated:** 2026-11-26
- **Scope:** every image shipped by the public website (`frontend/public/images/`)
- **Status:** the hero photograph (the landing-page banner) **has unverified
  provenance and is a blocker** — see §8. The social card is an original work.
  **No unverified image should ship.**

---

## 1. Summary

| File | Title | Creator | Licence | Commercial use | Attribution | Verified |
|------|-------|---------|---------|----------------|-------------|----------|
| `hero-banner-1600.jpg` | Two farmers with a laptop in a wheat field | Unknown (Adobe Stock asset `240_F_1468634671`) | Unknown | **Unknown** | **Unknown** | **Unverified — blocker** |
| `hero-banner-1600.webp` | same, WebP | Unknown | Unknown | **Unknown** | **Unknown** | **Unverified — blocker** |
| `hero-banner-800.jpg` | same, 800px | Unknown | Unknown | **Unknown** | **Unknown** | **Unverified — blocker** |
| `hero-banner-800.webp` | same, 800px WebP | Unknown | Unknown | **Unknown** | **Unknown** | **Unverified — blocker** |
| `og-default.svg` | Social sharing card | KRISHIMA project (generated) | Original work, project-owned | Yes | None required | **Verified** |

## 2. Hero photography — full record

| Field | Value |
|-------|-------|
| **File paths** | `frontend/public/images/hero-banner-1600.{jpg,webp}`, `hero-banner-800.{jpg,webp}` |
| **Image title** | Two farmers standing in a wheat field, looking at a laptop together |
| **Original source URL** | **Not established** — supplied by the project owner as a downloaded file |
| **Direct asset** | **Not established** — the filename (`240_F_1468634671_fdKJOF2CdgXoa4AsGORBP24ACvOf3HCE.jpg`) and embedded EXIF (`software: Adobe Stock Platform`, resolution 300 dpi) indicate an **Adobe Stock** asset |
| **Creator** | **Not established** |
| **Copyright owner** | **Not established** |
| **Licence type** | **Not established** — an Adobe Stock download needs a valid licence for the account, plan and use; that licence is not on file |
| **Commercial use permitted** | **Not established** |
| **Modification permitted** | **Not established** |
| **Attribution required** | **Not established** |
| **Verification status** | **Unverified — blocker (§8)** |

### Processing applied

- Source was 361×240 with a thin letterbox band top and bottom; the band was cropped
  away to a 361×203 (~16:9) strip — no content of the photograph was removed.
- Resized with Pillow (Lanczos) to 800×450 and 1600×900, re-encoded as progressive
  JPEG (q82) and WebP (q78). No filters, no compositing.
- Result: JPEG 115 KB / 44 KB, WebP 57 KB / 26 KB.
- **The 1600w files are upscaled from a 361px-wide source**, so they are soft on
  large screens. This is a source-quality limitation, not a processing choice.

## 3. Social card — original work

`og-default.svg` is produced by `frontend/scripts/generate-artwork.py` from geometric
primitives and the brand palette. No bitmap, no traced photograph, no third-party
asset. Generated deterministically; the generator is committed alongside the output.

```bash
python3 frontend/scripts/generate-artwork.py   # regenerates the social card
```

## 4. Images removed (blocker B-7)

These files were previously shipped and **have been deleted**. They were stock
photographs with **no recorded source, author, licence or attribution**, and no
embedded metadata from which provenance could be recovered.

| Removed file | Reason |
|--------------|--------|
| `hero-farm-800.jpg` (original) | Unverified provenance — no source, author, licence or EXIF metadata |
| `hero-farm-1600.jpg` (original) | Unverified provenance — no source, author, licence or EXIF metadata |
| `og-default.jpg` | Unverified provenance — no source, author, licence or EXIF metadata |
| `hero-farm-{800,1600}.{jpg,webp}` (Unsplash set) | Replaced on 2026-11-26 by the owner-supplied `hero-banner-*` files |

Nothing from the removed files is referenced anywhere in the codebase.

## 5. What was preserved when replacing them

| Requirement | Status |
|-------------|--------|
| Responsive image behaviour | **Preserved** — `<picture>` selects 800w below 640px, 1600w above; `srcSet`+`sizes` on the `<img>` fallback |
| Modern format | **Preserved** — WebP with JPEG fallback |
| Intrinsic dimensions (no layout shift) | **Preserved** — `width`/`height` retained (800×450 / 1600×900) |
| Accessibility | **Preserved** — `alt` still comes from the `hero.imageAlt` catalogue key, updated to describe the new photo |
| Performance | **Preserved** — 57 KB WebP vs 115 KB JPEG at 1600w |
| Provenance | **Regressed** — see §8 |

## 6. Adding a new image — the rule

Every new image must be recorded in §1 **before** it is merged, with:

1. file path; 2. image title; 3. original source URL; 4. creator / copyright owner;
5. licence type; 6. whether commercial use is permitted; 7. attribution requirements;
8. verification status.

**If any of those cannot be established, the image must not ship.**

## 7. Outstanding

- See §8 — the current hero banner is unlicensed/unverified and must be replaced or
  licensed before the site goes live.

## 8. Open blocker — hero banner provenance (added 2026-11-26)

The owner asked for an attached image to be set as the landing-page banner. The file
was added at `frontend/public/images/hero-banner-*.{jpg,webp}` and wired into
`HeroSection`. Its provenance could **not** be established:

- the filename matches the Adobe Stock download pattern (`240_F_<id>_<hash>.jpg`);
- embedded EXIF names `Adobe Stock Platform` as the software and 300 dpi as the
  resolution;
- there is no licence receipt, no asset page URL, and no creator on file.

**Required to clear:** record the Adobe Stock asset page URL, the licence ID/plan
that covers it, and the creator in §2, then change the §1 status to **Verified**. If
no licence exists, replace the file with a licensed or original photograph and delete
`hero-banner-*`.

The image is also only 361×240 natively, so the 1600w variant is an upscale; a
higher-resolution original should be supplied alongside the licence.
