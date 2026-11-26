import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface TimelineEntry {
  key: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: ReactNode;
  tone?: "default" | "success" | "warning" | "error";
}

const DOT: Record<string, string> = {
  default: "bg-[color:var(--kr-border-strong)]",
  success: "bg-[color:var(--kr-success)]",
  warning: "bg-[color:var(--kr-warning)]",
  error: "bg-[color:var(--kr-error)]",
};

/** Vertical activity timeline. Ordered list semantics for screen readers. */
export function Timeline({ items, label }: { items: TimelineEntry[]; label: string }) {
  return (
    <ol aria-label={label} className="relative flex flex-col gap-5 border-l border-[color:var(--kr-border)] pl-6">
      {items.map((item) => (
        <li key={item.key} className="relative">
          <span
            aria-hidden="true"
            className={cn(
              "absolute -left-[calc(1.5rem+5px)] top-1 h-2.5 w-2.5 rounded-full ring-2 ring-[color:var(--kr-surface)]",
              DOT[item.tone ?? "default"],
            )}
          />
          <p className="text-sm font-medium text-[color:var(--kr-fg)]">{item.title}</p>
          {item.description && (
            <p className="text-sm text-[color:var(--kr-fg-muted)]">{item.description}</p>
          )}
          <time className="text-xs text-[color:var(--kr-fg-placeholder)]">{item.timestamp}</time>
        </li>
      ))}
    </ol>
  );
}
