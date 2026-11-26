import { PUBLIC_ROLES } from "./roles";

/**
 * Indexable public paths — the single source of truth for the sitemap and for
 * crawler-facing route tests.
 *
 * Derived from the same data the router uses (`publicRouteChildren` builds its
 * solution routes from `PUBLIC_ROLES`) and from `PRIMARY_NAV`. Keeping this
 * here means a new page cannot silently disappear from the sitemap.
 *
 * Deliberately EXCLUDED: the 404 route (never indexable) and internal app
 * routes such as /system-status, /auth/callback and /dev/*.
 */
export interface IndexableRoute {
  /** Absolute path, e.g. "/about". */
  path: string;
  /** Relative sitemap priority (0.0–1.0). */
  priority: number;
  /** Relative change frequency hint. */
  changefreq: "daily" | "weekly" | "monthly" | "yearly";
}

export const INDEXABLE_ROUTES: IndexableRoute[] = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/about", priority: 0.8, changefreq: "monthly" },
  { path: "/services", priority: 0.9, changefreq: "monthly" },
  { path: "/how-it-works", priority: 0.8, changefreq: "monthly" },
  { path: "/faq", priority: 0.7, changefreq: "monthly" },
  { path: "/contact", priority: 0.7, changefreq: "yearly" },
  { path: "/help", priority: 0.6, changefreq: "monthly" },
  { path: "/privacy", priority: 0.3, changefreq: "yearly" },
  { path: "/terms", priority: 0.3, changefreq: "yearly" },
  ...PUBLIC_ROLES.map((role) => ({
    path: role.href,
    priority: 0.8,
    changefreq: "monthly" as const,
  })),
];
