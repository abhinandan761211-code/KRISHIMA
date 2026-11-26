import { cn } from "../../lib/cn";

/** Skeleton placeholder. aria-hidden by default; the region should be aria-busy. */
export function Skeleton({
  className,
  variant = "text",
}: {
  className?: string;
  variant?: "text" | "circle" | "rect";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block animate-pulse bg-[color:var(--kr-skeleton-bg)] motion-reduce:animate-none",
        variant === "circle" ? "rounded-full" : variant === "rect" ? "rounded-[var(--kr-radius-md)]" : "h-4 rounded-[var(--kr-radius-sm)]",
        className,
      )}
    />
  );
}

/** Multi-line text skeleton. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <span className={cn("flex flex-col gap-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={i === lines - 1 ? "w-2/3" : "w-full"} />
      ))}
    </span>
  );
}
