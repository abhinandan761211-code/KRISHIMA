import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

/**
 * Wrapper for charts. Provides the title, an accessible text summary (charts are
 * images to AT), and a fixed aspect box to prevent layout shift.
 * The chart implementation itself is supplied by the consuming feature.
 */
export function ChartContainer({
  title,
  description,
  summary,
  height = 240,
  children,
  className,
}: {
  title: string;
  description?: string;
  /** Text alternative describing the data (required for accessibility). */
  summary: string;
  height?: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={cn("rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5", className)}>
      <figcaption className="mb-1 text-sm font-semibold text-[color:var(--kr-fg)]">
        {title}
      </figcaption>
      {description && <p className="mb-3 text-sm text-[color:var(--kr-fg-muted)]">{description}</p>}
      <div role="img" aria-label={`${title}. ${summary}`} style={{ height }} className="w-full">
        <div aria-hidden="true" className="h-full w-full">
          {children}
        </div>
      </div>
      <p className="sr-only">{summary}</p>
    </figure>
  );
}
