import { Icon, Container, useI18n } from "@krishima/ui";
import { FieldRidgeArt } from "../components/FieldRidgeArt";
import { PublicSection, SectionHeading } from "../components/PublicSection";

/**
 * Platform introduction (landing §3).
 *
 * Plain-language explanation of what the product is and how it links the value
 * chain. The three points restate facts from the PRD rather than inventing
 * benefits: one identity, independent workspaces, defence-in-depth security.
 */
const POINTS = ["identity", "workspaces", "trust"] as const;
const POINT_ICONS = { identity: "users", workspaces: "scale", trust: "shield" } as const;

export function PlatformIntroSection() {
  const { t } = useI18n();

  return (
    <PublicSection id="platform" labelledBy="platform-heading" tone="alt">
      <Container size="2xl" className="max-w-[var(--kr-container-public)]">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <SectionHeading
              id="platform-heading"
              eyebrow={t("platform.eyebrow")}
              title={t("platform.title")}
              description={t("platform.description")}
            />
            <ul className="mt-8 flex flex-col gap-5">
              {POINTS.map((point) => (
                <li key={point} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--kr-radius-md)] bg-[color:var(--kr-surface)] text-[color:var(--kr-primary-text)]"
                  >
                    <Icon name={POINT_ICONS[point]} size={20} />
                  </span>
                  <div>
                    <h3 className="text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
                      {t(`platform.points.${point}.title`)}
                    </h3>
                    <p className="mt-1 max-w-[60ch] text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                      {t(`platform.points.${point}.description`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative hidden items-center justify-center lg:flex" aria-hidden="true">
            <FieldRidgeArt className="w-full max-w-[420px] text-[color:var(--kr-primary)]" variant="rows" />
          </div>
        </div>
      </Container>
    </PublicSection>
  );
}
