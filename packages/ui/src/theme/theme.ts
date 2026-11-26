/**
 * Theme runtime — single source of truth for light/dark/system.
 *
 * Contract:
 *  - `data-theme="light" | "dark"` is set on <html> (the CSS selector tokens use).
 *  - Default is `light` when no saved preference exists.
 *  - `system` follows the OS and reacts to OS changes.
 *  - The blocking inline script (NO_FLASH_SCRIPT) applies the theme before first
 *    paint to prevent a flash of the wrong theme. It must stay in sync with
 *    `resolveTheme()` below.
 *  - localStorage failures (private mode, disabled storage) are tolerated.
 */

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "krishima.theme";

export function isThemePreference(v: unknown): v is ThemePreference {
  return v === "light" || v === "dark" || v === "system";
}

export function readStoredPreference(): ThemePreference {
  try {
    const raw = globalThis.localStorage?.getItem(THEME_STORAGE_KEY);
    return isThemePreference(raw) ? raw : "light";
  } catch {
    // Storage unavailable → fall back to the documented default.
    return "light";
  }
}

export function writeStoredPreference(pref: ThemePreference): void {
  try {
    globalThis.localStorage?.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    // Non-fatal: the theme still applies for this session.
  }
}

export function systemPrefersDark(): boolean {
  return (
    typeof globalThis.matchMedia === "function" &&
    globalThis.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref === "system") return systemPrefersDark() ? "dark" : "light";
  return pref;
}

export function applyTheme(resolved: ResolvedTheme): void {
  const root = globalThis.document?.documentElement;
  if (!root) return;
  root.setAttribute("data-theme", resolved);
  // Keep the native color-scheme (scrollbars, form controls) in sync.
  root.style.colorScheme = resolved;
}

/**
 * Blocking script injected before the app bundle. Kept minimal and dependency-free.
 * Mirrors resolveTheme(): system → prefers-color-scheme, else stored value, else light.
 */
export const NO_FLASH_SCRIPT = `(function(){try{var k='${THEME_STORAGE_KEY}';var p=localStorage.getItem(k);if(p!=='light'&&p!=='dark'&&p!=='system'){p='light';}var d=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=d?'dark':'light';document.documentElement.setAttribute('data-theme',r);document.documentElement.style.colorScheme=r;}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;
