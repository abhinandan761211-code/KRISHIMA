import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: ReactNode;
  description?: string;
  error?: string;
}

/** Checkbox with a 44px hit area and an associated label. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, description, error, className, id, ...rest },
  ref,
) {
  const autoId = useId();
  const boxId = id ?? autoId;
  const descId = description ? `${boxId}-desc` : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={boxId}
        className="flex min-h-[var(--kr-touch-target)] cursor-pointer items-start gap-3 py-1.5"
      >
        <input
          ref={ref}
          id={boxId}
          type="checkbox"
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={descId}
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-[4px] border accent-[color:var(--kr-primary)]",
            error ? "border-[color:var(--kr-error)]" : "border-[color:var(--kr-input-border)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-60",
            className,
          )}
          {...rest}
        />
        <span className="flex flex-col">
          <span className="text-[15px] text-[color:var(--kr-fg-body)]">{label}</span>
          {description && (
            <span id={descId} className="text-sm text-[color:var(--kr-fg-muted)]">
              {description}
            </span>
          )}
        </span>
      </label>
      {error && (
        <p role="alert" className="text-sm text-[color:var(--kr-error)]">
          {error}
        </p>
      )}
    </div>
  );
});
