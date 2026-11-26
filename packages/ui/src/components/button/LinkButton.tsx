import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";
import type { ButtonSize, ButtonVariant } from "../button/Button";

export interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
}

const BASE =
  "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--kr-radius-md)] " +
  "transition-colors duration-[var(--kr-motion-fast)] select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--kr-bg)]";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--kr-btn-primary-bg)] text-[color:var(--kr-btn-primary-fg)] " +
    "hover:bg-[color:var(--kr-btn-primary-bg-hover)] active:bg-[color:var(--kr-btn-primary-bg-active)]",
  secondary:
    "bg-[color:var(--kr-btn-secondary-bg)] text-[color:var(--kr-btn-secondary-fg)] " +
    "hover:bg-[color:var(--kr-btn-secondary-bg-hover)]",
  ghost:
    "bg-transparent text-[color:var(--kr-btn-ghost-fg)] hover:bg-[color:var(--kr-btn-ghost-bg-hover)]",
  danger:
    "bg-[color:var(--kr-btn-danger-solid)] text-[color:var(--kr-btn-danger-solid-fg)] " +
    "hover:bg-[color:var(--kr-btn-danger-solid-hover)]",
  link: "bg-transparent text-[color:var(--kr-primary-text)] underline-offset-4 hover:underline px-0",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "min-h-[36px] px-3 text-sm",
  md: "min-h-[var(--kr-touch-target)] px-4 text-[15px]",
  lg: "min-h-[52px] px-6 text-base",
};

/**
 * An <a> that looks exactly like a <Button>.
 *
 * Navigation must be a link, not a button: links are announced correctly, can be
 * opened in a new tab, and are crawlable. Use `Button` only for actions.
 */
export function LinkButton({
  variant = "primary",
  size = "md",
  leadingIcon,
  className,
  children,
  ...rest
}: LinkButtonProps) {
  return (
    <a className={cn(BASE, VARIANTS[variant], SIZES[size], className)} {...rest}>
      {leadingIcon && (
        <span aria-hidden="true" className="inline-flex">
          {leadingIcon}
        </span>
      )}
      {children}
    </a>
  );
}
