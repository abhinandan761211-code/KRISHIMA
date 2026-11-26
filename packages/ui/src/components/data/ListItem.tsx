import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

/** Generic list row: leading visual, title/description, trailing content. */
export function ListItem({
  leading,
  title,
  description,
  trailing,
  onClick,
  className,
}: {
  leading?: ReactNode;
  title: string;
  description?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const content = (
    <>
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-[color:var(--kr-fg)]">{title}</p>
        {description && (
          <p className="truncate text-sm text-[color:var(--kr-fg-muted)]">{description}</p>
        )}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </>
  );

  const base = "flex min-h-[var(--kr-touch-target)] items-center gap-3 px-4 py-3";

  return onClick ? (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        base,
        "w-full text-left hover:bg-[color:var(--kr-surface-muted)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--kr-focus-ring)]",
        className,
      )}
    >
      {content}
    </button>
  ) : (
    <div className={cn(base, className)}>{content}</div>
  );
}
