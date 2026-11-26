import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

/** Empty state: icon, explanation and a primary next action (never a dead end). */
export function EmptyState({
  icon = "◌",
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <span
        aria-hidden="true"
        className="mb-3 flex h-12 w-12 items-center justify-center rounded-[var(--kr-radius-full)] bg-[color:var(--kr-surface-muted)] text-xl text-[color:var(--kr-primary)]"
      >
        {icon}
      </span>
      <h3 className="text-base font-semibold text-[color:var(--kr-fg)]">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-[color:var(--kr-fg-muted)]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Error state: explains what happened, offers retry, and shows a reference id. */
export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
  referenceLabel = "Reference",
  reference,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  /** Override for localisation (the default is English). */
  retryLabel?: string;
  /** Override for localisation (the default is English). */
  referenceLabel?: string;
  /** Support reference (e.g. request id) — safe, non-sensitive. */
  reference?: string;
  className?: string;
}) {
  return (
    <div role="alert" className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <span
        aria-hidden="true"
        className="mb-3 flex h-12 w-12 items-center justify-center rounded-[var(--kr-radius-full)] bg-[color:var(--kr-error-bg)] text-xl text-[color:var(--kr-error)]"
      >
        ✕
      </span>
      <h3 className="text-base font-semibold text-[color:var(--kr-fg)]">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-[color:var(--kr-fg-muted)]">{description}</p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 min-h-[var(--kr-touch-target)] rounded-[var(--kr-radius-md)] bg-[color:var(--kr-primary)] px-4 text-sm font-medium text-[color:var(--kr-primary-fg)] hover:bg-[color:var(--kr-primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2"
        >
          {retryLabel}
        </button>
      )}
      {reference && (
        <p className="mt-3 text-xs text-[color:var(--kr-fg-placeholder)]">
          {referenceLabel}: {reference}
        </p>
      )}
    </div>
  );
}

/** Offline state: shown when the app detects loss of connectivity. */
export function OfflineState({
  title = "You are offline",
  description = "You appear to be offline. Check your connection and try again.",
  retryLabel = "Retry",
  onRetry,
  className,
}: {
  /** Override for localisation (the default is English). */
  title?: string;
  description?: string;
  /** Override for localisation (the default is English). */
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div role="status" className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <span
        aria-hidden="true"
        className="mb-3 flex h-12 w-12 items-center justify-center rounded-[var(--kr-radius-full)] bg-[color:var(--kr-warning-bg)] text-xl text-[color:var(--kr-warning)]"
      >
        ⚠
      </span>
      <h3 className="text-base font-semibold text-[color:var(--kr-fg)]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[color:var(--kr-fg-muted)]">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 min-h-[var(--kr-touch-target)] rounded-[var(--kr-radius-md)] border border-[color:var(--kr-border-strong)] px-4 text-sm font-medium text-[color:var(--kr-fg-body)] hover:bg-[color:var(--kr-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)]"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
