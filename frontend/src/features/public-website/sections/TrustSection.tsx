import { Icon, Container, useI18n } from "@krishima/ui";
import { PublicSection, SectionHeading } from "../components/PublicSection";

/**
 * Trust & security (landing §12).
 *
 * CRITICAL: every item is split into what is IMPLEMENTED TODAY versus what is
 * PLANNED. The implemented list is taken from verified evidence in
 * docs/testing/FOUNDATION_VALIDATION_REPORT.md (JWT verification via JWKS, RLS
 * design + deny-by-default authz, private storage buckets, scrubbed logs,
 * restrictive CORS). No government certification, partnership or compliance
 * claim is made anywhere — none exists to claim (task §5.12).
 */
const IMPLEMENTED = ["auth", "access", "storage", "privacy"] as const;
const PLANNED = ["kyc", "audit", "moderation"] as const;

const IMPLEMENTED_ICONS = {
  auth: "lock",
  access: "shield",
  storage: "box",
  privacy: "fileText",
} as const;

export function TrustSection() {
  const { t } = useI18n();

  return (
    <PublicSection id="trust" labelledBy="trust-heading">
      <Container size="2xl" className="max-w-[var(--kr-container-public)]">
        <SectionHeading
          id="trust-heading"
          eyebrow={t("trust.eyebrow")}
          title={t("trust.title")}
          description={t("trust.description")}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[var(--kr-radius-lg)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-6">
            <h3 className="flex items-center gap-2 text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
              <Icon name="checkCircle" size={20} className="text-[color:var(--kr-success)]" />
              {t("trust.implementedTitle")}
            </h3>
            <ul className="mt-4 flex flex-col gap-4">
              {IMPLEMENTED.map((item) => (
                <li key={item} className="flex gap-3">
                  <Icon
                    name={IMPLEMENTED_ICONS[item]}
                    size={18}
                    className="mt-0.5 shrink-0 text-[color:var(--kr-primary-text)]"
                  />
                  <div>
                    <p className="text-[length:var(--kr-text-sm)] font-semibold text-[color:var(--kr-fg)]">
                      {t(`trust.implemented.${item}.title`)}
                    </p>
                    <p className="mt-0.5 text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                      {t(`trust.implemented.${item}.description`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--kr-radius-lg)] border border-dashed border-[color:var(--kr-border-strong)] bg-[color:var(--kr-bg)] p-6">
            <h3 className="flex items-center gap-2 text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
              <Icon name="clock" size={20} className="text-[color:var(--kr-fg-muted)]" />
              {t("trust.plannedTitle")}
            </h3>
            <ul className="mt-4 flex flex-col gap-4">
              {PLANNED.map((item) => (
                <li key={item}>
                  <p className="text-[length:var(--kr-text-sm)] font-semibold text-[color:var(--kr-fg)]">
                    {t(`trust.planned.${item}.title`)}
                  </p>
                  <p className="mt-0.5 text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
                    {t(`trust.planned.${item}.description`)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[length:var(--kr-text-caption)] text-[color:var(--kr-fg-muted)]">
              {t("trust.disclaimer")}
            </p>
          </div>
        </div>
      </Container>
    </PublicSection>
  );
}
