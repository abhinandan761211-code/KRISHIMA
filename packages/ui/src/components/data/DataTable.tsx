import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface Column<T> {
  key: string;
  header: string;
  /** Cell renderer. */
  cell: (row: T) => ReactNode;
  /** Numeric columns right-align and use tabular figures. */
  numeric?: boolean;
  /** Hide on small screens instead of forcing horizontal scrolling. */
  hideBelow?: "sm" | "md" | "lg";
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  caption: string;
  emptyState?: ReactNode;
  loading?: boolean;
  className?: string;
}

const HIDE: Record<string, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
};

/**
 * Accessible data table.
 * - Real <table> semantics with a <caption> that names the table.
 * - Below `md`, switches from a grid table to stacked rows (no horizontal scroll).
 * - Loading renders skeleton rows, preserving column layout.
 */
export function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  emptyState,
  loading = false,
  className,
}: DataTableProps<T>) {
  if (!loading && rows.length === 0) {
    return <div className={className}>{emptyState ?? <p className="p-6 text-sm">No records.</p>}</div>;
  }

  return (
    <div className={cn("w-full overflow-hidden rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)]", className)}>
      <table className="w-full border-collapse text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-[color:var(--kr-table-header-bg)]">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={cn(
                  "whitespace-nowrap px-4 py-3 font-semibold text-[color:var(--kr-fg-muted)]",
                  c.numeric && "text-right",
                  c.hideBelow && HIDE[c.hideBelow],
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={`s${i}`} aria-hidden={i > 0 ? true : undefined}>
                  {columns.map((c) => (
                    <td key={c.key} className={cn("px-4 py-3", c.hideBelow && HIDE[c.hideBelow])}>
                      <span className="block h-4 w-full max-w-[120px] animate-pulse rounded bg-[color:var(--kr-skeleton-bg)] motion-reduce:animate-none" />
                    </td>
                  ))}
                </tr>
              ))
            : rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-t border-[color:var(--kr-border)] hover:bg-[color:var(--kr-table-row-hover)]"
                >
                  {columns.map((c) => (
                    <td
                      key={c.key}
                      data-label={c.header}
                      className={cn(
                        "px-4 py-3 text-[color:var(--kr-fg-body)]",
                        c.numeric && "text-right tabular-nums",
                        c.hideBelow && HIDE[c.hideBelow],
                      )}
                    >
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
