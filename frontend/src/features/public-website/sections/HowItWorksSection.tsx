import { Container, useI18n } from "@krishima/ui";
import { PublicSection, SectionHeading } from "../components/PublicSection";
import { AppLink } from "../components/AppLink";

/**
 * How it works (landing §7) — four plain-language steps.
 *
 * Step 1 is available today (the account foundation exists); steps 2–4 describe
 * the intended journey and are NOT presented as live, because no domain module
 * ships yet. The closing note says so explicitly instead of implying that
 * transactions already work (task §5.7).
 */
const STEPS = ["account", "workspace", "discover", "connect"] as const;

export function HowItWorksSection() {
  const { t } = useI18n();

  return (
    <PublicSection id="how-it-works" labelledBy="how-heading" tone="alt">
      <Container size="2xl" className="max-w-[var(--kr-container-public)]">
        <SectionHeading
          id="how-heading"
          eyebrow={t("how.eyebrow")}
          title={t("how.title")}
          description={t("how.description")}
          align="center"
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step}
              className="relative flex h-full flex-col gap-2 rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5"
            >
              <span className="text-[length:var(--kr-text-caption)] font-bold text-[color:var(--kr-primary-text)]">
                {t("how.stepLabel")} {index + 1}
              </span>
              <h3 className="text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
                {t(`how.steps.${step}.title`)}
              </h3>
              <p className="text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                {t(`how.steps.${step}.description`)}
              </p>
              {index === 0 && (
                <span className="mt-auto pt-2 text-[length:var(--kr-text-caption)] font-semibold text-[color:var(--kr-success)]">
                  {t("how.availableNow")}
                </span>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-[70ch] text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-muted)]">
          {t("how.note")}
        </p>
        <div className="mt-5">
          <AppLink to="/faq" variant="link">
            {t("how.seeFaq")}
          </AppLink>
        </div>
      </Container>
    </PublicSection>
  );
}
