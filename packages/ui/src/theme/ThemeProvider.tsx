import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  readStoredPreference,
  resolveTheme,
  systemPrefersDark,
  writeStoredPreference,
  type ResolvedTheme,
  type ThemePreference,
} from "./theme";

interface ThemeContextValue {
  /** User-facing preference: light | dark | system. */
  preference: ThemePreference;
  /** The theme actually applied right now. */
  resolved: ResolvedTheme;
  setPreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Single ThemeProvider for the whole application. Do not nest another one —
 * duplicate providers cause conflicting `data-theme` writes.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => readStoredPreference());
  const [systemDark, setSystemDark] = useState<boolean>(() => systemPrefersDark());

  const resolved: ResolvedTheme =
    preference === "system" ? (systemDark ? "dark" : "light") : preference;

  // Apply on every change (and on first mount, after the no-flash script).
  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  // React to OS theme changes while in system mode.
  useEffect(() => {
    if (typeof globalThis.matchMedia !== "function") return;
    const mql = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const setPreference = useCallback((pref: ThemePreference) => {
    setPreferenceState(pref);
    writeStoredPreference(pref);
  }, []);

  const value = useMemo(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a single <ThemeProvider>.");
  return ctx;
}

export { resolveTheme };
