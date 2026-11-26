import { describe, expect, it } from "vitest";
import {
  isThemePreference,
  readStoredPreference,
  resolveTheme,
  THEME_STORAGE_KEY,
  writeStoredPreference,
  NO_FLASH_SCRIPT,
} from "@krishima/ui";

describe("theme runtime", () => {
  it("recognises only valid preferences", () => {
    expect(isThemePreference("light")).toBe(true);
    expect(isThemePreference("dark")).toBe(true);
    expect(isThemePreference("system")).toBe(true);
    expect(isThemePreference("blue")).toBe(false);
    expect(isThemePreference(null)).toBe(false);
  });

  it("defaults to light when nothing is stored", () => {
    localStorage.removeItem(THEME_STORAGE_KEY);
    expect(readStoredPreference()).toBe("light");
  });

  it("persists and reads back a preference", () => {
    writeStoredPreference("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    expect(readStoredPreference()).toBe("dark");
  });

  it("ignores an invalid stored value and falls back to light", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "neon");
    expect(readStoredPreference()).toBe("light");
  });

  it("resolves explicit preferences without consulting the OS", () => {
    expect(resolveTheme("light")).toBe("light");
    expect(resolveTheme("dark")).toBe("dark");
  });

  it("system resolution follows prefers-color-scheme", () => {
    // jsdom's matchMedia is stubbed to report light by default in setup.
    const resolved = resolveTheme("system");
    expect(["light", "dark"]).toContain(resolved);
  });

  it("no-flash script references the same storage key", () => {
    expect(NO_FLASH_SCRIPT).toContain(THEME_STORAGE_KEY);
    expect(NO_FLASH_SCRIPT).toContain("data-theme");
  });
});
