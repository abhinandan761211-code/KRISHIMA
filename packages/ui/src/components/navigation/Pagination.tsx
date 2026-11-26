import { cn } from "../../lib/cn";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Visible page-number buttons around the current page. */
  siblings?: number;
  className?: string;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);
}

/** Page navigation with a bounded window and ellipses. Fully keyboard operable. */
export function Pagination({ page, totalPages, onPageChange, siblings = 1, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const start = Math.max(2, page - siblings);
  const end = Math.min(totalPages - 1, page + siblings);
  const pages: (number | "…")[] = [1];
  if (start > 2) pages.push("…");
  pages.push(...range(start, end));
  if (end < totalPages - 1) pages.push("…");
  if (totalPages > 1) pages.push(totalPages);

  const btn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-[var(--kr-radius-md)] px-2 text-sm font-medium " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-1 " +
    "disabled:cursor-not-allowed disabled:text-[color:var(--kr-disabled-fg)]";

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        className={cn(btn, "border border-[color:var(--kr-border)] text-[color:var(--kr-fg-body)] hover:bg-[color:var(--kr-surface-muted)]")}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-[color:var(--kr-fg-placeholder)]" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            className={cn(
              btn,
              p === page
                ? "bg-[color:var(--kr-primary)] text-[color:var(--kr-primary-fg)]"
                : "border border-[color:var(--kr-border)] text-[color:var(--kr-fg-body)] hover:bg-[color:var(--kr-surface-muted)]",
            )}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        className={cn(btn, "border border-[color:var(--kr-border)] text-[color:var(--kr-fg-body)] hover:bg-[color:var(--kr-surface-muted)]")}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}
