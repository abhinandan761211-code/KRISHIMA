import { expect, test } from "@playwright/test";

/**
 * Navigation, theme and responsive behaviour.
 *
 * These cover the defects found during the Phase 3 audit:
 *  - the navbar overflowed horizontally between 1024px and ~1180px (BUG-1);
 *  - theme must persist across navigations and reloads;
 *  - unavailable account actions must never look like working links.
 */

test.describe("public navigation", () => {
  test("desktop nav renders all primary links", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const nav = page.getByRole("navigation").first();
    for (const label of ["Home", "About", "How it works", "Contact"]) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("active route is marked with aria-current", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/about");
    await expect(page.getByRole("link", { name: "About", exact: true }).first()).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  test("Services dropdown opens with keyboard and closes on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");

    const trigger = page.getByRole("button", { name: "Categories" }).first();
    await trigger.focus();
    await page.keyboard.press("Enter");

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    // Focus moves into the disclosure.
    await expect(page.getByRole("link", { name: "Farmer" }).first()).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("mobile menu works and is reachable by keyboard", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");

    // The trigger's accessible name flips between "Open menu" and "Close menu",
    // so locate it by aria-controls (stable across state) rather than by name.
    const trigger = page.locator('button[aria-controls="public-mobile-menu"]');
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    // The panel exposes navigation, and the controls live inside it on mobile.
    await expect(page.locator("#public-mobile-menu").getByRole("link").first()).toBeVisible();
    await expect(page.locator("#public-mobile-menu").getByRole("button", { name: /^theme:/i })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("unavailable account actions are not presented as working links", async ({ page }) => {
    await page.goto("/");
    // Login/registration are disabled until the identity phase ships; they must
    // render as non-interactive controls, never as navigable links.
    const loginLinks = page.getByRole("link", { name: /^log in$/i });
    await expect(loginLinks).toHaveCount(0);
  });
});

test.describe("layout integrity", () => {
  const widths = [320, 375, 390, 768, 1024, 1180, 1280, 1440, 1920];
  const paths = ["/", "/services", "/solutions/farmer", "/contact"];

  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of paths) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `horizontal overflow on ${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("navbar content fits between 1024px and 1180px (BUG-1 regression)", async ({ page }) => {
    for (const width of [1024, 1100, 1179]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const header = page.locator("header").first();
      const box = await header.boundingBox();
      expect(box!.width).toBeLessThanOrEqual(width);

      // The signup action must be fully inside the viewport, not clipped.
      const cta = page.getByRole("link", { name: /get started/i }).first();
      if (await cta.isVisible()) {
        const ctaBox = await cta.boundingBox();
        expect(ctaBox!.x + ctaBox!.width).toBeLessThanOrEqual(width + 1);
      }
    }
  });
});

test.describe("theme", () => {
  test("persists across reload and applies data-theme", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    // The switcher is a single button that opens a menu (Light / Dark / System),
    // so the choice is two clicks instead of always-on segmented controls.
    const openTheme = async () => {
      await page.getByRole("button", { name: /^theme:/i }).first().click();
      await expect(page.getByRole("menu")).toBeVisible();
    };

    await openTheme();
    await page.getByRole("menuitemradio", { name: "Dark" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await openTheme();
    await page.getByRole("menuitemradio", { name: "Light" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("menu opens by keyboard, Escape closes and returns focus", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /^theme:/i }).first();
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page.getByRole("menuitemradio")).toHaveCount(3);

    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("the active option is marked with aria-checked on exactly one item", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: /^theme:/i }).first().click();
    const checked = page.getByRole("menuitemradio", { checked: true });
    await expect(checked).toHaveCount(1);
  });
});
