import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { INDEXABLE_ROUTES } from "../src/features/public-website/data/indexable-routes";

/**
 * Accessibility — WCAG 2.2 AA via axe-core.
 *
 * Scope note: axe catches roughly a third of real accessibility issues. It is a
 * regression net, not a certificate. Keyboard behaviour is covered separately in
 * navigation.spec.ts, and manual screen-reader review is still required before
 * launch (recorded as a known limitation in the validation report).
 *
 * Disabled rules and why:
 *  - `region` is not enforced here: the marketing pages use semantic landmarks
 *    (header/main/footer) and axe's "all content in landmarks" heuristic flags
 *    decorative wrappers that are intentionally outside them.
 */

const AXE_DISABLED = ["region"];

async function analyze(page: import("@playwright/test").Page) {
  return new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .disableRules(AXE_DISABLED)
    .analyze();
}

for (const { path } of INDEXABLE_ROUTES) {
  test(`no WCAG A/AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle").catch(() => {
      /* font requests may never settle offline; the DOM is ready regardless */
    });

    const results = await analyze(page);
    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s) — ${v.help}`,
    );
    expect(summary, `axe violations on ${path}:\n${summary.join("\n")}`).toEqual([]);
  });
}

test("no WCAG A/AA violations on the 404 page", async ({ page }) => {
  await page.goto("/this-route-does-not-exist");
  const results = await analyze(page);
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("dark theme has no WCAG A/AA violations on the landing page", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("krishima.theme", "dark"));
  await page.goto("/");
  // Wait for the provider to actually resolve the theme before auditing, so the
  // engine measures real dark-theme colours rather than a half-applied state.
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.waitForLoadState("networkidle").catch(() => {});
  const results = await analyze(page);
  expect(results.violations.map((v) => v.id)).toEqual([]);
});

test("every image has alternative text", async ({ page }) => {
  await page.goto("/");
  const missing = await page.evaluate(() =>
    [...document.querySelectorAll("img")]
      .filter((img) => !img.hasAttribute("alt"))
      .map((img) => img.getAttribute("src")),
  );
  expect(missing).toEqual([]);
});

test("there is exactly one h1 and a logical landmark set", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
});

test("reduced motion is respected", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // A CSS animation or transition longer than ~10ms on a hovered/visible element
  // would violate the intent of prefers-reduced-motion.
  const longTransitions = await page.evaluate(() => {
    const offenders: string[] = [];
    for (const el of document.querySelectorAll("*")) {
      const s = getComputedStyle(el);
      for (const prop of [s.transitionDuration, s.animationDuration]) {
        const values = prop.split(",").map((v) => parseFloat(v));
        if (values.some((v) => v > 0.01)) {
          offenders.push(`${el.tagName.toLowerCase()} ${prop}=${prop}`);
          break;
        }
      }
    }
    return offenders.slice(0, 5);
  });
  expect(longTransitions).toEqual([]);
});
