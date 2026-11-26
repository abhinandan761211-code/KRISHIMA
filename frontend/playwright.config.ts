import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end configuration for the public website.
 *
 * Scope: the marketing site only (routes, navigation, themes, accessibility).
 * There is no authenticated area to exercise yet — auth is disabled until the
 * identity phase ships — so no login fixtures are needed.
 *
 * The dev server is started and torn down automatically; `reuseExistingServer`
 * keeps local iteration fast without masking a broken config in CI.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  timeout: 30_000,
  expect: { timeout: 7_000 },

  use: {
    baseURL: "http://localhost:5199",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
  ],

  webServer: {
    command: "npx vite --port 5199 --strictPort",
    url: "http://localhost:5199",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
