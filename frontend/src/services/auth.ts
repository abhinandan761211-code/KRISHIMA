/**
 * Authentication service — Supabase Auth integration foundation.
 *
 * Exposes the operations the product will use (registration, email verification,
 * login, Google OAuth, password recovery, refresh, logout, session access). Pages
 * are **not** implemented in this foundation task; these are reusable primitives.
 */
import { supabase } from "@/services/supabase";
import { config } from "@/config/env";
import type { Session, User } from "@supabase/supabase-js";

export interface AuthResult {
  user: User | null;
  needsEmailVerification: boolean;
}

export const authService = {
  async signUpWithEmail(email: string, password: string, fullName?: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: config.VITE_AUTH_CALLBACK_URL,
        data: fullName ? { full_name: fullName } : undefined,
      },
    });
    if (error) throw error;
    // With email confirmation enabled, a user is returned but no session exists yet.
    return { user: data.user, needsEmailVerification: data.session === null };
  },

  async signInWithPassword(email: string, password: string): Promise<Session> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (!data.session) throw new Error("Sign-in succeeded but no session was returned.");
    return data.session;
  },

  /**
   * Google sign-in is BROKERED BY SUPABASE AUTH. The Google client id/secret live in
   * the Supabase dashboard — never in this app. This only redirects to Supabase.
   */
  async signInWithGoogle(): Promise<void> {
    if (!config.googleAuthEnabled) throw new Error("Google sign-in is disabled.");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: config.VITE_AUTH_CALLBACK_URL },
    });
    if (error) throw error;
  },

  async sendPasswordReset(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: config.VITE_AUTH_CALLBACK_URL,
    });
    if (error) throw error;
  },

  async resendEmailVerification(email: string): Promise<void> {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: config.VITE_AUTH_CALLBACK_URL },
    });
    if (error) throw error;
  },

  async getSession(): Promise<Session | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async refreshSession(): Promise<Session> {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    if (!data.session) throw new Error("Refresh did not return a session.");
    return data.session;
  },

  onAuthStateChange(callback: (session: Session | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
    return data.subscription;
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
