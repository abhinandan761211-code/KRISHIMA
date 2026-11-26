import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { INDEXABLE_ROUTES } from "../src/features/public-website/data/indexable-routes";

/**
 * Hindi (hi-IN) — layout, navigation, and accessibility.
 *
 * Hindi is enabled in the selector only because its translation is complete (key
 * parity with en.ts and no English values are enforced by unit tests). These
 * tests cover the things unit tests cannot see: that Devanagari actually renders,
 * that the longer strings do not break the layout, and that the pages stay
 * accessible in the second language.
 *
 * Hindi strings are typically 10–30% longer than English, so overflow here is a
 * real risk that does not appear in the English suite.
 */

const RAW_KEY =
  /\b(hero|nav|common|roles|rolesPage|faq|legal|about|contact|helpPage|meta|footer|notFound|servicesPage|howPage|solutions|features|platform|trust|community|preview|ecosystem|finalCta|announcement|cta)\.[a-zA-Z0-9.]+/;

const DEVANAGARI = /[\u0900-\u097F]/;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("krishima.locale", "hi"));
});

test.describe("Hindi", () => {
  test("renders Devanagari and sets html lang to hi-IN", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "hi-IN");

    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    const text = await h1.innerText();
    expect(DEVANAGARI.test(text), `h1 is not Devanagari: "${text}"`).toBe(true);
  });

  test("no route leaks a raw i18n key in Hindi", async ({ page }) => {
    for (const { path } of INDEXABLE_ROUTES) {
      await page.goto(path);
      const body = await page.locator("body").innerText();
      expect(body, `raw key leaked on ${path}`).not.toMatch(RAW_KEY);
      expect(body.length, `page ${path} looks empty`).toBeGreaterThan(200);
    }
  });

  test("every route is translated, not left in English", async ({ page }) => {
    // A page whose <h1> contains no Devanagari means the Hindi catalogue is not
    // being applied on that route (the exact failure this task set out to fix).
    for (const { path } of INDEXABLE_ROUTES) {
      await page.goto(path);
      const h1 = await page.locator("h1").first().innerText();
      expect(DEVANAGARI.test(h1), `h1 not translated on ${path}: "${h1}"`).toBe(true);
    }
  });

  const widths = [320, 375, 390, 768, 1024, 1280, 1440, 1920];

  for (const width of widths) {
    test(`no horizontal overflow in Hindi at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of ["/", "/services", "/solutions/farmer", "/contact"]) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `Hindi overflow on ${path} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("navbar controls do not wrap in Hindi", async ({ page }) => {
    // Hindi labels are longer; a wrapped nav button changes the row height and
    // pushes the bar out of the viewport. Every control must stay 44px tall.
    for (const width of [1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      const heights = await page.evaluate(() =>
        [...document.querySelectorAll("header nav a, header nav button, header a, header button")]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          })
          .map((el) => ({ h: Math.round(el.getBoundingClientRect().height), t: el.textContent?.trim() })),
      );
      const wrapped = heights.filter((h) => h.h > 52);
      expect(wrapped, `wrapped nav controls at ${width}px: ${JSON.stringify(wrapped)}`).toEqual([]);
    }
  });

  test("mobile menu works in Hindi", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const trigger = page.locator('button[aria-controls="public-mobile-menu"]');
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const panel = page.locator("#public-mobile-menu");
    await expect(panel.getByRole("link").first()).toBeVisible();
    // The language switcher and theme control are present in the panel.
    await expect(panel.getByRole("button", { name: /^theme:|थीम/i })).toBeVisible();
  });

  test("Hindi pages pass axe WCAG 2.2 AA", async ({ page }) => {
    for (const path of ["/", "/services", "/contact", "/faq"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle").catch(() => { });
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .disableRules(["region"])
        .analyze();
      expect(
        results.violations.map((v) => v.id),
        `axe violations on ${path} (Hindi)`,
      ).toEqual([]);
    }
  });

  test("switching language persists across reload", async ({ browser }) => {
    // A fresh context with NO init-script: the suite's beforeEach injects a Hindi
    // reset on every document load, which would mask whether the switch persisted.
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto("/");
    await page.locator("select").first().selectOption("hi");
    await expect(page.locator("html")).toHaveAttribute("lang", "hi-IN");

    await page.locator("select").first().selectOption("en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en-IN");
    expect(await page.evaluate(() => localStorage.getItem("krishima.locale"))).toBe("en");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("lang", "en-IN");
    await context.close();
  });
});
