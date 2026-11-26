import { useTheme } from "../../theme/ThemeProvider";
import type { ThemePreference } from "../../theme/theme";
import { DropdownMenu } from "../navigation/DropdownMenu";

const OPTIONS: { value: ThemePreference; label: string; glyph: string }[] = [
  { value: "light", label: "Light", glyph: "☀" },
  { value: "dark", label: "Dark", glyph: "☾" },
  { value: "system", label: "System", glyph: "⌘" },
];

/**
 * Theme switcher — a single compact button that opens a menu.
 *
 * Why not the previous segmented control: showing Light/Dark/System side by side
 * took ~200px of the navbar, which forced the language switcher out of the bar at
 * 1024–1280px and left the row permanently tight. One icon button is ~44px, and the
 * choice is one click away in a menu instead of always on screen.
 *
 * The trigger shows the CURRENT preference's glyph, so the state is still visible
 * without opening the menu, and `aria-label` names it for screen readers.
 *
 * The menu reuses the shared DropdownMenu (Escape, outside-click, focus return,
 * roving focus) rather than re-implementing the pattern; items render as
 * `menuitemradio` with `aria-checked`, so assistive tech hears "selected".
 */
export function ThemeSwitcher({
  className,
  variant = "ghost",
}: {
  className?: string;
  /**
   * `inherit` on coloured surfaces (the green footer): the control takes the
   * surrounding text colour instead of a fixed one. `ghost` in navbars.
   */
  variant?: "ghost" | "inherit";
}) {
  const { preference, setPreference } = useTheme();
  const current = OPTIONS.find((o) => o.value === preference) ?? OPTIONS[0];

  return (
    <DropdownMenu
      className={className}
      align="end"
      triggerVariant={variant}
      label={`Theme: ${current.label}`}
      trigger={
        <span className="inline-flex items-center gap-1">
          <span aria-hidden="true" className="text-base leading-none">
            {current.glyph}
          </span>
          {/* The glyph is the primary signal; this label keeps the control from
              looking like an unlabelled icon on wider screens. */}
          <span className="hidden text-[13px] sm:inline">{current.label}</span>
        </span>
      }
      items={OPTIONS.map((opt) => ({
        key: opt.value,
        label: opt.label,
        icon: <span className="text-base leading-none">{opt.glyph}</span>,
        checked: preference === opt.value,
        onSelect: () => setPreference(opt.value),
      }))}
    />
  );
}
