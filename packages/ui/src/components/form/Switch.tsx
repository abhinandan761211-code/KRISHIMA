import { useId } from "react";
import { cn } from "../../lib/cn";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  id?: string;
}

/** Accessible switch using role="switch" (state read as on/off by screen readers). */
export function Switch({ checked, onChange, label, description, disabled, id }: SwitchProps) {
  const autoId = useId();
  const switchId = id ?? autoId;
  const descId = description ? `${switchId}-desc` : undefined;

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex flex-col">
        <label htmlFor={switchId} className="text-[15px] text-[color:var(--kr-fg-body)]">
          {label}
        </label>
        {description && (
          <span id={descId} className="text-sm text-[color:var(--kr-fg-muted)]">
            {description}
          </span>
        )}
      </span>
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={descId}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          // Track is 44x24 visually, but the button expands to a 44px touch target
          // with a transparent hit area around the 24px-high track.
          "relative inline-flex shrink-0 items-center justify-center rounded-[var(--kr-radius-full)]",
          "min-h-[var(--kr-touch-target)] min-w-[var(--kr-touch-target)] px-0 py-[10px]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-[var(--kr-radius-full)] transition-colors",
            checked ? "bg-[color:var(--kr-primary)]" : "bg-[color:var(--kr-input-border)]",
          )}
        >
          <span
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-white shadow-[var(--kr-shadow-xs)] transition-transform",
              "motion-reduce:transition-none",
              checked ? "translate-x-[22px]" : "translate-x-[2px]",
            )}
          />
        </span>
      </button>
    </div>
  );
}
