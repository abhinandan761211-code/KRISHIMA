import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type BadgeTone = "neutral" | "primary" | "success" | "error" | "warning" | "info";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-[color:var(--kr-badge-bg)] text-[color:var(--kr-badge-fg)]",
  primary: "bg-[color:var(--kr-primary-subtle)] text-[color:var(--kr-primary-fg-on-subtle)]",
  success: "bg-[color:var(--kr-success-bg)] text-[color:var(--kr-success)]",
  error: "bg-[color:var(--kr-error-bg)] text-[color:var(--kr-error)]",
  warning: "bg-[color:var(--kr-warning-bg)] text-[color:var(--kr-warning)]",
  info: "bg-[color:var(--kr-info-bg)] text-[color:var(--kr-info)]",
};

export interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  /** Optional leading icon — never rely on colour alone. */
  icon?: ReactNode;
  className?: string;
}

export function Badge({ tone = "neutral", children, icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--kr-radius-full)] px-2.5 py-0.5 text-xs font-semibold",
        TONES[tone],
        className,
      )}
    >
      {icon && (
        <span aria-hidden="true" className="inline-flex">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}
