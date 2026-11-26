import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, id, required, rows = 4, ...rest },
  ref,
) {
  const autoId = useId();
  const areaId = id ?? autoId;
  const errorId = error ? `${areaId}-error` : undefined;
  const hintId = hint ? `${areaId}-hint` : undefined;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label htmlFor={areaId} className="text-sm font-medium text-[color:var(--kr-fg-body)]">
          {label}
          {required && (
            <span className="ml-0.5 text-[color:var(--kr-error)]" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={[errorId, hintId].filter(Boolean).join(" ") || undefined}
        className={cn(
          "w-full resize-y rounded-[var(--kr-radius-md)] border bg-[color:var(--kr-input-bg)] px-3 py-2.5",
          "text-[15px] text-[color:var(--kr-input-fg)] placeholder:text-[color:var(--kr-input-placeholder)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:bg-[color:var(--kr-input-bg-disabled)]",
          error
            ? "border-[color:var(--kr-input-border-error)]"
            : "border-[color:var(--kr-input-border)]",
          className,
        )}
        {...rest}
      />
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
