import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type AlertTone = "info" | "success" | "warning" | "error";

const TONE: Record<AlertTone, { box: string; icon: string; glyph: string; label: string }> = {
  info: {
    box: "bg-[color:var(--kr-info-bg)] border-[color:var(--kr-info)]",
    icon: "text-[color:var(--kr-info)]",
    glyph: "ℹ",
    label: "Information",
  },
  success: {
    box: "bg-[color:var(--kr-success-bg)] border-[color:var(--kr-success)]",
    icon: "text-[color:var(--kr-success)]",
    glyph: "✓",
    label: "Success",
  },
  warning: {
    box: "bg-[color:var(--kr-warning-bg)] border-[color:var(--kr-warning)]",
    icon: "text-[color:var(--kr-warning)]",
    glyph: "!",
    label: "Warning",
  },
  error: {
    box: "bg-[color:var(--kr-error-bg)] border-[color:var(--kr-error)]",
    icon: "text-[color:var(--kr-error)]",
    glyph: "✕",
    label: "Error",
  },
};

/**
 * Inline alert. Icon + text label carry the meaning — colour is never the only cue.
 * Errors/warnings use role="alert"; others use role="status".
 */
export function Alert({
  tone = "info",
  title,
  children,
  action,
  className,
}: {
  tone?: AlertTone;
  title?: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const t = TONE[tone];
  return (
    <div
      role={tone === "error" || tone === "warning" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-[var(--kr-radius-md)] border-l-4 p-4", t.box, className)}
    >
      <span aria-hidden="true" className={cn("mt-0.5 text-base font-bold", t.icon)}>
        {t.glyph}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-[color:var(--kr-fg)]">
          <span className="sr-only">{t.label}: </span>
          {title}
        </p>
        {children && <div className="mt-1 text-sm text-[color:var(--kr-fg-body)]">{children}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
