import { cn } from "../../lib/cn";

export type SpinnerSize = "sm" | "md" | "lg";

const SIZES: Record<SpinnerSize, string> = { sm: "h-4 w-4 border-2", md: "h-6 w-6 border-2", lg: "h-9 w-9 border-[3px]" };

/**
 * Loading spinner. `label` becomes the accessible name (role="status").
 * Pass `decorative` when an adjacent live region already announces loading.
 */
export function Spinner({
  size = "md",
  label = "Loading",
  decorative = false,
  className,
}: {
  size?: SpinnerSize;
  label?: string;
  decorative?: boolean;
  className?: string;
}) {
  return (
    <span
      role={decorative ? undefined : "status"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block animate-spin rounded-full border-current border-t-transparent motion-reduce:animate-none",
          "text-[color:var(--kr-primary)]",
          SIZES[size],
        )}
      />
      {!decorative && <span className="sr-only">{label}</span>}
    </span>
  );
}
