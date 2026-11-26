import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

/**
 * Page header: title, optional description and action slot.
 * Renders an <h1> so every page has exactly one top-level heading.
 */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 border-b border-[color:var(--kr-border)] pb-4", className)}>
      {breadcrumb}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[length:var(--kr-text-h2)] font-semibold leading-tight text-[color:var(--kr-fg)]">
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-2xl text-[15px] text-[color:var(--kr-fg-muted)]">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
