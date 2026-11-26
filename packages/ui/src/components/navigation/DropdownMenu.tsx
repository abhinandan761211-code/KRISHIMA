import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface DropdownItem {
  key: string;
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  /** Renders as a destructive action. */
  danger?: boolean;
  /**
   * When defined, the menu becomes a radio group: the item renders with
   * `role="menuitemradio"` and `aria-checked`, and a tick is shown when true.
   * Used by the theme switcher, where exactly one option is always active.
   */
  checked?: boolean;
}

export interface DropdownMenuProps {
  /** Trigger content (rendered INSIDE the menu button — must not be a button). */
  trigger: ReactNode;
  items: DropdownItem[];
  label: string;
  align?: "start" | "end";
  /**
   * Visual style of the menu button.
   *  - `ghost`   — bare text, hovering tints the background (used in navbars).
   *  - `secondary` — filled control.
   *  - `inherit` — no colour of its own: takes the surrounding text colour. Needed
   *    where the menu sits on a coloured surface (e.g. the green footer), where a
   *    fixed `fg-body` colour is unreadable.
   */
  triggerVariant?: "ghost" | "secondary" | "inherit";
  /** Applied to the wrapper, so a caller can control placement in a flex row. */
  className?: string;
}

/**
 * Menu button + popup menu. Keyboard: Enter/Space opens, Arrow keys move,
 * Escape closes and returns focus to the trigger, click-outside closes.
 *
 * The trigger is a single <button>; `trigger` supplies its *content* only, so
 * interactive elements are never nested (axe: nested-interactive).
 */
export function DropdownMenu({
  trigger,
  items,
  label,
  align = "end",
  triggerVariant = "secondary",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) itemRefs.current[0]?.focus();
  }, [open]);

  // A menu is either a command menu or a radio group — never mixed. Deciding once
  // per menu keeps every item consistent, which is what ARIA requires: a
  // `menuitemradio` cannot share a `menu` with plain `menuitem` siblings.
  const hasRadioItems = items.length > 0 && items.every((item) => item.checked !== undefined);

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex min-h-[var(--kr-touch-target)] items-center gap-1 rounded-[var(--kr-radius-md)] px-3 text-sm font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2",
          triggerVariant === "secondary"
            ? "bg-[color:var(--kr-secondary)] text-[color:var(--kr-secondary-fg)] hover:bg-[color:var(--kr-secondary-hover)]"
            : triggerVariant === "inherit"
              ? // No colour utilities at all: inherit from the parent surface. A fixed
                // colour here measured 1.13:1 on the green footer.
                "text-current hover:bg-[color:color-mix(in_srgb,currentColor_12%,transparent)]"
              : "text-[color:var(--kr-fg-body)] hover:bg-[color:var(--kr-surface-muted)]",
        )}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          aria-label={label}
          className={cn(
            "absolute z-40 mt-1 min-w-[180px] rounded-[var(--kr-radius-md)] border p-1",
            "border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] shadow-[var(--kr-shadow-md)]",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((item, i) => (
            <button
              key={item.key}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              role={hasRadioItems ? "menuitemradio" : "menuitem"}
              aria-checked={item.checked}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                item.onSelect();
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-[var(--kr-radius-sm)] px-3 py-2 text-left text-sm",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--kr-focus-ring)]",
                item.danger ? "text-[color:var(--kr-error)]" : "text-[color:var(--kr-fg-body)]",
                "hover:bg-[color:var(--kr-surface-muted)] disabled:cursor-not-allowed disabled:text-[color:var(--kr-disabled-fg)]",
              )}
            >
              {item.icon && <span aria-hidden="true" className="shrink-0">{item.icon}</span>}
              <span className="flex-1">{item.label}</span>
              {/* A tick marks the active option. The check is drawn, not the only
               * signal — aria-checked already carries the state for assistive tech. */}
              {item.checked && (
                <span aria-hidden="true" className="shrink-0 text-[color:var(--kr-primary-text)]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
