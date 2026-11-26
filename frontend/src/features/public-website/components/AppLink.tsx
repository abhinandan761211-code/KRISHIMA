import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@krishima/ui";

type Variant = "primary" | "secondary" | "ghost" | "link" | "plain";
type Size = "sm" | "md" | "lg";

/**
 * Router-aware anchor.
 *
 * `LinkButton` from @krishima/ui is a plain <a> (correct for a static site), but
 * inside the SPA an internal link must go through React Router or every click
 * reloads the bundle. Same visual system, same classes — only the element
 * implementation differs, so there is no second button style.
 *
 * Disabled state: a link with no destination is rendered as a <span> with
 * aria-disabled, never as an <a href="#"> that silently does nothing.
 */
const BASE =
  "inline-flex items-center justify-center gap-2 font-medium rounded-[var(--kr-radius-md)] " +
  // A button label must never wrap or be squeezed. `whitespace-nowrap` keeps
  // "Log in" on one line; without `min-w-0`/`shrink-0` the flex parent was free to
  // compress the control to 50px, which is what made it break onto two lines.
  // Long prose links are the exception — the `link` variant re-enables wrapping.
  "whitespace-nowrap shrink-0 " +
  "transition-colors duration-[var(--kr-motion-fast)] select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--kr-bg)]";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[color:var(--kr-btn-primary-bg)] text-[color:var(--kr-btn-primary-fg)] " +
    "hover:bg-[color:var(--kr-btn-primary-bg-hover)] active:bg-[color:var(--kr-btn-primary-bg-active)]",
  secondary:
    "bg-[color:var(--kr-btn-secondary-bg)] text-[color:var(--kr-btn-secondary-fg)] " +
    "hover:bg-[color:var(--kr-btn-secondary-bg-hover)]",
  ghost:
    "bg-transparent text-[color:var(--kr-btn-ghost-fg)] hover:bg-[color:var(--kr-btn-ghost-bg-hover)]",
  // Prose links sit inside sentences and may wrap; they are also allowed to shrink
  // so a long label can never force the page wider than the viewport (320px).
  link:
    "bg-transparent text-[color:var(--kr-primary-text)] underline-offset-4 hover:underline px-0 " +
    "whitespace-normal shrink min-w-0 text-start",
  /**
   * No colour and no type scale — for contexts that supply their own (e.g. the
   * announcement bar, which is white-on-green). Using `link` there produced two
   * conflicting `text-[color:…]` utilities whose winner depended on stylesheet
   * order, so the label rendered green-on-green (1.27:1). A variant that sets no
   * colour removes the conflict instead of relying on cascade order.
   */
  plain: "bg-transparent px-0 underline-offset-4 hover:underline",
};

const SIZES: Record<Size, string> = {
  sm: "min-h-[36px] px-3 text-sm",
  md: "min-h-[var(--kr-touch-target)] px-4 text-[15px]",
  lg: "min-h-[52px] px-6 text-base",
};

export interface AppLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  to: string | undefined;
  variant?: Variant;
  size?: Size;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Rendered after the label inside the same control (e.g. a "coming soon" badge). */
  children?: ReactNode;
}

export function AppLink({
  to,
  variant = "primary",
  size = "md",
  leadingIcon,
  trailingIcon,
  className,
  children,
  ...rest
}: AppLinkProps) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);
  const content = (
    <>
      {leadingIcon && (
        <span aria-hidden="true" className="inline-flex">
          {leadingIcon}
        </span>
      )}
      {children}
      {trailingIcon && (
        <span aria-hidden="true" className="inline-flex">
          {trailingIcon}
        </span>
      )}
    </>
  );

  if (!to) {
    return (
      <span aria-disabled="true" className={cn(classes, "cursor-not-allowed opacity-60")}>
        {content}
      </span>
    );
  }

  return (
    <Link to={to} className={classes} {...rest}>
      {content}
    </Link>
  );
}

/**
 * Link that knows whether it is the current page. Uses React Router's location
 * instead of `aria-current` sprinkled at each call site, so highlighting can
 * never drift from the real route.
 */
export function NavTextLink({
  to,
  exact = false,
  className,
  children,
  onClick,
}: {
  to: string;
  exact?: boolean;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const { pathname } = useLocation();
  const current = exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={current ? "page" : undefined}
      className={cn(
        "inline-flex min-h-[var(--kr-touch-target)] items-center whitespace-nowrap rounded-[var(--kr-radius-md)] px-3 text-[15px] font-medium",
        "transition-colors duration-[var(--kr-motion-fast)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2",
        current
          ? "bg-[color:var(--kr-nav-item-selected-bg)] text-[color:var(--kr-nav-item-selected-fg)]"
          : "text-[color:var(--kr-nav-item-fg)] hover:bg-[color:var(--kr-nav-item-hover-bg)] hover:text-[color:var(--kr-fg)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
