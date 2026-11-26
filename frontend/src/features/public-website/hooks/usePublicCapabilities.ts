import { useSyncExternalStore } from "react";
import { useI18n } from "@krishima/ui";
import { ACCOUNT_ACTIONS } from "../data/account";
import { PUBLIC_SITE } from "../data/site-config";

/**
 * One hook that every public component reads account/contact state from, so no
 * marketing component has to know whether a backend exists yet.
 *
 * Nothing here fakes success: `registerEnabled`/`loginEnabled` are false until
 * the identity phase ships, and the contact form refuses to "send".
 */
export function usePublicCapabilities() {
  const { t } = useI18n();
  const online = useOnline();

  return {
    t,
    register: ACCOUNT_ACTIONS.register,
    login: ACCOUNT_ACTIONS.login,
    registerEnabled: ACCOUNT_ACTIONS.register.enabled,
    loginEnabled: ACCOUNT_ACTIONS.login.enabled,
    supportEmail: PUBLIC_SITE.contact.supportEmail,
    supportPhone: PUBLIC_SITE.contact.supportPhone,
    /** Contact form submission is unavailable until a backend endpoint exists. */
    contactFormEnabled: false,
    online,
  };
}

function subscribeOnline(cb: () => void): () => void {
  globalThis.addEventListener?.("online", cb);
  globalThis.addEventListener?.("offline", cb);
  return () => {
    globalThis.removeEventListener?.("online", cb);
    globalThis.removeEventListener?.("offline", cb);
  };
}

function getOnline(): boolean {
  return globalThis.navigator?.onLine ?? true;
}

function useOnline(): boolean {
  return useSyncExternalStore(subscribeOnline, getOnline, () => true);
}
