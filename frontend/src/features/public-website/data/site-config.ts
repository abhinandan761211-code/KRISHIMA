/**
 * Site-wide settings for the public website.
 *
 * ANTI-FABRICATION RULE (task §5.15, §12): nothing in this file may contain an
 * invented phone number, street address, social-media link or partnership.
 * A field that has no verified value is `undefined` / disabled — the UI then
 * hides it rather than showing a placeholder that looks real.
 */

export interface PublicSiteConfig {
  /** Announcement bar. Disabled unless a legitimate announcement exists. */
  announcement: {
    enabled: boolean;
    /** i18n key for the announcement text. */
    messageKey: string;
    /** Optional destination; `undefined` renders non-interactive text. */
    href?: string;
  };
  /** Public contact channel. Email only until a verified support inbox exists. */
  contact: {
    supportEmail: string | undefined;
    /** Set by the owner when a verified phone line exists. */
    supportPhone: string | undefined;
  };
  /** Canonical production origin. `undefined` until the domain is confirmed. */
  productionOrigin: string | undefined;
  /** Placeholder origin used for preview/staging OG URLs. */
  previewOrigin: string;
  /** Legal review state — the legal pages must say "draft" until approved. */
  legalReviewStatus: "draft" | "approved";
  legalLastUpdated: string;
}

export const PUBLIC_SITE: PublicSiteConfig = {
  announcement: {
    enabled: true,
    messageKey: "announcement.launch",
    href: "/about",
  },
  contact: {
    // No verified mailbox has been provisioned yet → the contact form states this
    // plainly instead of pretending to send. Update when the inbox is confirmed.
    supportEmail: undefined,
    supportPhone: undefined,
  },
  productionOrigin: import.meta.env.VITE_SITE_ORIGIN,
  previewOrigin: "http://localhost:5173",
  legalReviewStatus: "draft",
  legalLastUpdated: "2026-11-25",
};

/**
 * The single place a page reads its canonical base URL from.
 * Returns `undefined` in development so no canonical tag is emitted there
 * (a canonical must never point at localhost).
 */
export function canonicalBaseUrl(): string | undefined {
  return PUBLIC_SITE.productionOrigin;
}
