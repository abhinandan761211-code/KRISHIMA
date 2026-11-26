/**
 * Supabase authentication entry points used by the public website.
 *
 * The public site does NOT implement authentication (task §12): it only links to
 * the existing `authService` flows. Because no login/registration *page* exists
 * yet in this phase, every account action is visibly marked as coming soon and
 * the link is rendered as disabled — never a button that pretends to work.
 *
 * When the identity phase ships, set `enabled: true` here and add the route;
 * no marketing component needs to change.
 */
export interface AccountAction {
  /** i18n key for the visible label. */
  labelKey: string;
  /** Internal route or absolute auth URL — undefined while unavailable. */
  href: string | undefined;
  /** False ⇒ rendered as a disabled control with a "coming soon" note. */
  enabled: boolean;
}

export const ACCOUNT_ACTIONS: { login: AccountAction; register: AccountAction } = {
  login: { labelKey: "cta.login", href: undefined, enabled: false },
  register: { labelKey: "cta.getStarted", href: undefined, enabled: false },
};
