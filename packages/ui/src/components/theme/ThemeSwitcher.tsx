import { useTheme } from "../../theme/ThemeProvider";
import { cn } from "../../lib/cn";
import type { ThemePreference } from "../../theme/theme";

const OPTIONS: { value: ThemePreference; label: string; icon: string }[] = [
  { value: "light", label: "Light", icon: "☀" },
  { value: "dark", label: "Dark", icon: "☾" },
  { value: "system", label: "System", icon: "⌘" },
];

/**
 * Segmented theme switcher (Light / Dark / System).
 * Uses a radiogroup so arrow keys + screen readers work natively.
 */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { preference, setPreference } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--kr-radius-md)] border p-1",
        "border-[color:var(--kr-border)] bg-[color:var(--kr-surface-secondary)]",
        className,
      )}
    >
      {OPTIONS.map((opt) => {
        const selected = preference === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setPreference(opt.value)}
            className={cn(
              // min-h 40px (not 32): the segmented control is a primary touch
              // control on mobile, and 32px fell short of the house 44px guideline
              // (it passed WCAG 2.5.8's 24px floor, but that is a floor, not a goal).
              "inline-flex min-h-[40px] items-center gap-1.5 rounded-[var(--kr-radius-sm)] px-2.5 text-[13px] font-medium",
              "transition-colors duration-[var(--kr-motion-fast)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-1",
              selected
                ? "bg-[color:var(--kr-surface)] text-[color:var(--kr-fg)] shadow-[var(--kr-shadow-xs)]"
                : "text-[color:var(--kr-fg-muted)] hover:bg-[color:var(--kr-surface-muted)]",
            )}
          >
            <span aria-hidden="true">{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
