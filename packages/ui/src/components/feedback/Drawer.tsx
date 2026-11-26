import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../../lib/cn";
import { IconButton } from "../button/IconButton";

/**
 * Side sheet built on native <dialog> so focus trapping and Escape work.
 * `side="bottom"` gives a mobile-friendly sheet; `right` a desktop panel.
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: "right" | "bottom";
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClose={onClose}
      aria-labelledby="kr-drawer-title"
      className={cn(
        "border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-0 text-[color:var(--kr-fg-body)]",
        "backdrop:bg-[color:var(--kr-overlay)]",
        side === "right"
          ? "ml-auto mr-0 h-full max-h-none w-[min(22rem,90vw)] rounded-l-[var(--kr-radius-lg)]"
          : "mt-auto mb-0 h-auto max-h-[85vh] w-full rounded-t-[var(--kr-radius-lg)]",
      )}
    >
      <div className="flex items-center justify-between border-b border-[color:var(--kr-border)] p-4">
        <h2 id="kr-drawer-title" className="text-base font-semibold text-[color:var(--kr-fg)]">
          {title}
        </h2>
        <IconButton aria-label="Close panel" icon="✕" size="sm" onClick={onClose} />
      </div>
      <div className="overflow-y-auto p-4">{children}</div>
    </dialog>
  );
}
