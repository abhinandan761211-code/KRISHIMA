import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath, URL } from "node:url";
import type { Plugin } from "vite";
import { INDEXABLE_ROUTES } from "../src/features/public-website/data/indexable-routes";

/**
 * Emits `robots.txt` and `sitemap.xml` into the build output, per environment.
 *
 * Why generate instead of shipping static files in `public/`:
 *  - a static sitemap would list paths that must not exist yet (and duplicate the
 *    route list, which the repo forbids);
 *  - indexable-ness depends on the environment. A staging or preview build must
 *    not be crawled, and a build without a confirmed origin must not advertise
 *    localhost URLs as canonical.
 *
 * Behaviour:
 *  - `VITE_SITE_ORIGIN` set  → sitemap listing every public path at that origin,
 *    and robots.txt pointing crawlers at it (production behaviour).
 *  - origin absent (dev/staging) → sitemap contains no URLs, and robots.txt
 *    disallows everything. This is the safe default: no false claims about a
 *    site that is not published.
 */

/** Minimal .env parser: enough for KEY=VALUE lines, ignores comments. */
function loadEnvFile(path: string): Record<string, string> {
  try {
    const out: Record<string, string> = {};
    for (const line of readFileSync(path, "utf-8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      out[key] = value;
    }
    return out;
  } catch {
    return {};
  }
}

function buildSitemap(origin: string | undefined): string {
  const urls = INDEXABLE_ROUTES.map((route) =>
    [
      "  <url>",
      `    <loc>${origin}${route.path === "/" ? "/" : route.path}</loc>`,
      `    <changefreq>${route.changefreq}</changefreq>`,
      `    <priority>${route.priority.toFixed(1)}</priority>`,
      "  </url>",
    ].join("\n"),
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...(origin ? urls : []),
    "</urlset>",
    "",
  ].join("\n");
}

function buildRobots(origin: string | undefined): string {
  if (!origin) {
    return ["# No confirmed public origin configured — crawling disabled.", "User-agent: *", "Disallow: /", ""].join(
      "\n",
    );
  }
  return ["User-agent: *", "Disallow:", "", `Sitemap: ${origin}/sitemap.xml`, ""].join("\n");
}

export interface SeoFilesOptions {
  /** Directory to read `.env*` files from (the app root). */
  envDir: string;
}

export function seoFilesPlugin({ envDir }: SeoFilesOptions): Plugin {
  return {
    name: "krishima-seo-files",
    apply: "build",
    closeBundle() {
      const parsed = loadEnvFile(`${envDir}/.env`);
      const local = loadEnvFile(`${envDir}/.env.local`);
      const mode = process.env.VITE_APP_ENV ?? local.VITE_APP_ENV ?? parsed.VITE_APP_ENV ?? "development";
      const env = { ...parsed, ...local, ...(process.env as Record<string, string>) };

      let origin = env.VITE_SITE_ORIGIN?.replace(/\/+$/, "");

      // Never emit a canonical/sitemap origin for anything that is not production.
      if (mode !== "production") origin = undefined;

      if (mode === "production" && !origin) {
        // Fail the build loudly: a production build without an origin would ship
        // a robots.txt that blocks crawling, which is almost never intended.
        this.error(
          "VITE_SITE_ORIGIN is required for a production build (e.g. https://krishima.in). " +
          "Without it robots.txt would disallow all crawling.",
        );
      }

      const outDir = fileURLToPath(new URL("../dist", import.meta.url));
      writeFileSync(`${outDir}/sitemap.xml`, buildSitemap(origin));
      writeFileSync(`${outDir}/robots.txt`, buildRobots(origin));

      this.info(
        `seo files: robots.txt + sitemap.xml (${origin ?? "no origin — crawling disabled"}, ${origin ? INDEXABLE_ROUTES.length : 0} urls)`,
      );
    },
  };
}
