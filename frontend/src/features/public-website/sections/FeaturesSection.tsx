import { Badge, Container, useI18n } from "@krishima/ui";
import { FeatureCard } from "../components/FeatureCard";
import { PublicSection, SectionHeading } from "../components/PublicSection";
import { PUBLIC_FEATURES } from "../data/features";

/**
 * Platform features (landing §5) as a Bento grid.
 *
 * Grid mechanic: on mobile it is a single column (readable, 1 scroll direction);
 * from `md` it becomes a 4-column bento where "wide" cells take 2 columns. No
 * masonry CSS and no JS layout — pure grid, so it works with JS disabled for the
 * static HTML and never jitters.
 *
 * The legend explicitly tells the reader what "Coming soon" means, so the status
 * is conveyed by TEXT as well as by the badge (never colour alone).
 */
export function FeaturesSection() {
  const { t } = useI18n();

  return (
    <PublicSection id="features" labelledBy="features-heading" tone="alt">
      <Container size="2xl" className="max-w-[var(--kr-container-public)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="features-heading"
            eyebrow={t("features.eyebrow")}
            title={t("features.title")}
            description={t("features.description")}
          />
          <p className="flex items-center gap-2 text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-muted)]">
            <Badge tone="neutral">{t("features.planned")}</Badge>
            <span>{t("features.legend")}</span>
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-4">
          {PUBLIC_FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </Container>
    </PublicSection>
  );
}
