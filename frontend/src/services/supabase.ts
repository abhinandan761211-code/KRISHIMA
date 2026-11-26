/**
 * Centralized Supabase browser client.
 *
 * The Supabase JS client is used ONLY for authentication session handling and
 * explicitly approved storage operations. Business-critical database operations go
 * through the FastAPI backend (see services/api.ts). The publishable/anon key is
 * public by design; RLS still enforces access at the database.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { config } from "@/config/env";

export const supabase: SupabaseClient = createClient(
  config.VITE_SUPABASE_URL,
  config.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  },
);

/** Read the current access token for backend calls (server verifies it). */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
