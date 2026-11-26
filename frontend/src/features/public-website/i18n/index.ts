import type { MessageCatalog } from "@krishima/ui";
import { en } from "./en";
import { hi } from "./hi";

/**
 * The single message catalogue for the application.
 *
 * This is the one place the runtime is told which locales exist. `hi` is a
 * structural mirror pending professional translation (see hi.ts and
 * OPEN-QUESTIONS A-15); it is registered so the key set is complete and can be
 * validated, but the locale registry marks it `partial` so no user can select it
 * until the copy is real.
 */
export const messages: MessageCatalog = { en, hi };

export { en, hi };
