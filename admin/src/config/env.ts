/**
 * Admin runtime configuration — validated at startup.
 * Only PUBLISHABLE values. Admin AUTHORIZATION is enforced by the backend; nothing
 * in this file grants admin access.
 */
import { z } from "zod";

const schema = z.object({
  VITE_APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
  VITE_API_BASE_URL: z.string().url(),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(20, "Missing Supabase publishable/anon key"),
  VITE_AUTH_CALLBACK_URL: z.string().url(),
});

const parsed = schema.safeParse(import.meta.env);
if (!parsed.success) {
  throw new Error(
    "Invalid admin environment configuration — " +
      parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "),
  );
}
export const config = parsed.data;
