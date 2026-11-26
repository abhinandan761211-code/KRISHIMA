import { Container, Icon, useI18n } from "@krishima/ui";
import { PageIntro } from "@/features/public-website/components/PageIntro";
import { PublicSection } from "@/features/public-website/components/PublicSection";
import { AppLink } from "@/features/public-website/components/AppLink";
import { FaqSection } from "@/features/public-website/sections/FaqAndCtaSections";
import { useSeo } from "@/features/public-website/seo/useSeo";

/** /faq — the full FAQ, reusing the landing accordion (one implementation). */
export function FaqPage() {
  const { t } = useI18n();
  useSeo({
    titleKey: "meta.faq.title",
    descriptionKey: "meta.faq.description",
    path: "/faq",
    imagePath: "/images/og-default.jpg",
  });

  return (
    <>
      <PageIntro eyebrow={t("faq.eyebrow")} title={t("faq.title")} description={t("faq.pageDescription")} />
      <FaqSection variant="page" />
    </>
  );
}

const HELP_TOPICS = ["start", "account", "languages", "accessibility", "report"] as const;
const HELP_ICONS = {
  start: "sprout",
  account: "users",
  languages: "globe",
  accessibility: "checkCircle",
  report: "fileText",
} as const;

/**
 * /help — practical guidance that is TRUE today.
 *
 * Everything here describes the current public website (reading sections,
 * changing language, changing theme, reporting a problem). It deliberately does
 * not document features that do not exist.
 */
export function HelpPage() {
  const { t } = useI18n();
  useSeo({
    titleKey: "meta.help.title",
    descriptionKey: "meta.help.description",
    path: "/help",
    imagePath: "/images/og-default.jpg",
  });

  return (
    <>
      <PageIntro eyebrow={t("helpPage.eyebrow")} title={t("helpPage.title")} description={t("helpPage.description")} />
      <PublicSection>
        <Container size="2xl" className="max-w-[var(--kr-container-public)]">
          <ul className="grid gap-4 md:grid-cols-2">
            {HELP_TOPICS.map((topic) => (
              <li
                key={topic}
                className="flex gap-3 rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--kr-radius-md)] bg-[color:var(--kr-surface-muted)] text-[color:var(--kr-primary-text)]"
                >
                  <Icon name={HELP_ICONS[topic]} size={20} />
                </span>
                <div>
                  <h2 className="text-[length:var(--kr-text-h5)] font-semibold text-[color:var(--kr-fg)]">
                    {t(`helpPage.topics.${topic}.title`)}
                  </h2>
                  <p className="mt-1 text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                    {t(`helpPage.topics.${topic}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface-secondary)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-body)]">{t("helpPage.stillStuck")}</p>
            <div className="flex flex-wrap gap-3">
              <AppLink to="/faq" variant="secondary" size="sm">
                {t("nav.faq")}
              </AppLink>
              <AppLink to="/contact" variant="primary" size="sm">
                {t("nav.contact")}
              </AppLink>
            </div>
          </div>
        </Container>
      </PublicSection>
    </>
  );
}
