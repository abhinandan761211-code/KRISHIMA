import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

/** Dashboard tile: title, optional icon/accent, content and footer link. */
export function DashboardCard({
  title,
  icon,
  accentVar,
  footer,
  children,
  className,
}: {
  title: string;
  icon?: ReactNode;
  /** CSS variable name for a module accent, e.g. "var(--kr-mod-farmer)". */
  accentVar?: string;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        {icon && (
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--kr-radius-md)] bg-[color:var(--kr-surface-muted)]"
            style={accentVar ? { color: accentVar } : undefined}
          >
            {icon}
          </span>
        )}
        <h3 className="text-[15px] font-semibold text-[color:var(--kr-fg)]">{title}</h3>
      </div>
      <div className="flex-1 text-[15px] text-[color:var(--kr-fg-muted)]">{children}</div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}

export interface StatisticCardProps {
  label: string;
  value: ReactNode;
  /** Change indicator, e.g. "+12%" — includes its own text for colour independence. */
  delta?: { value: string; direction: "up" | "down" | "flat" };
  icon?: ReactNode;
  accentVar?: string;
  className?: string;
}

const DELTA_TONE = {
  up: "text-[color:var(--kr-success)]",
  down: "text-[color:var(--kr-error)]",
  flat: "text-[color:var(--kr-fg-muted)]",
} as const;

const DELTA_GLYPH = { up: "▲", down: "▼", flat: "■" } as const;

/** Key metric. Numerals use tabular figures so columns align. */
export function StatisticCard({
  label,
  value,
  delta,
  icon,
  accentVar,
  className,
}: StatisticCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-[color:var(--kr-fg-muted)]">{label}</span>
        {icon && (
          <span aria-hidden="true" style={accentVar ? { color: accentVar } : undefined}>
            {icon}
          </span>
        )}
      </div>
      <div className="mt-1 text-[length:var(--kr-text-h2)] font-semibold tabular-nums text-[color:var(--kr-fg)]">
        {value}
      </div>
      {delta && (
        <p className={cn("mt-1 text-sm font-medium", DELTA_TONE[delta.direction])}>
          <span aria-hidden="true">{DELTA_GLYPH[delta.direction]} </span>
          {delta.value}
        </p>
      )}
    </div>
  );
}
