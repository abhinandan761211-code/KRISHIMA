import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  LOCALE_STORAGE_KEY,
  availableLocales,
  catalogKeys,
  getActiveLocale,
  initI18n,
  missingKeys,
  resolveInitialLocale,
  setLocale,
  subscribeToLocale,
  translate,
  translatePlural,
  type MessageCatalog,
} from "@krishima/ui";
import { en, hi, messages } from "@/features/public-website/i18n";

// A two-locale fixture for the *runtime* contract. Note: "hi" is still `partial`
// in LOCALE_REGISTRY, so it cannot be *selected* through setLocale — that is
// verified separately below. Per-locale lookup is exercised via translate(..., locale).
const catalog: MessageCatalog = {
  en: { "greeting": "Hello", "items.one": "1 item", "items.other": "{count} items" },
  hi: { "greeting": "नमस्ते", "items.one": "1 वस्तु", "items.other": "{count} वस्तुएँ" },
};

function resetLocale() {
  localStorage.removeItem(LOCALE_STORAGE_KEY);
}

beforeEach(resetLocale);
afterEach(resetLocale);

describe("i18n runtime", () => {
  it("starts in the default locale and applies <html lang>", () => {
    const active = initI18n({ defaultLocale: "en", locales: catalog });
    expect(active).toBe("en");
    expect(document.documentElement.getAttribute("lang")).toBe("en-IN");
  });

  it("ignores an unstored / invalid / unavailable stored value", () => {
    expect(resolveInitialLocale(null, ["en", "hi"])).toBe("en");
    expect(resolveInitialLocale("fr", ["en", "hi"])).toBe("en");
    expect(resolveInitialLocale("hi", ["en"])).toBe("en");
    expect(resolveInitialLocale("hi", ["en", "hi"])).toBe("hi");
  });

  it("persists the locale on change and notifies subscribers", () => {
    initI18n({ defaultLocale: "en", locales: catalog });
    const seen: string[] = [];
    const unsubscribe = subscribeToLocale((l) => seen.push(l));

    // setLocale refuses "hi" while it is partial — so persistence is checked
    // with the locale that is actually offered (en), and the refusal below.
    expect(setLocale("en")).toBe("en");
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en");
    expect(getActiveLocale()).toBe("en");

    unsubscribe();
    setLocale("en");
    expect(seen).toEqual(["en"]); // only the subscribed change was observed
  });

  it("translates per locale and falls back to the default catalogue", () => {
    initI18n({ defaultLocale: "en", locales: { en: { a: "A", b: "B" }, hi: { a: "अ" } } });
    expect(translate("a", undefined, "hi")).toBe("अ");
    // missing in hi → resolves from en, not the key id
    expect(translate("b", undefined, "hi")).toBe("B");
  });

  it("renders the key itself (and reports it) when it exists nowhere", () => {
    const onMissingKey = vi.fn();
    initI18n({ defaultLocale: "en", locales: catalog, onMissingKey });
    expect(translate("does.not.exist")).toBe("does.not.exist");
    expect(onMissingKey).toHaveBeenCalledWith("en", "does.not.exist");
  });

  it("interpolates placeholders and picks one/other plural forms", () => {
    initI18n({ defaultLocale: "en", locales: catalog });
    expect(translatePlural("items", 1)).toBe("1 item");
    expect(translatePlural("items", 5)).toBe("5 items");
  });

  it("refuses to activate a partial locale", () => {
    initI18n({ defaultLocale: "en", locales: catalog });
    const offered = availableLocales().map((l) => l.code);
    // "hi" is registered partial until professionally translated (A-15).
    expect(offered).toEqual(["en"]);
    expect(setLocale("hi")).toBe("en");
  });
});

describe("public-website catalogue", () => {
  it("registers the same key set for en and hi", () => {
    expect(Object.keys(hi).sort()).toEqual(Object.keys(en).sort());
  });

  it("reports no missing keys in the registered catalogues", () => {
    initI18n({ defaultLocale: "en", locales: messages });
    expect(missingKeys("hi")).toEqual([]);
    expect(catalogKeys().size).toBe(Object.keys(en).length);
  });

  it("keeps the English catalogue free of empty values", () => {
    for (const [key, value] of Object.entries(en)) {
      expect(value.trim(), key).not.toBe("");
    }
  });

  it("does not mark Hindi selectable while its copy is still a mirror", () => {
    // Guard for the A-15 decision: flip to complete ONLY after removing every
    // // TODO(hi) tag in hi.ts and completing professional translation.
    const hindi = availableLocales().find((l) => l.code === "hi");
    expect(hindi).toBeUndefined();
  });
});
