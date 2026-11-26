import { Icon } from "@krishima/ui";
import { useI18n } from "@krishima/ui";
import type { PublicRole } from "../data/roles";
import { AppLink } from "./AppLink";

/**
 * Account-category card used by the landing grid and the solutions hub.
 *
 * The whole card is NOT a click target wrapping text: the title is a real link
 * and it stretches to fill the card with `after:absolute after:inset-0`. That
 * keeps one tab stop per card, one crawlable anchor, and a card-sized touch
 * target — while screen readers still announce a correctly labelled link.
 */
export function RoleCard({ role }: { role: PublicRole }) {
  const { t } = useI18n();
  const base = `roles.${role.id}`;
  const accent = `var(--kr-${role.accent})`;

  return (
    <li className="group relative flex flex-col gap-3 rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5 transition-colors duration-[var(--kr-motion-base)] hover:border-[color:var(--kr-border-strong)] focus-within:border-[color:var(--kr-border-strong)]">
      <span
        aria-hidden="true"
        className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--kr-radius-md)]"
        style={{ color: accent, backgroundColor: "var(--kr-surface-muted)" }}
      >
        <Icon name={role.icon} size={22} />
      </span>
      <h3 className="text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
        <AppLink
          to={role.href}
          variant="link"
          className="text-[color:var(--kr-fg)] no-underline after:absolute after:inset-0 after:content-[''] hover:text-[color:var(--kr-primary-text)] hover:no-underline"
        >
          {t(`${base}.name`)}
        </AppLink>
      </h3>
      <p className="text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
        {t(`${base}.short`)}
      </p>
      <span
        aria-hidden="true"
        className="mt-auto inline-flex items-center gap-1 pt-1 text-[length:var(--kr-text-sm)] font-semibold text-[color:var(--kr-primary-text)]"
      >
        {t("roles.learnMore")}
        <Icon name="arrowRight" size={16} />
      </span>
    </li>
  );
}
