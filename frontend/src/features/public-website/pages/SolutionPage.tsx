import { Badge, Icon, useI18n } from "@krishima/ui";
import { PageIntro } from "@/features/public-website/components/PageIntro";
import { PublicSection } from "@/features/public-website/components/PublicSection";
import { AppLink } from "@/features/public-website/components/AppLink";
import { useSeo } from "@/features/public-website/seo/useSeo";
import { PUBLIC_ROLES, type RoleId } from "@/features/public-website/data/roles";

/**
 * /solutions/:role — one parametric page for all eight categories.
 *
 * A single implementation (not eight near-identical files) guarantees the eight
 * pages cannot drift in structure, accessibility or status labelling; only the
 * copy and the highlight list change, both of which live in the catalogue.
 */
const HIGHLIGHT_COUNT = 4 as const;

export function SolutionPage({ roleId }: { roleId: RoleId }) {
  const { t } = useI18n();
  const role = PUBLIC_ROLES.find((r) => r.id === roleId);
  if (!role) throw new Error(`Unknown solution role: ${roleId}`);

  const base = `roles.${roleId}`;
  const accent = `var(--kr-${role.accent})`;

  useSeo({
    titleKey: `${base}.seo.title`,
    descriptionKey: `${base}.seo.description`,
    path: role.href,
    imagePath: "/images/og-default.svg",
  });

  return (
    <>
      <PageIntro eyebrow={t(`${base}.name`)} title={t(`${base}.headline`)} description={t(`${base}.long`)}>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="neutral" icon={<Icon name="clock" size={14} />}>
            {t("features.planned")}
          </Badge>
          <p className="text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-muted)]">{t("rolesPage.statusNote")}</p>
        </div>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <AppLink to="/contact" variant="secondary">
            {t("rolesPage.talkToUs")}
          </AppLink>
          <AppLink to="/services" variant="link">
            {t("cta.exploreServices")}
          </AppLink>
        </div>
      </PageIntro>

      <PublicSection labelledBy="role-highlights-heading">
        <div className="mx-auto w-full max-w-[var(--kr-container-public)] px-4 sm:px-6 lg:px-8">
          <h2 id="role-highlights-heading" className="text-[1.75rem] font-semibold text-[color:var(--kr-fg)]">
            {t("rolesPage.highlightsTitle")}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: HIGHLIGHT_COUNT }, (_, i) => i + 1).map((n) => (
              <li
                key={n}
                className="flex gap-3 rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--kr-radius-md)] bg-[color:var(--kr-surface-muted)]"
                  style={{ color: accent }}
                >
                  <Icon name={role.icon} size={18} />
                </span>
                <div>
                  <h3 className="text-[length:var(--kr-text-h5)] font-semibold text-[color:var(--kr-fg)]">
                    {t(`${base}.highlights.h${n}.title`)}
                  </h3>
                  <p className="mt-1 text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                    {t(`${base}.highlights.h${n}.body`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <section
              aria-labelledby="role-needs-heading"
              className="rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5"
            >
              <h2 id="role-needs-heading" className="text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
                {t("rolesPage.needsTitle")}
              </h2>
              <p className="mt-2 text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                {t(`${base}.needs`)}
              </p>
            </section>
            <section
              aria-labelledby="role-requirements-heading"
              className="rounded-[var(--kr-radius-card)] border border-dashed border-[color:var(--kr-border-strong)] bg-[color:var(--kr-bg)] p-5"
            >
              <h2
                id="role-requirements-heading"
                className="text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]"
              >
                {t("rolesPage.requirementsTitle")}
              </h2>
              <p className="mt-2 text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                {t(`${base}.requirements`)}
              </p>
            </section>
          </div>

          <nav aria-label={t("rolesPage.otherRoles")} className="mt-10">
            <h2 className="text-[length:var(--kr-text-h5)] font-semibold text-[color:var(--kr-fg)]">
              {t("rolesPage.otherRoles")}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {PUBLIC_ROLES.filter((r) => r.id !== roleId).map((r) => (
                <li key={r.id}>
                  <AppLink to={r.href} variant="secondary" size="sm">
                    <Icon name={r.icon} size={16} />
                    {t(`roles.${r.id}.name`)}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </PublicSection>
    </>
  );
}
