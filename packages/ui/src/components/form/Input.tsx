import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  leadingIcon?: ReactNode;
  inputSize?: "sm" | "md";
}

/**
 * Text input with label, hint and error. The error is wired with
 * aria-invalid + aria-describedby so screen readers announce it.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, leadingIcon, inputSize = "md", className, id, required, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;
  const invalid = Boolean(error);

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[color:var(--kr-fg-body)]">
          {label}
          {required && (
            <span className="ml-0.5 text-[color:var(--kr-error)]" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative">
        {leadingIcon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--kr-fg-placeholder)]"
          >
            {leadingIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          required={required}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-[var(--kr-radius-md)] border bg-[color:var(--kr-input-bg)]",
            "text-[color:var(--kr-input-fg)] placeholder:text-[color:var(--kr-input-placeholder)]",
            "transition-colors duration-[var(--kr-motion-fast)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-1",
            "disabled:cursor-not-allowed disabled:bg-[color:var(--kr-input-bg-disabled)] disabled:text-[color:var(--kr-disabled-fg)]",
            "read-only:bg-[color:var(--kr-surface-secondary)]",
            inputSize === "sm" ? "min-h-[36px] px-3 text-sm" : "min-h-[var(--kr-touch-target)] px-3 text-[15px]",
            leadingIcon ? "pl-9" : undefined,
            invalid
              ? "border-[color:var(--kr-input-border-error)]"
              : "border-[color:var(--kr-input-border)] focus-visible:border-[color:var(--kr-input-border-focus)]",
            className,
          )}
          {...rest}
        />
      </div>
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
