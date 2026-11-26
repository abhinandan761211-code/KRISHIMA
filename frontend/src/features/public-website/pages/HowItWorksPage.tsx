import { Container, Icon, useI18n } from "@krishima/ui";
import { PageIntro } from "@/features/public-website/components/PageIntro";
import { PublicSection } from "@/features/public-website/components/PublicSection";
import { AppLink } from "@/features/public-website/components/AppLink";
import { useSeo } from "@/features/public-website/seo/useSeo";

/**
 * /how-it-works
 *
 * Explains the four-step journey from the landing page in more depth. Each step
 * states plainly whether it exists today. No step implies that ordering,
 * payments or bookings are operational — they are not.
 */
const STEPS = ["account", "workspace", "discover", "connect"] as const;

export function HowItWorksPage() {
  const { t } = useI18n();
  useSeo({
    titleKey: "meta.howItWorks.title",
    descriptionKey: "meta.howItWorks.description",
    path: "/how-it-works",
    imagePath: "/images/og-default.svg",
  });

  return (
    <>
      <PageIntro
        eyebrow={t("howPage.eyebrow")}
        title={t("howPage.title")}
        description={t("howPage.description")}
      >
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <AppLink to="/services" variant="secondary">
            {t("cta.exploreServices")}
          </AppLink>
          <AppLink to="/faq" variant="link">
            {t("nav.faq")}
          </AppLink>
        </div>
      </PageIntro>

      <PublicSection labelledBy="how-steps-heading">
        <Container size="2xl" className="max-w-[var(--kr-container-public)]">
          <h2 id="how-steps-heading" className="text-[1.75rem] font-semibold text-[color:var(--kr-fg)]">
            {t("howPage.stepsTitle")}
          </h2>
          <ol className="mt-8 flex flex-col gap-5">
            {STEPS.map((step, index) => (
              <li
                key={step}
                className="flex flex-col gap-3 rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5 sm:flex-row sm:gap-5 sm:p-6"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--kr-radius-full)] bg-[color:var(--kr-primary-subtle)] text-[length:var(--kr-text-h5)] font-bold text-[color:var(--kr-primary-fg-on-subtle)]"
                >
                  {index + 1}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
                    {t(`howPage.steps.${step}.title`)}
                  </h3>
                  <p className="max-w-[70ch] text-[length:var(--kr-text-body)] leading-relaxed text-[color:var(--kr-fg-body)]">
                    {t(`howPage.steps.${step}.description`)}
                  </p>
                  <p className="flex items-center gap-2 text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-muted)]">
                    <Icon name="clock" size={16} className="shrink-0" />
                    {t("howPage.statusPlanned")}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-[70ch] text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-muted)]">
            {t("howPage.note")}
          </p>
        </Container>
      </PublicSection>
    </>
  );
}
