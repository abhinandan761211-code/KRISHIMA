import { useId } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import { availableLocales, LOCALE_REGISTRY, type LocaleCode } from "../../i18n/i18n";
import { cn } from "../../lib/cn";

/**
 * Language selector.
 *
 * A native <select> — the most reliable control on low-cost Android devices and
 * the only one that gets the platform's language picker for free. The visible
 * label is the native language name, so a Hindi speaker sees "हिन्दी".
 *
 * Only `complete` locales are selectable (see LOCALE_REGISTRY).
 */
export function LanguageSwitcher({
  className,
  label,
  compact = false,
}: {
  className?: string;
  /** Accessible label, already translated (defaults to "Language"). */
  label?: string;
  /** Icon-only on mobile; shows the language code instead of the family glyph. */
  compact?: boolean;
}) {
  const { locale, setLocale, t } = useI18n();
  // The switcher can be mounted several times per page (header, mobile menu,
  // footer). A hardcoded id would duplicate and break label association, so
  // each instance gets its own unique id (WCAG 4.1.1 / 1.3.1).
  const selectId = useId();
  const options = availableLocales();
  const current = LOCALE_REGISTRY.find((l) => l.code === locale);

  return (
    <div className={cn("inline-flex items-center", className)}>
      <label className="sr-only" htmlFor={selectId}>
        {label ?? t("common.language")}
      </label>
      <span aria-hidden="true" className="mr-1 shrink-0 opacity-80 text-current">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18" />
        </svg>
      </span>
      <select
        id={selectId}
        value={locale}
        onChange={(e) => setLocale(e.target.value as LocaleCode)}
        className={cn(
          "min-h-[var(--kr-touch-target)] cursor-pointer appearance-none rounded-[var(--kr-radius-md)] bg-transparent",
          // `text-current` so the control inherits the colour of its container.
          // The footer is white-on-green; a hardcoded --kr-fg-body made the value
          // unreadable there. A caller-supplied className now actually takes effect.
          "pr-6 text-current text-[15px] font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2",
          compact && "w-[4.5rem] text-sm",
        )}
        style={{
          backgroundImage:
            "linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)",
          backgroundPosition: "calc(100% - 14px) 55%, calc(100% - 9px) 55%",
          backgroundSize: "5px 5px, 5px 5px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {options.map((l) => (
          <option key={l.code} value={l.code}>
            {l.nativeName}
          </option>
        ))}
      </select>
      {compact && <span className="sr-only">{current?.nativeName}</span>}
    </div>
  );
}
