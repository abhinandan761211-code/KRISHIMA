# KRISHIMA — Image Licenses

- **Last updated:** 2026-11-26
- **Scope:** every image shipped by the public website (`frontend/public/images/`)
- **Status:** hero photography is licensed under the Unsplash License (commercial use
  permitted, attribution not required — credited anyway). The social card is an
  original work. **No unverified image ships.**

---

## 1. Summary

| File | Title | Creator | Licence | Commercial use | Attribution | Verified |
|------|-------|---------|---------|----------------|-------------|----------|
| `hero-farm-1600.jpg` | Wheat field during sunset | Jacek Ulinski | Unsplash License | **Yes** | Not required (credited) | **Verified** |
| `hero-farm-1600.webp` | same, WebP | Jacek Ulinski | Unsplash License | **Yes** | Not required (credited) | **Verified** |
| `hero-farm-800.jpg` | same, 800px | Jacek Ulinski | Unsplash License | **Yes** | Not required (credited) | **Verified** |
| `hero-farm-800.webp` | same, 800px WebP | Jacek Ulinski | Unsplash License | **Yes** | Not required (credited) | **Verified** |
| `og-default.svg` | Social sharing card | KRISHIMA project (generated) | Original work, project-owned | Yes | None required | **Verified** |

## 2. Hero photography — full record

| Field | Value |
|-------|-------|
| **File paths** | `frontend/public/images/hero-farm-1600.{jpg,webp}`, `hero-farm-800.{jpg,webp}` |
| **Image title** | "Brown wheat field during sunset" |
| **Original source URL** | https://unsplash.com/photos/brown-wheat-field-during-sunset-T6Dirfcmy0c |
| **Direct asset** | `https://images.unsplash.com/photo-1500382017468-9049fed747ef` |
| **Creator** | Jacek Ulinski |
| **Copyright owner** | Jacek Ulinski (licence granted to Unsplash and downstream users) |
| **Licence type** | [Unsplash License](https://unsplash.com/license) |
| **Commercial use permitted** | **Yes** — the licence grants free commercial and non-commercial use |
| **Modification permitted** | **Yes** — resized and re-encoded only (no content alteration) |
| **Attribution required** | **No** — but credited here as good practice |
| **Verification status** | **Verified** — licence page read and the photographer confirmed on the photo page |

### Licence terms (quoted from unsplash.com/license)

> "All photos can be downloaded and used for free. Commercial and non-commercial
> purposes. No permission needed."
>
> Attribution is "not required" though it is appreciated.

**Restrictions that do apply:** the photos may not be sold without significant
modification, and may not be used to build a competing image service. Neither
applies to using the photo on a marketing website.

### Processing applied

- Downloaded at 1600w and 800w, both 16:9 (the source is already 16:9).
- Re-encoded to progressive JPEG (q82) and WebP (q78) with Pillow. No cropping that
  changes composition, no filters, no compositing.
- Result: WebP 123 KB / 36 KB vs JPEG 219 KB / 59 KB.

### Suggested credit (optional)

If the owner wants a visible credit, this line is accurate:

> Photo by [Jacek Ulinski](https://unsplash.com/photos/brown-wheat-field-during-sunset-T6Dirfcmy0c) on Unsplash

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

Nothing from the removed files is referenced anywhere in the codebase.

## 5. What was preserved when replacing them

| Requirement | Status |
|-------------|--------|
| Responsive image behaviour | **Preserved** — `<picture>` selects 800w below 640px, 1600w above; `srcSet`+`sizes` on the `<img>` fallback |
| Modern format | **Improved** — WebP with JPEG fallback |
| Intrinsic dimensions (no layout shift) | **Preserved** — `width`/`height` retained (800×450 / 1600×900) |
| Accessibility | **Preserved** — `alt` still comes from the `hero.imageAlt` catalogue key |
| Performance | **Improved** — 123 KB WebP vs the previous 244 KB JPEG at 1600w |

## 6. Adding a new image — the rule

Every new image must be recorded in §1 **before** it is merged, with:

1. file path; 2. image title; 3. original source URL; 4. creator / copyright owner;
5. licence type; 6. whether commercial use is permitted; 7. attribution requirements;
8. verification status.

**If any of those cannot be established, the image must not ship.**

## 7. Outstanding

- None. All shipped images are licensed or original and documented.
