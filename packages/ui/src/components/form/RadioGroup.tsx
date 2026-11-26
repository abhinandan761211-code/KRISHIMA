import { useId, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface RadioOption {
  value: string;
  label: ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Group label (rendered as a fieldset legend). */
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  error?: string;
  orientation?: "vertical" | "horizontal";
}

/**
 * Radio group built on a native fieldset/legend for correct semantics and
 * native arrow-key navigation within the group.
 */
export function RadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  error,
  orientation = "vertical",
}: RadioGroupProps) {
  const baseId = useId();
  const errorId = error ? `${baseId}-error` : undefined;

  return (
    <fieldset
      className="flex flex-col gap-1 border-0 p-0"
      aria-invalid={Boolean(error) || undefined}
      aria-describedby={errorId}
    >
      <legend className="mb-1 text-sm font-medium text-[color:var(--kr-fg-body)]">{label}</legend>
      <div
        className={cn(
          "flex gap-2",
          orientation === "vertical" ? "flex-col" : "flex-row flex-wrap gap-4",
        )}
      >
        {options.map((opt) => {
          const optId = `${baseId}-${opt.value}`;
          return (
            <label
              key={opt.value}
              htmlFor={optId}
              className={cn(
                "flex min-h-[var(--kr-touch-target)] cursor-pointer items-start gap-3 py-1.5",
                opt.disabled && "cursor-not-allowed opacity-60",
              )}
            >
              <input
                id={optId}
                type="radio"
                name={name}
                value={opt.value}
                checked={value === opt.value}
                disabled={opt.disabled}
                onChange={() => onChange(opt.value)}
                className={cn(
                  "mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[color:var(--kr-primary)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2",
                )}
              />
              <span className="flex flex-col">
                <span className="text-[15px] text-[color:var(--kr-fg-body)]">{opt.label}</span>
                {opt.description && (
                  <span className="text-sm text-[color:var(--kr-fg-muted)]">{opt.description}</span>
                )}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-[color:var(--kr-error)]">
          {error}
        </p>
      )}
    </fieldset>
  );
}
