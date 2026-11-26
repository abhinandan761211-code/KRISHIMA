import { Icon, Container, useI18n } from "@krishima/ui";
import { PublicSection, SectionHeading } from "../components/PublicSection";

/**
 * Community & knowledge (landing §11).
 *
 * This is a PLANNED area (no social/community module exists). It is written in
 * the future tense and carries no fake activity counters, no "join the
 * discussion" link and no creator profiles.
 */
const PILLARS = ["knowledge", "video", "community"] as const;
const ICONS = { knowledge: "book", video: "video", community: "message" } as const;

export function CommunitySection() {
  const { t } = useI18n();

  return (
    <PublicSection id="community" labelledBy="community-heading" tone="alt">
      <Container size="2xl" className="max-w-[var(--kr-container-public)]">
        <SectionHeading
          id="community-heading"
          eyebrow={t("community.eyebrow")}
          title={t("community.title")}
          description={t("community.description")}
        />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <li
              key={pillar}
              className="flex flex-col gap-3 rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-6"
            >
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--kr-radius-md)] bg-[color:var(--kr-primary-subtle)] text-[color:var(--kr-primary-fg-on-subtle)]"
              >
                <Icon name={ICONS[pillar]} size={22} />
              </span>
              <h3 className="text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
                {t(`community.pillars.${pillar}.title`)}
              </h3>
              <p className="text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                {t(`community.pillars.${pillar}.description`)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-[70ch] text-[length:var(--kr-text-caption)] text-[color:var(--kr-fg-muted)]">
          {t("community.statusNote")}
        </p>
      </Container>
    </PublicSection>
  );
}
