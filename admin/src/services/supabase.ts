import { createClient } from "@supabase/supabase-js";
import { config } from "@/config/env";

/** Supabase browser client (auth only). Used solely to obtain an admin session. */
export const supabase = createClient(config.VITE_SUPABASE_URL, config.VITE_SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" },
});
