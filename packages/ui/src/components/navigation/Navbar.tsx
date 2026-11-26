import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface NavItem {
  key: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  current?: boolean;
  disabled?: boolean;
}

export interface NavbarProps {
  brand: ReactNode;
  /** Primary horizontal links (hidden on small screens). */
  items?: NavItem[];
  actions?: ReactNode;
  /** Mobile menu trigger, if the app provides one. */
  mobileTrigger?: ReactNode;
  className?: string;
}

/** Top application bar. Sticky, theme-aware, with a single landmark <header>. */
export function Navbar({ brand, items = [], actions, mobileTrigger, className }: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-[color:var(--kr-nav-border)] bg-[color:var(--kr-nav-bg)]",
        className,
      )}
    >
      <div className="mx-auto flex min-h-[56px] w-full max-w-[var(--kr-container-xl)] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">{brand}</div>
        <nav aria-label="Primary" className="ml-4 hidden md:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.key}>
                <a
                  href={item.disabled ? undefined : item.href}
                  aria-current={item.current ? "page" : undefined}
                  aria-disabled={item.disabled || undefined}
                  className={cn(
                    "inline-flex min-h-[36px] items-center gap-2 rounded-[var(--kr-radius-md)] px-3 text-sm font-medium",
                    "transition-colors duration-[var(--kr-motion-fast)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2",
                    item.disabled && "cursor-not-allowed text-[color:var(--kr-disabled-fg)]",
                    item.current
                      ? "bg-[color:var(--kr-nav-item-selected-bg)] text-[color:var(--kr-nav-item-selected-fg)]"
                      : "text-[color:var(--kr-nav-item-fg)] hover:bg-[color:var(--kr-nav-item-hover-bg)]",
                  )}
                >
                  {item.icon && <span aria-hidden="true">{item.icon}</span>}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {actions}
          {mobileTrigger && <div className="md:hidden">{mobileTrigger}</div>}
        </div>
      </div>
    </header>
  );
}
