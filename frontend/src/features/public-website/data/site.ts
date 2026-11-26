import type { IconName } from "@krishima/ui";

/**
 * Navigation, footer, SEO and the "available vs planned" copy for the public site.
 *
 * Route paths live here (not scattered in components) so the router, the navbar,
 * the footer, the sitemap and the tests all read ONE source of truth.
 */

export interface NavLink {
  /** i18n key for the label. */
  key: string;
  path: string;
}

export const PRIMARY_NAV: NavLink[] = [
  { key: "nav.home", path: "/" },
  { key: "nav.about", path: "/about" },
  { key: "nav.services", path: "/services" },
  { key: "nav.howItWorks", path: "/how-it-works" },
  { key: "nav.contact", path: "/contact" },
];

/** Solutions dropdown: the eight categories, one destination each. */
export interface SolutionLink extends NavLink {
  icon: IconName;
}

export const SOLUTION_NAV: SolutionLink[] = [
  { key: "roles.farmer.name", path: "/solutions/farmer", icon: "sprout" },
  { key: "roles.buyer.name", path: "/solutions/buyer", icon: "bag" },
  { key: "roles.retailer.name", path: "/solutions/retailer", icon: "store" },
  { key: "roles.worker.name", path: "/solutions/worker", icon: "users" },
  { key: "roles.equipment.name", path: "/solutions/equipment", icon: "wrench" },
  { key: "roles.transporter.name", path: "/solutions/transporter", icon: "truck" },
  { key: "roles.warehouse.name", path: "/solutions/warehouse", icon: "warehouse" },
  { key: "roles.creator.name", path: "/solutions/creator", icon: "video" },
];

/** Footer "Platform" column. */
export const FOOTER_PLATFORM: NavLink[] = [
  { key: "nav.home", path: "/" },
  { key: "nav.about", path: "/about" },
  { key: "nav.services", path: "/services" },
  { key: "nav.howItWorks", path: "/how-it-works" },
  { key: "nav.faq", path: "/faq" },
];

/** Footer "Help & legal" column. */
export const FOOTER_SUPPORT: NavLink[] = [
  { key: "nav.contact", path: "/contact" },
  { key: "nav.help", path: "/help" },
  { key: "nav.privacy", path: "/privacy" },
  { key: "nav.terms", path: "/terms" },
];

/**
 * All public routes in ONE place. `indexable: false` marks pages that must not
 * be indexed (legal drafts are indexed but clearly marked; the 404 is not).
 */
export interface PublicRouteDefinition {
  path: string;
  /** i18n key for the document <title>. */
  titleKey: string;
  /** i18n key for the meta description. */
  descriptionKey: string;
  indexable: boolean;
}

export const PUBLIC_ROUTES: PublicRouteDefinition[] = [
  { path: "/", titleKey: "meta.home.title", descriptionKey: "meta.home.description", indexable: true },
  { path: "/about", titleKey: "meta.about.title", descriptionKey: "meta.about.description", indexable: true },
  { path: "/services", titleKey: "meta.services.title", descriptionKey: "meta.services.description", indexable: true },
  {
    path: "/how-it-works",
    titleKey: "meta.howItWorks.title",
    descriptionKey: "meta.howItWorks.description",
    indexable: true,
  },
  { path: "/faq", titleKey: "meta.faq.title", descriptionKey: "meta.faq.description", indexable: true },
  { path: "/contact", titleKey: "meta.contact.title", descriptionKey: "meta.contact.description", indexable: true },
  { path: "/help", titleKey: "meta.help.title", descriptionKey: "meta.help.description", indexable: true },
  { path: "/privacy", titleKey: "meta.privacy.title", descriptionKey: "meta.privacy.description", indexable: true },
  { path: "/terms", titleKey: "meta.terms.title", descriptionKey: "meta.terms.description", indexable: true },
  ...SOLUTION_NAV.map<PublicRouteDefinition>((s) => ({
    path: s.path,
    // Solutions pages derive their title/description from the role copy.
    titleKey: `${s.key.replace(".name", "")}.seo.title`,
    descriptionKey: `${s.key.replace(".name", "")}.seo.description`,
    indexable: true,
  })),
];

/** Paths rendered in sitemap.xml (generated at build time, see scripts/). */
export const SITEMAP_PATHS = PUBLIC_ROUTES.filter((r) => r.indexable).map((r) => r.path);
