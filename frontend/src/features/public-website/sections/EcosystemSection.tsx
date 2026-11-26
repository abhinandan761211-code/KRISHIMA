import { Icon, Container, useI18n } from "@krishima/ui";
import { PublicSection, SectionHeading } from "../components/PublicSection";

/**
 * Connected ecosystem (landing §6).
 *
 * An accessible, dependency-free explanation of how the participants interact.
 * The SVG holds ZERO information: every relationship is also written as text in
 * the ordered list beside it, so screen-reader users get the full model and the
 * diagram never depends on colour or position.
 *
 * Hub-and-spoke geometry is drawn with CSS grid + one decorative SVG ring, not a
 * charting library (task §5.6).
 */
const PARTICIPANTS = ["farmer", "buyer", "retailer", "worker", "equipment", "transporter", "warehouse", "creator"] as const;

export function EcosystemSection() {
  const { t } = useI18n();

  return (
    <PublicSection id="ecosystem" labelledBy="ecosystem-heading">
      <Container size="2xl" className="max-w-[var(--kr-container-public)]">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeading
              id="ecosystem-heading"
              eyebrow={t("ecosystem.eyebrow")}
              title={t("ecosystem.title")}
              description={t("ecosystem.description")}
            />
            <ol className="mt-8 flex flex-col gap-4">
              {PARTICIPANTS.map((id, index) => (
                <li key={id} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--kr-radius-full)] bg-[color:var(--kr-primary-subtle)] text-[length:var(--kr-text-caption)] font-bold text-[color:var(--kr-primary-fg-on-subtle)]"
                  >
                    {index + 1}
                  </span>
                  <p className="text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                    <span className="font-semibold text-[color:var(--kr-fg)]">{t(`ecosystem.links.${id}.from`)}</span>{" "}
                    {t(`ecosystem.links.${id}.relation`)}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative aspect-square w-full max-w-[460px] justify-self-center">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
              <circle cx="100" cy="100" r="78" fill="none" stroke="var(--kr-illustration-stroke)" strokeWidth="1" strokeDasharray="3 4" />
              <circle cx="100" cy="100" r="52" fill="var(--kr-illustration-fill)" />
              <circle cx="100" cy="100" r="52" fill="none" stroke="var(--kr-illustration-stroke)" strokeWidth="1" />
            </svg>
            <div className="absolute left-1/2 top-1/2 flex h-[30%] w-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[var(--kr-radius-full)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] text-center shadow-[var(--kr-shadow-xs)]">
              <Icon name="sprout" size={22} className="text-[color:var(--kr-primary-text)]" />
              <span className="mt-1 text-[length:var(--kr-text-caption)] font-semibold text-[color:var(--kr-fg)]">
                {t("ecosystem.hub")}
              </span>
            </div>
            {PARTICIPANTS.map((id, index) => {
              const angle = (index / PARTICIPANTS.length) * 2 * Math.PI - Math.PI / 2;
              const left = 50 + Math.cos(angle) * 39;
              const top = 50 + Math.sin(angle) * 39;
              return (
                <div
                  key={id}
                  className="absolute flex min-h-[44px] min-w-[44px] max-w-[92px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[var(--kr-radius-full)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] px-2 py-1 text-center text-[11px] font-semibold leading-tight text-[color:var(--kr-fg-body)] shadow-[var(--kr-shadow-xs)]"
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  {t(`ecosystem.nodes.${id}`)}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </PublicSection>
  );
}
