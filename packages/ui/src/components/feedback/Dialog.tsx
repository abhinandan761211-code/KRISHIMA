import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "../button/IconButton";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal dialog using the native <dialog> element (focus trapping,
 * Escape handling and inert background come from the platform).
 * Always provide a title for the accessible name.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
      el.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  const width = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : "max-w-lg";

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={onClose}
      aria-labelledby="kr-dialog-title"
      className={cn(
        "w-[calc(100vw-2rem)] rounded-[var(--kr-radius-lg)] border border-[color:var(--kr-border)]",
        "bg-[color:var(--kr-surface)] p-0 text-[color:var(--kr-fg-body)] shadow-[var(--kr-shadow-md)]",
        "backdrop:bg-[color:var(--kr-overlay)]",
        width,
      )}
    >
      <div className="flex items-start justify-between gap-4 p-5 pb-3">
        <div>
          <h2 id="kr-dialog-title" className="text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-[color:var(--kr-fg-muted)]">{description}</p>}
        </div>
        <IconButton aria-label="Close dialog" icon="✕" size="sm" onClick={onClose} />
      </div>
      {children && <div className="px-5 pb-4">{children}</div>}
      {footer && <div className="flex justify-end gap-2 border-t border-[color:var(--kr-border)] p-4">{footer}</div>}
    </dialog>
  );
}
