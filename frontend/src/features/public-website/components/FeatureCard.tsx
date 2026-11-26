import { Badge, Icon, cn } from "@krishima/ui";
import { useI18n } from "@krishima/ui";
import type { PublicFeature } from "../data/features";

/**
 * Bento cell for a platform feature.
 *
 * Truthfulness: a `planned` feature gets a visible "Coming soon" badge and a
 * description in the future tense — it never renders a link or a "Try it"
 * action, because there is nothing to try yet (AGENTS §8).
 */
export function FeatureCard({ feature }: { feature: PublicFeature }) {
  const { t } = useI18n();
  const base = `features.${feature.id}`;
  const planned = feature.status === "planned";

  return (
    <article
      className={cn(
        "flex h-full flex-col gap-3 rounded-[var(--kr-radius-card)] border p-5 md:p-6",
        "border-[color:var(--kr-border)] bg-[color:var(--kr-surface)]",
        feature.span === "wide" && "md:col-span-2",
        feature.span === "tall" && "md:row-span-2",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--kr-radius-md)] bg-[color:var(--kr-primary-subtle)] text-[color:var(--kr-primary-fg-on-subtle)]"
        >
          <Icon name={feature.icon} size={22} />
        </span>
        {planned && <Badge tone="neutral">{t("features.planned")}</Badge>}
      </div>
      <h3 className="text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
        {t(`${base}.title`)}
      </h3>
      <p className="text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
        {t(`${base}.description`)}
      </p>
    </article>
  );
}
