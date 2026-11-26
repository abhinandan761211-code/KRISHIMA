import { useRef, type KeyboardEvent } from "react";
import { cn } from "../../lib/cn";

export interface TabItem {
  key: string;
  label: string;
  panelId?: string;
  disabled?: boolean;
}

/**
 * Accessible tabs following the WAI-ARIA tabs pattern:
 * role=tablist / tab / tabpanel, roving tabindex, Arrow/Home/End keys.
 * Controlled: the parent renders the matching panel with role="tabpanel".
 */
export function Tabs({
  items,
  activeKey,
  onChange,
  label,
  className,
}: {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  label: string;
  className?: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const enabled = items.filter((t) => !t.disabled);
    const idx = enabled.findIndex((t) => t.key === activeKey);
    let next = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % enabled.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + enabled.length) % enabled.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = enabled.length - 1;
    else return;
    e.preventDefault();
    const target = enabled[next];
    if (target) {
      onChange(target.key);
      listRef.current
        ?.querySelector<HTMLButtonElement>(`[data-tab="${target.key}"]`)
        ?.focus();
    }
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        "flex gap-1 overflow-x-auto border-b border-[color:var(--kr-border)]",
        className,
      )}
    >
      {items.map((item) => {
        const selected = item.key === activeKey;
        return (
          <button
            key={item.key}
            type="button"
            role="tab"
            data-tab={item.key}
            id={`tab-${item.key}`}
            aria-selected={selected}
            aria-controls={item.panelId}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled}
            onClick={() => onChange(item.key)}
            className={cn(
              "-mb-px whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)]",
              item.disabled && "cursor-not-allowed text-[color:var(--kr-disabled-fg)]",
              selected
                ? "border-[color:var(--kr-primary)] text-[color:var(--kr-primary-text)]"
                : "border-transparent text-[color:var(--kr-fg-muted)] hover:text-[color:var(--kr-fg-body)]",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
