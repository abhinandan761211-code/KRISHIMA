import type { ReactNode } from "react";
import { Icon, KrishimaLogo, LanguageSwitcher, ThemeSwitcher, useI18n } from "@krishima/ui";
import { Link } from "react-router-dom";
import { FOOTER_PLATFORM, FOOTER_SUPPORT, SOLUTION_NAV } from "../data/site";
import { PUBLIC_SITE } from "../data/site-config";

/**
 * Public footer (landing §15).
 *
 * Anti-fabrication: only content that exists is rendered. There are no social
 * icons, no phone number and no registered address until the owner supplies
 * verified values in PUBLIC_SITE — an invented contact detail is worse than none.
 */
export function PublicFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  const { supportEmail, supportPhone } = PUBLIC_SITE.contact;

  return (
    <footer className="bg-[color:var(--kr-footer-bg)] text-[color:var(--kr-footer-fg)]">
      <div className="mx-auto w-full max-w-[var(--kr-container-public)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <KrishimaLogo size="md" variant="inverse" />
            <p className="mt-3 max-w-[34ch] text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-footer-muted)]">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <LanguageSwitcher className="text-[color:var(--kr-footer-fg)]" />
              <ThemeSwitcher />
            </div>
          </div>

          <nav aria-label={t("footer.platform")} className="lg:col-span-2">
            <h2 className="text-[length:var(--kr-text-h5)] font-semibold">{t("footer.platform")}</h2>
            <ul className="mt-3 flex flex-col gap-1">
              {FOOTER_PLATFORM.map((item) => (
                <li key={item.path}>
                  <FooterLink to={item.path}>{t(item.key)}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.solutions")} className="lg:col-span-3">
            <h2 className="text-[length:var(--kr-text-h5)] font-semibold">{t("footer.solutions")}</h2>
            <ul className="mt-3 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1">
              {SOLUTION_NAV.map((item) => (
                <li key={item.path}>
                  <FooterLink to={item.path}>{t(item.key)}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t("footer.support")} className="lg:col-span-3">
            <h2 className="text-[length:var(--kr-text-h5)] font-semibold">{t("footer.support")}</h2>
            <ul className="mt-3 flex flex-col gap-1">
              {FOOTER_SUPPORT.map((item) => (
                <li key={item.path}>
                  <FooterLink to={item.path}>{t(item.key)}</FooterLink>
                </li>
              ))}
            </ul>

            <h2 className="mt-6 text-[length:var(--kr-text-h5)] font-semibold">{t("footer.contact")}</h2>
            <ul className="mt-3 flex flex-col gap-1 text-[length:var(--kr-text-sm)]">
              {supportEmail && (
                <li className="flex items-center gap-2">
                  <Icon name="mail" size={16} />
                  <a
                    href={`mailto:${supportEmail}`}
                    className="inline-flex min-h-[var(--kr-touch-target)] items-center rounded-[var(--kr-radius-sm)] text-[color:var(--kr-footer-link)] underline-offset-4 hover:text-[color:var(--kr-footer-link-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-footer-link-hover)]"
                  >
                    {supportEmail}
                  </a>
                </li>
              )}
              {supportPhone && (
                <li className="flex items-center gap-2">
                  <Icon name="phone" size={16} />
                  <a
                    href={`tel:${supportPhone}`}
                    className="inline-flex min-h-[var(--kr-touch-target)] items-center rounded-[var(--kr-radius-sm)] text-[color:var(--kr-footer-link)] underline-offset-4 hover:text-[color:var(--kr-footer-link-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-footer-link-hover)]"
                  >
                    {supportPhone}
                  </a>
                </li>
              )}
              {!supportEmail && !supportPhone && (
                <li className="text-[color:var(--kr-footer-muted)]">{t("footer.contactUnavailable")}</li>
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-[color:var(--kr-footer-border)] pt-6">
          <div className="flex flex-col gap-2 text-[length:var(--kr-text-sm)] text-[color:var(--kr-footer-muted)] sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} KRISHIMA. {t("footer.rights")}</p>
            <p className="max-w-[48ch]">{t("footer.platformNote")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex min-h-[var(--kr-touch-target)] items-center rounded-[var(--kr-radius-sm)] text-[length:var(--kr-text-sm)] text-[color:var(--kr-footer-link)] underline-offset-4 hover:text-[color:var(--kr-footer-link-hover)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-footer-link-hover)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--kr-footer-bg)]"
    >
      {children}
    </Link>
  );
}
