/* eslint-disable react-refresh/only-export-components -- the provider module also
   exports its consumer hook (useI18n); that is the approved pattern for contexts. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getActiveLocale,
  setLocale as setRuntimeLocale,
  subscribeToLocale,
  translate,
  translatePlural,
  type LocaleCode,
  type TranslateValues,
} from "./i18n";

export interface I18nContextValue {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  /** Translate a key; re-renders subscribers when the locale changes. */
  t: (key: string, values?: TranslateValues) => string;
  /** Translate a one/other plural pair stored as `key.one` / `key.other`. */
  tp: (key: string, count: number, values?: TranslateValues) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Locale context. Call `initI18n()` once (module scope) BEFORE mounting this
 * provider so the first render already uses the stored locale.
 *
 * There is exactly ONE I18nProvider per app — same rule as ThemeProvider.
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(() => getActiveLocale());

  // Keep in sync if another part of the app (or another tab hook) changes it.
  useEffect(() => subscribeToLocale(setLocaleState), []);

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(setRuntimeLocale(next));
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, values) => translate(key, values, locale),
      tp: (key, count, values) => translatePlural(key, count, values, locale),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within a single <I18nProvider>.");
  return ctx;
}
