import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

/** Native <select> — keyboard- and mobile-friendly for low-cost devices. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, error, options, placeholder, className, id, required, ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = error ? `${selectId}-error` : undefined;
  const hintId = hint ? `${selectId}-hint` : undefined;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[color:var(--kr-fg-body)]">
          {label}
          {required && (
            <span className="ml-0.5 text-[color:var(--kr-error)]" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
        className={cn(
          "min-h-[var(--kr-touch-target)] w-full appearance-none rounded-[var(--kr-radius-md)] border",
          "bg-[color:var(--kr-input-bg)] bg-[length:16px] bg-[right_12px_center] bg-no-repeat px-3 pr-9 text-[15px]",
          "text-[color:var(--kr-input-fg)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:bg-[color:var(--kr-input-bg-disabled)] disabled:text-[color:var(--kr-disabled-fg)]",
          error
            ? "border-[color:var(--kr-input-border-error)]"
            : "border-[color:var(--kr-input-border)]",
          className,
        )}
        style={{
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)",
          backgroundPosition: "calc(100% - 18px) 55%, calc(100% - 13px) 55%",
          backgroundSize: "5px 5px, 5px 5px",
        }}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-[color:var(--kr-error)]">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-[color:var(--kr-fg-muted)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
