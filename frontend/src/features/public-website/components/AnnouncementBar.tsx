import { Icon } from "@krishima/ui";
import { useState } from "react";
import { useI18n } from "@krishima/ui";
import { PUBLIC_SITE } from "../data/site-config";
import { AppLink } from "./AppLink";

/**
 * Announcement bar (landing §1).
 *
 * Shown ONLY when an announcement is configured in PUBLIC_SITE; otherwise the
 * component renders nothing at all (no empty bar, no layout shift). Dismissal is
 * session-scoped on purpose: a launch notice should reappear on a later visit.
 */
const DISMISS_KEY = "krishima.announcement.dismissed";

export function AnnouncementBar() {
  const { t } = useI18n();
  const { enabled, messageKey, href } = PUBLIC_SITE.announcement;
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return globalThis.sessionStorage?.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });

  if (!enabled || dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      globalThis.sessionStorage?.setItem(DISMISS_KEY, "1");
    } catch {
      // Storage unavailable — dismissal still applies for this page view.
    }
  };

  return (
    <div className="bg-[color:var(--kr-primary-active)] text-[color:var(--kr-primary-fg-on-accent)]">
      <div className="mx-auto flex w-full max-w-[var(--kr-container-public)] items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <p className="min-w-0 flex-1 text-[14px] leading-snug">
          <span className="font-semibold">{t(messageKey)}</span>
          {href && (
            <AppLink
              to={href}
              variant="plain"
              className="ml-2 inline text-[14px] font-semibold text-[color:var(--kr-primary-fg-on-accent)] underline underline-offset-4"
            >
              {t("announcement.readMore")}
            </AppLink>
          )}
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label={t("announcement.dismiss")}
          className="-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--kr-radius-sm)] text-[color:var(--kr-primary-fg-on-accent)] hover:bg-[color:color-mix(in_srgb,var(--kr-primary-fg-on-accent)_14%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-primary-fg-on-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--kr-primary-active)]"
        >
          <Icon name="close" size={18} />
        </button>
      </div>
    </div>
  );
}
