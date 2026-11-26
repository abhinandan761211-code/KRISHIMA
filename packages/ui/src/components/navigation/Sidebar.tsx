import type { ReactNode } from "react";
import { cn } from "../../lib/cn";
import type { NavItem } from "./Navbar";

export interface SidebarProps {
  items: NavItem[];
  /** Accessible name for the navigation landmark. */
  label?: string;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * Desktop dashboard sidebar. Uses a real <nav> landmark with aria-current.
 * Hidden on small screens — pair with MobileBottomNavigation.
 */
export function Sidebar({ items, label = "Sidebar", header, footer, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 border-r border-[color:var(--kr-nav-border)] bg-[color:var(--kr-nav-bg)] md:block",
        className,
      )}
    >
      <div className="flex h-full flex-col">
        {header && <div className="border-b border-[color:var(--kr-nav-border)] p-4">{header}</div>}
        <nav aria-label={label} className="flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item.key}>
                <a
                  href={item.disabled ? undefined : item.href}
                  aria-current={item.current ? "page" : undefined}
                  aria-disabled={item.disabled || undefined}
                  className={cn(
                    "flex min-h-[var(--kr-touch-target)] items-center gap-3 rounded-[var(--kr-radius-md)] px-3 text-sm font-medium",
                    "transition-colors duration-[var(--kr-motion-fast)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2",
                    item.disabled && "cursor-not-allowed text-[color:var(--kr-disabled-fg)]",
                    item.current
                      ? "border-l-4 border-[color:var(--kr-nav-item-selected-border)] bg-[color:var(--kr-nav-item-selected-bg)] text-[color:var(--kr-nav-item-selected-fg)]"
                      : "text-[color:var(--kr-nav-item-fg)] hover:bg-[color:var(--kr-nav-item-hover-bg)]",
                  )}
                >
                  {item.icon && (
                    <span aria-hidden="true" className="inline-flex w-5 justify-center">
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {footer && <div className="border-t border-[color:var(--kr-nav-border)] p-3">{footer}</div>}
      </div>
    </aside>
  );
}
