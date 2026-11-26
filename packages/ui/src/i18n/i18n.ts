/**
 * KRISHIMA internationalisation runtime.
 *
 * Deliberately dependency-free: the public website ships to low-bandwidth rural
 * users, so we do not add an i18n library for a two-locale foundation. The API is
 * a subset of the i18next surface (init / changeLanguage / t / plural) so it can
 * be swapped later behind the same hook without touching pages.
 *
 * Contract:
 *  - One active locale at a time, stored in localStorage ("krishima.locale").
 *  - `lang` attribute on <html> always matches the active locale.
 *  - A missing key in a locale falls back to the default locale, then to the key
 *    itself, and is reported once to `onMissingKey` (never silently rendered as
 *    a blank string).
 *  - Only locales listed in a registry may be offered to users; a locale under
 *    construction is registered with `status: "partial"` and is not selectable.
 */

export type LocaleCode = "en" | "hi";

export type LocaleStatus = "complete" | "partial";

export interface LocaleDefinition {
  code: LocaleCode;
  /** Native name, shown in the language selector (e.g. "हिन्दी"). */
  nativeName: string;
  /** BCP-47 tag applied to <html lang>. */
  htmlLang: string;
  status: LocaleStatus;
}

/** Messages are flat, dot-separated keys → string values. */
export type Messages = Record<string, string>;

export type TranslateValues = Record<string, string | number>;

export interface I18nOptions {
  defaultLocale: LocaleCode;
  locales: MessageCatalog;
  storageKey?: string;
  /** Called on a missing key — an observability seam, not a UI concern. */
  onMissingKey?: (locale: LocaleCode, key: string) => void;
}

export type MessageCatalog = Partial<Record<LocaleCode, Messages>>;

export const LOCALE_STORAGE_KEY = "krishima.locale";
export const DEFAULT_LOCALE: LocaleCode = "en";

/**
 * The registry of locales the product knows about. Only `complete` locales are
 * offered to users; adding a regional language is a data change here + a
 * messages file — no page restructuring.
 */
export const LOCALE_REGISTRY: LocaleDefinition[] = [
  { code: "en", nativeName: "English", htmlLang: "en-IN", status: "complete" },
  // Hindi ships a full, reviewed translation of every public key (key parity with
  // en.ts is enforced by a unit test), so it is selectable.
  { code: "hi", nativeName: "हिन्दी", htmlLang: "hi-IN", status: "complete" },
];

let activeLocale: LocaleCode = DEFAULT_LOCALE;
let catalog: MessageCatalog = {};
let fallbackLocale: LocaleCode = DEFAULT_LOCALE;
let missingKeyHandler: ((locale: LocaleCode, key: string) => void) | undefined;

function interpolate(template: string, values?: TranslateValues): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(values, name) ? String(values[name]) : match,
  );
}

function lookup(locale: LocaleCode, key: string): string | undefined {
  return catalog[locale]?.[key];
}

/** Translate `key`, substituting `{placeholders}` from `values`. */
export function translate(key: string, values?: TranslateValues, locale: LocaleCode = activeLocale): string {
  const hit = lookup(locale, key) ?? (locale !== fallbackLocale ? lookup(fallbackLocale, key) : undefined);
  if (hit === undefined) {
    missingKeyHandler?.(locale, key);
    return key;
  }
  return interpolate(hit, values);
}

/**
 * Plural-aware translate. Looks for `key.one` (when `count === 1`) else `key.other`,
 * and exposes `{count}` to the template. English and Hindi both use a one/other
 * split, which is all the launch locales require.
 */
export function translatePlural(
  key: string,
  count: number,
  values?: TranslateValues,
  locale: LocaleCode = activeLocale,
): string {
  const form = count === 1 ? "one" : "other";
  const specific = `${key}.${form}`;
  const base = translate(specific, { count, ...values }, locale);
  // If the specific form is missing, fall back to the generic key.
  return base === specific ? translate(key, { count, ...values }, locale) : base;
}

export function getActiveLocale(): LocaleCode {
  return activeLocale;
}

export function resolveInitialLocale(stored: string | null | undefined, offered: LocaleCode[]): LocaleCode {
  if (stored && offered.includes(stored as LocaleCode)) return stored as LocaleCode;
  return DEFAULT_LOCALE;
}

function applyDocumentLocale(locale: LocaleCode): void {
  const root = globalThis.document?.documentElement;
  if (!root) return;
  const def = LOCALE_REGISTRY.find((l) => l.code === locale);
  if (def) root.setAttribute("lang", def.htmlLang);
}

/**
 * Register the message catalogues and restore the persisted locale.
 * Call once at app start (before the first render that translates)).
 */
export function initI18n(options: I18nOptions): LocaleCode {
  catalog = options.locales;
  fallbackLocale = options.defaultLocale;
  missingKeyHandler = options.onMissingKey;

  const storageKey = options.storageKey ?? LOCALE_STORAGE_KEY;
  let stored: string | null = null;
  try {
    stored = globalThis.localStorage?.getItem(storageKey) ?? null;
  } catch {
    stored = null;
  }
  const offered = LOCALE_REGISTRY.filter((l) => l.status === "complete").map((l) => l.code);
  activeLocale = resolveInitialLocale(stored, offered);
  applyDocumentLocale(activeLocale);
  return activeLocale;
}

/** Change the active locale and persist it. Returns the locale now active. */
export function setLocale(locale: LocaleCode, storageKey = LOCALE_STORAGE_KEY): LocaleCode {
  const def = LOCALE_REGISTRY.find((l) => l.code === locale);
  if (!def || def.status !== "complete") {
    // Refuse to activate an incomplete locale; keep the current one.
    return activeLocale;
  }
  activeLocale = locale;
  applyDocumentLocale(locale);
  try {
    globalThis.localStorage?.setItem(storageKey, locale);
  } catch {
    // Non-fatal: the locale still applies for this session.
  }
  // Notify subscribers (the React provider is one of them).
  listeners.forEach((listener) => listener(locale));
  return activeLocale;
}

const listeners = new Set<(locale: LocaleCode) => void>();

export function subscribeToLocale(listener: (locale: LocaleCode) => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Available locales for a selector (complete ones only). */
export function availableLocales(): LocaleDefinition[] {
  return LOCALE_REGISTRY.filter((l) => l.status === "complete");
}

/** Exposed for tests / diagnostics: every key present in any catalogue. */
export function catalogKeys(): Set<string> {
  const keys = new Set<string>();
  for (const messages of Object.values(catalog)) {
    if (messages) Object.keys(messages).forEach((k) => keys.add(k));
  }
  return keys;
}

/**
 * Return keys missing from a locale's catalogue relative to the default locale.
 * Used by the i18n completeness test; keep it pure.
 */
export function missingKeys(locale: LocaleCode, locales: MessageCatalog = catalog): string[] {
  const base = locales[fallbackLocale] ?? {};
  const target = locales[locale] ?? {};
  return Object.keys(base).filter((k) => !(k in target));
}
