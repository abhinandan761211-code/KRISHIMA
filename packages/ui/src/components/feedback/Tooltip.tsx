import { useId, type ReactNode } from "react";
import { cn } from "../../lib/cn";

/**
 * Tooltip shown on hover AND focus. The trigger must be focusable.
 * Content is exposed via aria-describedby, so it is available to screen readers.
 */
export function Tooltip({
  content,
  children,
  side = "top",
}: {
  content: string;
  children: ReactNode;
  side?: "top" | "bottom";
}) {
  const id = useId();
  return (
    <span className="group relative inline-flex" aria-describedby={id}>
      {children}
      <span
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-40 w-max max-w-[240px] -translate-x-1/2 rounded-[var(--kr-radius-sm)] px-2 py-1 text-xs",
          "bg-[color:var(--kr-tooltip-bg)] text-[color:var(--kr-tooltip-fg)] opacity-0 shadow-[var(--kr-shadow-sm)]",
          "transition-opacity duration-[var(--kr-motion-fast)] group-hover:opacity-100 group-focus-within:opacity-100",
          "motion-reduce:transition-none",
          side === "top" ? "bottom-full mb-1.5" : "top-full mt-1.5",
        )}
      >
        {content}
      </span>
    </span>
  );
}
