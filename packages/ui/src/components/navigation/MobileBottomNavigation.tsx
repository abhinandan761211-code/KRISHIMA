import { cn } from "../../lib/cn";
import type { NavItem } from "./Navbar";

/**
 * Mobile bottom navigation. Max 5 items; each target is at least 44px.
 * Rendered as a <nav> landmark; hidden at md and above.
 */
export function MobileBottomNavigation({
  items,
  label = "Primary",
  className,
}: {
  items: NavItem[];
  label?: string;
  className?: string;
}) {
  if (items.length > 5) {
    // Guard rather than silently overflowing on small screens.
    console.warn("MobileBottomNavigation supports at most 5 items.");
  }
  return (
    <nav
      aria-label={label}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-[color:var(--kr-nav-border)]",
        "bg-[color:var(--kr-nav-bg)] pb-[env(safe-area-inset-bottom)] md:hidden",
        className,
      )}
    >
      <ul className="flex items-stretch">
        {items.slice(0, 5).map((item) => (
          <li key={item.key} className="flex-1">
            <a
              href={item.disabled ? undefined : item.href}
              aria-current={item.current ? "page" : undefined}
              aria-disabled={item.disabled || undefined}
              className={cn(
                "flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[11px] font-medium",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--kr-focus-ring)]",
                item.disabled && "cursor-not-allowed text-[color:var(--kr-disabled-fg)]",
                item.current
                  ? "text-[color:var(--kr-nav-item-selected-fg)]"
                  : "text-[color:var(--kr-nav-item-fg)]",
              )}
            >
              {item.icon && (
                <span aria-hidden="true" className="inline-flex text-base">
                  {item.icon}
                </span>
              )}
              <span className="truncate">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
