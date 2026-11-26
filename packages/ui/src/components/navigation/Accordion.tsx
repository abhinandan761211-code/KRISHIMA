import { useId, useState, type ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface AccordionItem {
  /** Stable key used for React and for state tracking. */
  id: string;
  /** Visible question / heading text. */
  title: string;
  /** Answer body. Already-translated strings or nodes. */
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow several panels open at once. Default false (single-open). */
  allowMultiple?: boolean;
  /** Ids open on first render. */
  defaultOpenIds?: string[];
  className?: string;
}

/**
 * Accessible disclosure accordion (WAI-ARIA accordion pattern).
 *
 *  - Each header is a real <h3> wrapping a <button aria-expanded aria-controls>.
 *  - Panels are linked with role="region" + aria-labelledby.
 *  - Enter/Space toggle; focus never leaves the header button.
 *  - The chevron is decorative and rotates on open (motion-reduce safe).
 *
 * Single-open mode keeps the FAQ scannable on a phone; pass allowMultiple for
 * a settings-like surface.
 */
export function Accordion({ items, allowMultiple = false, defaultOpenIds = [], className }: AccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggle = (id: string) => {
    setOpenIds((current) => {
      if (current.includes(id)) return current.filter((x) => x !== id);
      return allowMultiple ? [...current, id] : [id];
    });
  };

  return (
    <div className={cn("divide-y divide-[color:var(--kr-border)]", className)}>
      {items.map((item) => {
        const open = openIds.includes(item.id);
        const buttonId = `${baseId}-${item.id}-button`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id} className="py-1">
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className={cn(
                  "flex w-full items-start justify-between gap-4 rounded-[var(--kr-radius-md)] px-1 py-4 text-left",
                  "text-[length:var(--kr-text-body)] font-semibold text-[color:var(--kr-fg)]",
                  "transition-colors duration-[var(--kr-motion-fast)] hover:text-[color:var(--kr-primary-text)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2",
                )}
              >
                <span className="min-w-0">{item.title}</span>
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                  className={cn(
                    "mt-0.5 shrink-0 text-[color:var(--kr-fg-muted)] transition-transform duration-[var(--kr-motion-base)] motion-reduce:transition-none",
                    open && "rotate-180",
                  )}
                >
                  <path
                    d="M5 7.5 10 12.5 15 7.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="px-1 pb-4 pr-8 text-[length:var(--kr-text-body)] text-[color:var(--kr-fg-body)]"
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
