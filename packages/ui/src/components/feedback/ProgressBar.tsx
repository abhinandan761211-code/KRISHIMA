import { cn } from "../../lib/cn";

export type ProgressTone = "primary" | "success" | "error";

const TONE: Record<ProgressTone, string> = {
  primary: "bg-[color:var(--kr-primary)]",
  success: "bg-[color:var(--kr-success)]",
  error: "bg-[color:var(--kr-error)]",
};

/** Linear progress. Uses the native progressbar role with an accessible name. */
export function ProgressBar({
  value,
  max = 100,
  label,
  tone = "primary",
  className,
}: {
  value: number;
  max?: number;
  label: string;
  tone?: ProgressTone;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-[var(--kr-radius-full)] bg-[color:var(--kr-surface-secondary)]"
      >
        <div
          className={cn("h-full rounded-[var(--kr-radius-full)] transition-[width] duration-[var(--kr-motion-base)]", TONE[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-[color:var(--kr-fg-muted)]">
        {label}: {Math.round(pct)}%
      </span>
    </div>
  );
}
