import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: icon-only buttons have no visible text, so a name is mandatory. */
  "aria-label": string;
  icon: ReactNode;
  variant?: "ghost" | "secondary";
  size?: "sm" | "md";
}

/** Square, 44px-minimum icon-only button. Always requires aria-label. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, variant = "ghost", size = "md", className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[var(--kr-radius-md)]",
        "transition-colors duration-[var(--kr-motion-fast)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2",
        size === "sm" ? "h-9 w-9" : "h-11 w-11",
        variant === "ghost"
          ? "text-[color:var(--kr-fg-muted)] hover:bg-[color:var(--kr-surface-muted)]"
          : "border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] text-[color:var(--kr-fg-body)] hover:bg-[color:var(--kr-surface-muted)]",
        "disabled:cursor-not-allowed disabled:text-[color:var(--kr-disabled-fg)]",
        className,
      )}
      {...rest}
    >
      <span aria-hidden="true" className="inline-flex">
        {icon}
      </span>
    </button>
  );
});
