import { Accordion, Container, useI18n } from "@krishima/ui";
import { ACCOUNT_ACTIONS } from "../data/account";
import { FAQ_ITEMS } from "../data/faq";
import { PublicSection, SectionHeading } from "../components/PublicSection";
import { AppLink } from "../components/AppLink";

/**
 * FAQ (landing §13) and final CTA (landing §14).
 *
 * The accordion is the shared WAI-ARIA `Accordion` from @krishima/ui — no second
 * implementation. Questions are data (`FAQ_ITEMS`), answers come from i18n.
 */
export function FaqSection({ variant = "landing" }: { variant?: "landing" | "page" }) {
  const { t } = useI18n();

  const items = FAQ_ITEMS.map((id) => ({
    id,
    title: t(`faq.items.${id}.question`),
    content: <p>{t(`faq.items.${id}.answer`)}</p>,
  }));

  const body = (
    <Container size="2xl" className="max-w-[var(--kr-container-public)]">
      <div className="mx-auto w-full max-w-[46rem]">
        <SectionHeading
          id="faq-heading"
          eyebrow={t("faq.eyebrow")}
          title={t("faq.title")}
          description={t("faq.description")}
          align="center"
        />
        <Accordion className="mt-8 rounded-[var(--kr-radius-lg)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] px-4 sm:px-6" items={items} />
        <p className="mt-6 text-center text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-muted)]">
          {t("faq.moreQuestions")}{" "}
          <AppLink to="/contact" variant="link" className="text-[length:var(--kr-text-sm)]">
            {t("faq.contactUs")}
          </AppLink>
        </p>
      </div>
    </Container>
  );

  if (variant === "page") {
    return (
      <PublicSection labelledBy="faq-heading">
        {body}
      </PublicSection>
    );
  }

  return (
    <PublicSection id="faq" labelledBy="faq-heading" tone="alt">
      {body}
    </PublicSection>
  );
}

export function FinalCtaSection() {
  const { t } = useI18n();
  // Final CTA must not pretend a registration exists. Primary action is the
  // available one (contact); the registration path is shown as unavailable.
  const { register } = ACCOUNT_ACTIONS;

  return (
    <PublicSection id="get-started" labelledBy="final-cta-heading">
      <Container size="2xl" className="max-w-[var(--kr-container-public)]">
        <div className="overflow-hidden rounded-[var(--kr-radius-lg)] border border-[color:var(--kr-border)] bg-[color:var(--kr-primary-active)] px-6 py-10 text-center sm:px-10 lg:py-14">
          <h2
            id="final-cta-heading"
            className="mx-auto max-w-[28ch] text-balance text-[1.75rem] font-semibold leading-tight text-[color:var(--kr-primary-fg-on-accent)] sm:text-[2rem]"
          >
            {t("finalCta.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-[56ch] text-[length:var(--kr-text-body)] text-[color:var(--kr-primary-fg-on-accent)]">
            {t("finalCta.description")}
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <AppLink to={"/contact"} variant="secondary" size="lg" className="w-full sm:w-auto">
              {t("finalCta.secondary")}
            </AppLink>
            <AppLink
              to={register.href}
              variant="ghost"
              size="lg"
              className="w-full border border-[color:var(--kr-primary-fg-on-accent)] text-[color:var(--kr-primary-fg-on-accent)] hover:bg-[color:color-mix(in_srgb,var(--kr-primary-fg-on-accent)_12%,transparent)] sm:w-auto"
            >
              {t(register.labelKey)}
              {!register.enabled && (
                <span className="text-[length:var(--kr-text-caption)] font-normal">
                  ({t("common.comingSoon")})
                </span>
              )}
            </AppLink>
          </div>
          <p className="mx-auto mt-4 max-w-[60ch] text-[length:var(--kr-text-sm)] text-[color:var(--kr-primary-fg-on-accent)]">
            {t("finalCta.note")}
          </p>
        </div>
      </Container>
    </PublicSection>
  );
}
