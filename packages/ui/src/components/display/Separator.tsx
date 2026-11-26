import { cn } from "../../lib/cn";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  /** Use when the separator conveys grouping semantics (announced to AT). */
  label?: string;
}

/** Decorative by default (aria-hidden); pass `label` to expose as a separator role. */
export function Separator({ orientation = "horizontal", className, label }: SeparatorProps) {
  const isVertical = orientation === "vertical";
  return (
    <div
      role={label ? "separator" : undefined}
      aria-orientation={label ? orientation : undefined}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      className={cn(
        "bg-[color:var(--kr-border)]",
        isVertical ? "h-full w-px" : "h-px w-full",
        className,
      )}
    />
  );
}
