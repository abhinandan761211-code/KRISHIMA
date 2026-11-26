import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n, type LocaleCode } from "@krishima/ui";
import { canonicalBaseUrl, PUBLIC_SITE } from "../data/site-config";

/**
 * Per-route document metadata.
 *
 * Why a hook and not react-helmet: the public site is a client-rendered SPA, so
 * the crawler-visible tags must be written by the app itself. This keeps the
 * dependency count at zero and works identically in dev, preview and production.
 *
 * Contract:
 *  - exactly one <title> per route, from the i18n catalogue;
 *  - a canonical link ONLY when a production origin is configured (never
 *    localhost);
 *  - Open Graph + Twitter tags always present (they are harmless in dev);
 *  - `noindex` when the route asks for it (404) or when the site is not the
 *    production build.
 */

export interface SeoOptions {
  /** Already-translated page title. */
  title: string;
  description: string;
  /** Absolute canonical path (e.g. "/about"). */
  path: string;
  /** Set false for pages that must not be indexed. */
  indexable?: boolean;
  /** Optional social image path, relative to the site origin. */
  imagePath?: string;
}

const SITE_NAME = "KRISHIMA";

function upsertMeta(attr: "name" | "property", key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function removeLinkIfPresent(rel: string): void {
  document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)?.remove();
}

export const OG_LOCALE: Record<LocaleCode, string> = {
  en: "en_IN",
  hi: "hi_IN",
};

export function applySeo({ title, description, path, indexable = true, imagePath }: SeoOptions): void {
  const base = canonicalBaseUrl();
  const ogBase = base ?? PUBLIC_SITE.previewOrigin;
  const fullTitle = title === SITE_NAME ? SITE_NAME : `${title} · ${SITE_NAME}`;

  document.title = fullTitle;
  upsertMeta("name", "description", description);

  // Canonical: only when the production domain is confirmed.
  if (base) {
    upsertLink("canonical", `${base}${path}`);
  } else {
    removeLinkIfPresent("canonical");
  }

  upsertMeta("property", "og:site_name", SITE_NAME);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:title", fullTitle);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", `${ogBase}${path}`);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", fullTitle);
  upsertMeta("name", "twitter:description", description);
  if (imagePath) {
    upsertMeta("property", "og:image", `${ogBase}${imagePath}`);
    upsertMeta("name", "twitter:image", `${ogBase}${imagePath}`);
  }

  upsertMeta("name", "robots", indexable ? "index,follow" : "noindex,nofollow");
}

/**
 * React hook wrapper. Re-applies when the locale changes so the title and
 * description follow the selected language.
 */
export function useSeo(options: Omit<SeoOptions, "title" | "description"> & { titleKey: string; descriptionKey: string }) {
  const { t, locale } = useI18n();
  const { pathname } = useLocation();
  const { titleKey, descriptionKey, indexable, imagePath, path } = options;

  useEffect(() => {
    applySeo({
      title: t(titleKey),
      description: t(descriptionKey),
      path,
      indexable,
      imagePath,
    });
    // Also keep the OG locale in sync with the active language.
    upsertMeta("property", "og:locale", OG_LOCALE[locale]);
    document.documentElement.setAttribute("lang", locale === "hi" ? "hi-IN" : "en-IN");
  }, [titleKey, descriptionKey, path, indexable, imagePath, t, locale, pathname]);
}

/** Scroll to the top on route change, and move focus to <main> for assistive tech. */
export function useRouteFocus(): void {
  const { pathname } = useLocation();
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "auto" });
    const main = document.getElementById("main-content");
    // Only steal focus when it is not already inside the main region, so the
    // browser's own "focus first heading" behaviour is preserved on full loads.
    if (main && !main.contains(document.activeElement)) {
      main.focus({ preventScroll: true });
    }
  }, [pathname]);
}
