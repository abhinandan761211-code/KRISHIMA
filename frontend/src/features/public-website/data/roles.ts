import type { IconName } from "@krishima/ui";

/**
 * The eight public account categories.
 *
 * These are MARKETING destinations only. A "role" in the product is a role a
 * user holds (see docs/product/02-account-permission-matrix.md) — the public
 * site must not imply that a category is a separate account or a separate login.
 *
 * `href` always points at a page that exists in this phase (/solutions/*).
 * Card copy lives in the i18n catalogue under `roles.<id>.*`, so translations
 * are a data change, never a component change.
 */
export type RoleId =
  | "farmer"
  | "buyer"
  | "retailer"
  | "worker"
  | "equipment"
  | "transporter"
  | "warehouse"
  | "creator";

export interface PublicRole {
  id: RoleId;
  icon: IconName;
  href: string;
  /** Module accent token name from tokens.css (`--kr-mod-*`). Icon/label only. */
  accent: string;
}

export const PUBLIC_ROLES: PublicRole[] = [
  { id: "farmer", icon: "sprout", href: "/solutions/farmer", accent: "module-farmer" },
  { id: "buyer", icon: "bag", href: "/solutions/buyer", accent: "module-buyer" },
  { id: "retailer", icon: "store", href: "/solutions/retailer", accent: "module-retailer" },
  { id: "worker", icon: "users", href: "/solutions/worker", accent: "module-worker" },
  { id: "equipment", icon: "wrench", href: "/solutions/equipment", accent: "module-equipment" },
  { id: "transporter", icon: "truck", href: "/solutions/transporter", accent: "module-transporter" },
  { id: "warehouse", icon: "warehouse", href: "/solutions/warehouse", accent: "module-warehouse" },
  { id: "creator", icon: "video", href: "/solutions/creator", accent: "module-creator" },
];
