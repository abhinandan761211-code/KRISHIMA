# KRISHIMA — Public Website Guide

> How the public marketing website is built, so the next person can extend it
> without breaking it. Companion documents:
> [Specification](../product/PUBLIC_WEBSITE_SPECIFICATION.md) ·
> [Validation Report](../testing/PUBLIC_WEBSITE_VALIDATION_REPORT.md)

- **Location:** `frontend/src/features/public-website/`
- **Routes:** `/`, `/about`, `/services`, `/how-it-works`, `/faq`, `/contact`, `/help`,
  `/privacy`, `/terms`, `/solutions/{farmer,buyer,retailer,worker,equipment,transporter,warehouse,creator}`, 404
- **Stack:** React 19 + Vite + React Router + `@krishima/ui`

---

## 1. Directory layout

```
features/public-website/
├── components/        # layout-level pieces shared by pages
│   ├── PublicNavbar.tsx        # header: nav, solutions dropdown, actions
│   ├── PublicFooter.tsx        # footer: brand, link columns, legal
│   ├── AnnouncementBar.tsx     # dismissible top bar (config-driven)
│   ├── AppLink.tsx             # router-aware link/button (variants)
│   ├── ContentPage.tsx         # prose shell for about/help/legal
│   ├── PageIntro.tsx           # eyebrow + h1 + description block
│   └── PublicSection.tsx       # section + SectionHeading primitives
├── layouts/
│   └── PublicLayout.tsx        # skip link → header → main → footer
├── pages/                      # one file per route
├── sections/                   # the 13 landing-page sections
├── data/                       # static configuration (no JSX, no copy)
│   ├── roles.ts                # the 8 account categories
│   ├── site.ts                 # nav + footer link structure (+ icons)
│   ├── features.ts             # the 10 platform features
│   ├── site-config.ts          # announcement/contact/origin settings
│   ├── account.ts              # login/register availability
│   └── indexable-routes.ts     # sitemap source of truth
├── seo/useSeo.ts               # document title/meta/canonical + route focus
├── i18n/{en,hi,index}.ts       # message catalogues
└── routes.tsx                  # the ONLY public route declaration
```

**Rules**

1. A section never imports another section. Shared furniture lives in `components/`.
2. Copy never lives in a component — it lives in `i18n/en.ts` (and `hi.ts`).
3. Static lists (roles, features, nav) never live in a component — they live in `data/`.
4. `LandingPage.tsx` stays a thin composition. If it starts holding logic, that
   logic belongs in a section.

## 2. Adding a landing section

1. Add the section component to `sections/`.
2. Add its copy to **both** `i18n/en.ts` and `i18n/hi.ts` (a test enforces key parity).
3. Add the component to `LandingPage.tsx` in the documented order.
4. Run `npm test` (parity) and `npm run test:e2e` (route + axe scan).

## 3. Adding a page

1. Create the page in `pages/`.
2. Register it in `routes.tsx` — this is the single route source.
3. If it should be indexed, add it to `data/indexable-routes.ts`. The sitemap is
   generated from that file, so a page missing here is missing from the sitemap.
4. Call `useSeo({ titleKey, descriptionKey, path })` in the page.

## 4. Adding an account category (role)

Roles come from one array in `data/roles.ts`. Navbar, footer, `/services`,
`/solutions/*` routes and the sitemap all derive from it, so adding a role adds a
route, a card, a footer link and a sitemap entry together. Add its copy keys
(`roles.<id>.*`) to both catalogues.

## 5. Design system rules (enforced)

- All visual values come from `packages/ui/styles/tokens.css`. No hex literals in
  the feature — verified by audit.
- Use the shared primitives (`Button`, `AppLink`, `Accordion`, `KrishimaLogo`,
  `LanguageSwitcher`, `ThemeSwitcher`). Do not re-implement them here.
- **There is exactly one `I18nProvider` and one `ThemeProvider`**, both in
  `frontend/src/app/providers/AppProviders.tsx`.

### Colour tokens added for the website

| Token | Light | Dark | Why it exists |
|-------|-------|------|---------------|
| `--kr-primary-text` | green-800 | green-300 | Accent text on muted surfaces. green-700 measured **4.39:1** on `--kr-surface-muted`; green-800 gives **6.25:1**. |
| `--kr-primary-fg-on-accent` | white | green-900 | Label on the **light** accent surface (`--kr-primary-active`). In dark, that surface is `#86EFAC`, where white is **1.40:1** and green-900 is **6.49:1**. |
| `--kr-logo-krishi` | green-700 | green-300 | KRISHI wordmark stays brand green, but `#15803D` on the dark surface is **2.85:1** (below the 3:1 minimum). green-300 is **10.8:1**. |

> `--kr-primary-fg` remains **white in both themes** because it is the label colour
> of the primary button (green-700 background), where dark text would be 1.82:1.

## 6. Responsive behaviour

| Breakpoint | Navbar |
|------------|--------|
| < 1024px | Logo + menu button. Panel holds nav, both switchers, account actions. |
| 1024–1279px | Logo + full nav + Login/Get started. **Switchers move into the menu**, because the full row needs ~1123px and overflows a 1024px viewport. |
| ≥ 1280px | Logo + nav + language + theme + Login + Get started. |

Verified at 320/375/390/768/1024/1180/1280/1440/1920 — zero horizontal overflow.

## 7. SEO

- `useSeo` writes a unique `<title>`, description, Open Graph and Twitter tags per route.
- **Canonical is only emitted when `VITE_SITE_ORIGIN` is set** — never localhost.
- `scripts/seo-files.ts` (a Vite build plugin) emits `robots.txt` + `sitemap.xml`:
  - production **with** origin → sitemap lists all indexable routes; robots allows crawl;
  - any other case → sitemap empty; robots `Disallow: /`;
  - production **without** origin → **build fails**, because shipping a
    disallow-everything robots.txt to production is almost never intended.

## 8. Images

Hero and other photography live in `frontend/public/images/`. Each `<picture>`
supplies 800w/1600w `srcSet`; the hero uses `fetchPriority="high"`, everything
below the fold uses `loading="lazy"`.

> **Licensing is not yet documented.** See the validation report — this is an open
> item before launch.

## 9. Testing

```bash
cd frontend
npm run lint          # eslint
npm run typecheck     # tsc --noEmit
npm test              # vitest (unit)
npm run test:e2e      # playwright (routes, nav, theme, axe)
npm run build         # tsc -b && vite build (+ sitemap/robots)
```

The e2e suite is the safety net for the three defect classes this project has
actually hit: raw i18n keys leaking into the DOM, horizontal overflow, and colour
contrast. Each has a dedicated assertion.
