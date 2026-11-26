import { expect, test } from "@playwright/test";
import { INDEXABLE_ROUTES } from "../src/features/public-website/data/indexable-routes";

/**
 * Route smoke tests — every public page must mount with real content.
 *
 * The biggest failure mode this guards against is an i18n key with no provider
 * or no catalogue entry, which renders a raw key id like "hero.title" instead
 * of copy. Every page is therefore checked for a non-empty <h1> and for leaked
 * key ids.
 */

/** Matches a raw i18n key such as `hero.title` or `contact.fields.name`. */
const RAW_KEY = /\b(hero|nav|common|roles|rolesPage|faq|legal|about|contact|helpPage|meta|footer|notFound|servicesPage|howPage|solutions|features|platform|trust|community|preview|ecosystem|finalCta|announcement|cta)\.[a-zA-Z0-9.]+/;

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/how-it-works",
  "/faq",
  "/contact",
  "/help",
  "/privacy",
  "/terms",
];

test.describe("public routes", () => {
  for (const path of PUBLIC_PATHS) {
    test(`${path} renders a heading and real copy`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);

      const h1 = page.locator("h1").first();
      await expect(h1).toBeVisible();
      await expect(h1).not.toBeEmpty();

      const text = await page.locator("body").innerText();
      expect(text.length).toBeGreaterThan(200);
      expect(text).not.toMatch(RAW_KEY);
    });
  }

  test("every solution page renders from the shared role data", async ({ page }) => {
    const solutionPaths = INDEXABLE_ROUTES.filter((r) => r.path.startsWith("/solutions/"));
    expect(solutionPaths.length).toBeGreaterThan(0);

    for (const { path } of solutionPaths) {
      await page.goto(path);
      await expect(page.locator("h1").first()).toBeVisible();
      const text = await page.locator("body").innerText();
      expect(text, `raw key leaked on ${path}`).not.toMatch(RAW_KEY);
    }
  });

  test("unknown paths render the 404 page", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/does not exist/i);
  });

  test("every route writes a unique document title", async ({ page }) => {
    const titles = new Set<string>();
    for (const { path } of INDEXABLE_ROUTES) {
      await page.goto(path);
      await expect(page).toHaveTitle(/KRISHIMA/);
      const title = await page.title();
      expect(titles.has(title), `duplicate title "${title}"`).toBe(false);
      titles.add(title);
    }
  });
});
