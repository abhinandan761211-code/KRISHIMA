import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "../../lib/cn";

export type ToastTone = "info" | "success" | "error";

export interface ToastItem {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastApi {
  show: (t: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const TONE: Record<ToastTone, string> = {
  info: "border-[color:var(--kr-info)]",
  success: "border-[color:var(--kr-success)]",
  error: "border-[color:var(--kr-error)]",
};

const GLYPH: Record<ToastTone, string> = { info: "ℹ", success: "✓", error: "✕" };

/**
 * Toast provider — renders a single live region at the app root.
 * Announcements are polite (errors use assertive via role="alert").
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const seq = useRef(0);

  const show = useCallback((t: Omit<ToastItem, "id">) => {
    const id = ++seq.current;
    setItems((prev) => [...prev, { ...t, id }]);
    const ttl = t.tone === "error" ? 8000 : 5000;
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), ttl);
  }, []);

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-3 z-50 flex flex-col items-center gap-2 px-3"
        aria-live="polite"
      >
        {items.map((t) => (
          <div
            key={t.id}
            role={t.tone === "error" ? "alert" : "status"}
            className={cn(
              "pointer-events-auto w-full max-w-sm rounded-[var(--kr-radius-md)] border-l-4 bg-[color:var(--kr-surface)] px-4 py-3 shadow-[var(--kr-shadow-md)]",
              TONE[t.tone],
            )}
          >
            <p className="text-sm font-semibold text-[color:var(--kr-fg)]">
              <span aria-hidden="true" className="mr-1.5">
                {GLYPH[t.tone]}
              </span>
              {t.title}
            </p>
            {t.description && (
              <p className="mt-0.5 text-sm text-[color:var(--kr-fg-muted)]">{t.description}</p>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>.");
  return ctx;
}
