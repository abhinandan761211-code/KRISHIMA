import type { IconName } from "@krishima/ui";
import { Icon, Container, useI18n } from "@krishima/ui";
import { PublicSection, SectionHeading } from "../components/PublicSection";
import { AppLink } from "../components/AppLink";

/**
 * Farmer solutions (landing §8) and Business solutions (landing §9).
 *
 * Both share one implementation because they are the same layout with different
 * copy — a second near-identical component would be the duplication AGENTS §11
 * forbids. Every item is a planned capability and is labelled as such.
 */
const FARMER_ITEMS = ["records", "crops", "weather", "market", "harvest", "services"] as const;
const BUSINESS_ITEMS = ["buyers", "retailers", "transport", "equipment", "warehouses", "partners"] as const;

const FARMER_ICONS = {
  records: "fileText",
  crops: "sprout",
  weather: "cloudSun",
  market: "trending",
  harvest: "box",
  services: "wrench",
} as const;

const BUSINESS_ICONS = {
  buyers: "bag",
  retailers: "store",
  transport: "truck",
  equipment: "wrench",
  warehouses: "warehouse",
  partners: "handshake",
} as const;

export function FarmerSolutionsSection() {
  return (
    <SolutionsBlock
      id="farmer-solutions"
      headingId="farmer-solutions-heading"
      base="solutions.farmer"
      items={FARMER_ITEMS}
      icons={FARMER_ICONS}
      cta={{ to: "/solutions/farmer", labelKey: "solutions.seeFarmer" }}
      tone="default"
    />
  );
}

export function BusinessSolutionsSection() {
  return (
    <SolutionsBlock
      id="business-solutions"
      headingId="business-solutions-heading"
      base="solutions.business"
      items={BUSINESS_ITEMS}
      icons={BUSINESS_ICONS}
      cta={{ to: "/solutions/buyer", labelKey: "solutions.seeBusiness" }}
      tone="alt"
    />
  );
}

function SolutionsBlock({
  id,
  headingId,
  base,
  items,
  icons,
  cta,
  tone,
}: {
  id: string;
  headingId: string;
  base: string;
  items: readonly string[];
  icons: Record<string, IconName>;
  cta: { to: string; labelKey: string };
  tone: "default" | "alt";
}) {
  const { t } = useI18n();

  return (
    <PublicSection id={id} labelledBy={headingId} tone={tone}>
      <Container size="2xl" className="max-w-[var(--kr-container-public)]">
        <SectionHeading
          id={headingId}
          eyebrow={t(`${base}.eyebrow`)}
          title={t(`${base}.title`)}
          description={t(`${base}.description`)}
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--kr-radius-md)] bg-[color:var(--kr-surface-muted)] text-[color:var(--kr-primary-text)]"
              >
                <Icon name={icons[item]} size={18} />
              </span>
              <div>
                <h3 className="text-[length:var(--kr-text-h5)] font-semibold text-[color:var(--kr-fg)]">
                  {t(`${base}.items.${item}.title`)}
                </h3>
                <p className="mt-1 text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                  {t(`${base}.items.${item}.description`)}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <AppLink to={cta.to} variant="link" trailingIcon={<Icon name="arrowRight" size={16} />}>
            {t(cta.labelKey)}
          </AppLink>
        </div>
        <p className="mt-4 max-w-[70ch] text-[length:var(--kr-text-caption)] text-[color:var(--kr-fg-muted)]">
          {t(`${base}.statusNote`)}
        </p>
      </Container>
    </PublicSection>
  );
}
