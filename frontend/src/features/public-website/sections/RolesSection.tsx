import { Container, useI18n } from "@krishima/ui";
import { PublicSection, SectionHeading } from "../components/PublicSection";
import { RoleCard } from "../components/RoleCard";
import { PUBLIC_ROLES } from "../data/roles";

/**
 * Account categories (landing §4) — eight role cards mapping to /solutions/*.
 */
export function RolesSection() {
  const { t } = useI18n();

  return (
    <PublicSection id="accounts" labelledBy="accounts-heading">
      <Container size="2xl" className="max-w-[var(--kr-container-public)]">
        <SectionHeading
          id="accounts-heading"
          eyebrow={t("roles.eyebrow")}
          title={t("roles.title")}
          description={t("roles.description")}
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PUBLIC_ROLES.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </ul>
        <p className="mt-6 max-w-[80ch] text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-muted)]">
          {t("roles.footnote")}
        </p>
      </Container>
    </PublicSection>
  );
}
