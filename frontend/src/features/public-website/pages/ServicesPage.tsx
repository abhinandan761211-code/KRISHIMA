import { Badge, Icon, useI18n } from "@krishima/ui";
import { PageIntro } from "@/features/public-website/components/PageIntro";
import { PublicSection } from "@/features/public-website/components/PublicSection";
import { AppLink } from "@/features/public-website/components/AppLink";
import { RoleCard } from "@/features/public-website/components/RoleCard";
import { useSeo } from "@/features/public-website/seo/useSeo";
import { PUBLIC_FEATURES, type FeatureId } from "@/features/public-website/data/features";
import { PUBLIC_ROLES } from "@/features/public-website/data/roles";

/**
 * /services — the service catalogue.
 *
 * Shows the same ten services as the landing Bento grid, but with the audience
 * each one serves. Every card carries a status badge; nothing offers "book" or
 * "buy", because no service is live yet (AGENTS §8).
 */
export function ServicesPage() {
  const { t } = useI18n();
  useSeo({
    titleKey: "meta.services.title",
    descriptionKey: "meta.services.description",
    path: "/services",
    imagePath: "/images/og-default.jpg",
  });

  return (
    <>
      <PageIntro
        eyebrow={t("servicesPage.eyebrow")}
        title={t("servicesPage.title")}
        description={t("servicesPage.description")}
      >
        <p className="max-w-[64ch] text-[length:var(--kr-text-body)] leading-relaxed text-[color:var(--kr-fg-body)]">
          {t("servicesPage.intro")}
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <AppLink to="/how-it-works" variant="secondary">
            {t("nav.howItWorks")}
          </AppLink>
          <AppLink to="/contact" variant="link">
            {t("servicesPage.contactCta")}
          </AppLink>
        </div>
      </PageIntro>

      <PublicSection labelledBy="services-list-heading">
        <div className="mx-auto w-full max-w-[var(--kr-container-public)] px-4 sm:px-6 lg:px-8">
          <h2 id="services-list-heading" className="text-[1.75rem] font-semibold text-[color:var(--kr-fg)]">
            {t("servicesPage.listTitle")}
          </h2>
          <p className="mt-2 max-w-[64ch] text-[length:var(--kr-text-body)] text-[color:var(--kr-fg-body)]">
            {t("servicesPage.listDescription")}
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            {PUBLIC_FEATURES.map((feature) => (
              <li
                key={feature.id}
                className={[
                  "flex flex-col gap-3 rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5",
                  feature.span === "wide" ? "md:col-span-2" : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--kr-radius-md)] bg-[color:var(--kr-primary-subtle)] text-[color:var(--kr-primary-fg-on-subtle)]"
                  >
                    <Icon name={feature.icon} size={22} />
                  </span>
                  <Badge tone="neutral">{t("features.planned")}</Badge>
                </div>
                <h3 className="text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
                  {t(`features.${feature.id}.title`)}
                </h3>
                <p className="text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                  {t(`features.${feature.id}.description`)}
                </p>
                <p className="mt-auto pt-2 text-[length:var(--kr-text-caption)] text-[color:var(--kr-fg-muted)]">
                  {t(`servicesPage.audience.${feature.id satisfies FeatureId}`)}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-8 rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface-secondary)] p-5 text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-body)]">
            {t("servicesPage.statusNote")}
          </p>
        </div>
      </PublicSection>

      <PublicSection tone="alt" labelledBy="services-roles-heading">
        <div className="mx-auto w-full max-w-[var(--kr-container-public)] px-4 sm:px-6 lg:px-8">
          <h2 id="services-roles-heading" className="text-[1.75rem] font-semibold text-[color:var(--kr-fg)]">
            {t("servicesPage.rolesTitle")}
          </h2>
          <p className="mt-2 max-w-[64ch] text-[length:var(--kr-text-body)] text-[color:var(--kr-fg-body)]">
            {t("servicesPage.rolesDescription")}
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PUBLIC_ROLES.map((role) => (
              <RoleCard key={role.id} role={role} />
            ))}
          </ul>
        </div>
      </PublicSection>
    </>
  );
}
