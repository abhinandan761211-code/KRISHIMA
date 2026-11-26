import { Badge, Icon, Container, useI18n } from "@krishima/ui";
import { PublicSection, SectionHeading } from "../components/PublicSection";

/**
 * Marketplace preview (landing §10) — a CONCEPT mock, not data.
 *
 * Rules enforced here:
 *  - every sample row is static text from the i18n catalogue; no network call,
 *    no price API, no "buy" action;
 *  - the whole card is wrapped by a visible "Illustrative" banner AND each price
 *    is marked with the same wording, so the preview can never be mistaken for
 *    live inventory (task §5.10).
 *
 * The sample crop names are generic (wheat, paddy, tomato) — no sellers, no
 * regions, no numbers that could be read as a real quote.
 */
const SAMPLE_ROWS = ["wheat", "paddy", "tomato"] as const;

export function MarketplacePreviewSection() {
  const { t } = useI18n();

  return (
    <PublicSection id="marketplace-preview" labelledBy="preview-heading">
      <Container size="2xl" className="max-w-[var(--kr-container-public)]">
        <SectionHeading
          id="preview-heading"
          eyebrow={t("preview.eyebrow")}
          title={t("preview.title")}
          description={t("preview.description")}
        />

        <div className="mt-8 overflow-hidden rounded-[var(--kr-radius-lg)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)]">
          <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--kr-border)] bg-[color:var(--kr-warning-bg)] px-4 py-2.5">
            <Badge tone="warning" icon={<Icon name="info" size={14} />}>
              {t("preview.illustrative")}
            </Badge>
            <p className="text-[length:var(--kr-text-sm)] text-[color:var(--kr-warning)]">{t("preview.illustrativeNote")}</p>
          </div>

          <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[1fr_auto]">
            <ul className="divide-y divide-[color:var(--kr-border)]">
              {SAMPLE_ROWS.map((row) => (
                <li key={row} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--kr-radius-md)] bg-[color:var(--kr-surface-muted)] text-[color:var(--kr-primary-text)]"
                    >
                      <Icon name="leaf" size={20} />
                    </span>
                    <div>
                      <p className="text-[length:var(--kr-text-h5)] font-semibold text-[color:var(--kr-fg)]">
                        {t(`preview.rows.${row}.name`)}
                      </p>
                      <p className="text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-muted)]">
                        {t("preview.sampleMeta")}
                      </p>
                    </div>
                  </div>
                  <p className="text-right">
                    <span className="block text-[length:var(--kr-text-h5)] font-semibold tabular-nums text-[color:var(--kr-fg)]">
                      {t(`preview.rows.${row}.price`)}
                    </span>
                    <span className="text-[length:var(--kr-text-caption)] text-[color:var(--kr-fg-muted)]">
                      {t("preview.illustrative")}
                    </span>
                  </p>
                </li>
              ))}
            </ul>

            <aside className="rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-bg)] p-4 lg:w-64">
              <h3 className="text-[length:var(--kr-text-h5)] font-semibold text-[color:var(--kr-fg)]">
                {t("preview.side.title")}
              </h3>
              <ul className="mt-3 flex flex-col gap-2 text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-body)]">
                {(["filters", "verified", "units"] as const).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon name="check" size={16} className="mt-0.5 text-[color:var(--kr-primary-text)]" />
                    {t(`preview.side.${item}`)}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[length:var(--kr-text-caption)] text-[color:var(--kr-fg-muted)]">
                {t("preview.side.disclaimer")}
              </p>
            </aside>
          </div>
        </div>
      </Container>
    </PublicSection>
  );
}
