/**
 * Runtime configuration validated at startup.
 *
 * Only PUBLISHABLE values may appear here (VITE_* are compiled into the bundle).
 * If required values are missing, the app fails loudly instead of running in a
 * silently broken state. No DB, service-role, or JWT secret is ever referenced.
 */
import { z } from "zod";

const envSchema = z.object({
  VITE_APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
  VITE_API_BASE_URL: z.string().url(),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(20, "Missing Supabase publishable/anon key"),
  VITE_ENABLE_GOOGLE_AUTH: z.enum(["true", "false"]).default("true"),
  VITE_AUTH_CALLBACK_URL: z.string().url(),
  /**
   * Confirmed public origin of the website, e.g. https://krishima.in.
   * Optional: when absent the app emits NO canonical tag and robots.txt disallows
   * crawling (see scripts/generate-seo-files) — a canonical must never point at
   * localhost, and a sitemap must never list unpublished URLs.
   */
  VITE_SITE_ORIGIN: z.string().url().optional(),
});

export type AppConfig = z.infer<typeof envSchema> & {
  googleAuthEnabled: boolean;
};

function loadConfig(): AppConfig {
  const parsed = envSchema.safeParse(import.meta.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    // Fail fast and visibly; never fall back to a partially configured app.
    throw new Error(`Invalid frontend environment configuration — ${issues}`);
  }
  return { ...parsed.data, googleAuthEnabled: parsed.data.VITE_ENABLE_GOOGLE_AUTH === "true" };
}

export const config = loadConfig();

if (config.VITE_APP_ENV === "production" && !config.VITE_SUPABASE_URL.startsWith("https://")) {
  throw new Error("SUPABASE_URL must use https in production.");
}
