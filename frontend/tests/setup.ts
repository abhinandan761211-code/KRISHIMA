import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

/** jsdom has no matchMedia — provide a controllable stub for theme tests. */
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

/**
 * Test environment values. These are FAKE, non-secret values — they only satisfy
 * the env schema so modules can be imported under test.
 */
vi.stubEnv("VITE_APP_ENV", "development");
vi.stubEnv("VITE_API_BASE_URL", "http://localhost:8000/api/v1");
vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
vi.stubEnv("VITE_SUPABASE_ANON_KEY", "test-anon-key-test-anon-key-test-anon-key");
vi.stubEnv("VITE_ENABLE_GOOGLE_AUTH", "true");
vi.stubEnv("VITE_AUTH_CALLBACK_URL", "http://localhost:5173/auth/callback");
