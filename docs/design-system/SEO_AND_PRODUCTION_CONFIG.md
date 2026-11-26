# KRISHIMA — Public Website SEO & Production Configuration

- **Scope:** what each environment emits for crawlers, and how to configure a real
  deployment.
- **Related:** [ADR-0010](../adr/0010-public-page-rendering.md) ·
  [Validation Report §4](../testing/PUBLIC_WEBSITE_VALIDATION_REPORT.md)

---

## 1. The one variable that matters: `VITE_SITE_ORIGIN`

```dotenv
# frontend/.env.local (or the deployment's environment)
VITE_SITE_ORIGIN=https://<confirmed-domain>
```

- **Leave it empty until the domain is confirmed.** Without it no canonical tag is
  emitted and `robots.txt` disallows all crawling.
- **A production build REQUIRES it.** `vite build` fails with an explicit message if
  `VITE_APP_ENV=production` and `VITE_SITE_ORIGIN` is empty, because the alternative
  is silently shipping a "do not index me" file to production.
- **Never invent the domain.** It is owner-provided; this repo contains no default.

> The variable is `VITE_`-prefixed because metadata is written by the browser at
> runtime. It is a public origin, not a secret — no credential is involved.

## 2. What each environment emits

| Environment | `VITE_APP_ENV` | Origin set | `robots.txt` | `sitemap.xml` | Canonical |
|---|---|---|---|---|---|
| Local dev | `development` | — | `Disallow: /` | empty `<urlset>` | none |
| Staging | `staging` | ignored | `Disallow: /` | empty `<urlset>` | none |
| Production | `production` | **required** | allow + `Sitemap:` line | all indexable routes | emitted |

Staging is deliberately non-indexable. A preview site that shares copy with
production is a duplicate-content risk, and it may expose unfinished pages.

## 3. Files generated at build time

`frontend/scripts/seo-files.ts` runs as a Vite plugin after the bundle is written:

- `dist/robots.txt`
- `dist/sitemap.xml`

Both are derived from `src/features/public-website/data/indexable-routes.ts`, which
in turn derives `/solutions/*` from `data/roles.ts`. There is **no second list of
URLs** to keep in sync; adding a role adds a sitemap entry automatically.

Verify after building:

```bash
cd frontend
npm run build
cat dist/robots.txt
grep -c "<loc>" dist/sitemap.xml
```

## 4. Metadata emitted per route

`useSeo()` writes:

- `<title>` — unique per route (asserted by e2e);
- `<meta name="description">`;
- `og:site_name`, `og:type`, `og:title`, `og:description`, `og:url`, `og:image`,
  `og:locale`;
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`;
- `<link rel="canonical">` — **only** when an origin is configured;
- `<meta name="robots">` — `noindex,nofollow` on the 404 page and on non-production
  builds.

`og:locale` follows the active language (`en_IN` / `hi_IN`), and `<html lang>` is
kept in sync (`en-IN` / `hi-IN`).

## 5. Before public launch

1. Set `VITE_SITE_ORIGIN` to the confirmed domain.
2. Set `VITE_APP_ENV=production` and confirm the build succeeds.
3. Confirm the sitemap contains every public route and nothing else.
4. Decide on prerendering — see [ADR-0010](../adr/0010-public-page-rendering.md).
   Until it is implemented, crawlers that do not run JavaScript see an empty shell.
5. Submit the sitemap to the search engines the owner chooses.
6. Verify that staging remains `Disallow: /`.

## 6. Do not

- Do not deploy from this repository in this task's scope (no deployment was
  performed).
- Do not hard-code a production domain in source.
- Do not point a canonical at `localhost` or a staging host.
