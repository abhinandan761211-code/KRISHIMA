import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** Icon rendered before the label. */
  leadingIcon?: ReactNode;
}

const BASE =
  "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--kr-radius-md)] " +
  "transition-colors duration-[var(--kr-motion-fast)] select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--kr-bg)] " +
  "disabled:cursor-not-allowed";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--kr-btn-primary-bg)] text-[color:var(--kr-btn-primary-fg)] " +
    "hover:bg-[color:var(--kr-btn-primary-bg-hover)] active:bg-[color:var(--kr-btn-primary-bg-active)] " +
    "disabled:bg-[color:var(--kr-btn-disabled-bg)] disabled:text-[color:var(--kr-btn-disabled-fg)]",
  secondary:
    "bg-[color:var(--kr-btn-secondary-bg)] text-[color:var(--kr-btn-secondary-fg)] " +
    "hover:bg-[color:var(--kr-btn-secondary-bg-hover)] " +
    "disabled:bg-[color:var(--kr-btn-disabled-bg)] disabled:text-[color:var(--kr-btn-disabled-fg)]",
  ghost:
    "bg-transparent text-[color:var(--kr-btn-ghost-fg)] " +
    "hover:bg-[color:var(--kr-btn-ghost-bg-hover)] " +
    "disabled:text-[color:var(--kr-btn-disabled-fg)]",
  danger:
    "bg-[color:var(--kr-btn-danger-solid)] text-[color:var(--kr-btn-danger-solid-fg)] " +
    "hover:bg-[color:var(--kr-btn-danger-solid-hover)] " +
    "disabled:bg-[color:var(--kr-btn-disabled-bg)] disabled:text-[color:var(--kr-btn-disabled-fg)]",
  link:
    "bg-transparent text-[color:var(--kr-primary-text)] underline-offset-4 hover:underline " +
    "disabled:text-[color:var(--kr-btn-disabled-fg)] disabled:no-underline",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "min-h-[36px] px-3 text-sm",
  md: "min-h-[var(--kr-touch-target)] px-4 text-[15px]", // 44px touch target
  lg: "min-h-[52px] px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, leadingIcon, className, children, disabled, ...rest },
  ref,
) {
  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      className={cn(BASE, VARIANTS[variant], SIZES[size], className)}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
        />
      ) : (
        leadingIcon
      )}
      {children}
    </button>
  );
});
