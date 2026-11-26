import type { IconName } from "@krishima/ui";

/**
 * Platform features shown in the Bento grid (landing §5).
 *
 * `status` is the honesty contract for this page: `available` means the
 * capability is built in a shipped platform foundation, `planned` means it is on
 * the roadmap and NOT usable yet. The UI renders a visible "Coming soon" label
 * for every planned feature — never a fake "Try it" link (AGENTS §8).
 *
 * Grounding for `available`: the platform foundation in Phase 1/2 ships
 * authentication, accounts/workspaces and a design system. No agricultural
 * business module ships in this phase, so **no feature is marked available yet**.
 * Every entry is therefore `planned`; flipping one to `available` is a
 * deliberate, evidence-backed change made when that module actually ships.
 */
export type FeatureStatus = "available" | "planned";

export type FeatureId =
  | "farmManagement"
  | "cropManagement"
  | "weather"
  | "mandiPrices"
  | "marketplace"
  | "equipmentRental"
  | "employment"
  | "transport"
  | "warehouse"
  | "knowledge";

export interface PublicFeature {
  id: FeatureId;
  icon: IconName;
  status: FeatureStatus;
  /** Bento cell size on md+ screens. */
  span: "wide" | "tall" | "normal";
}

export const PUBLIC_FEATURES: PublicFeature[] = [
  { id: "farmManagement", icon: "leaf", status: "planned", span: "wide" },
  { id: "cropManagement", icon: "sprout", status: "planned", span: "normal" },
  { id: "weather", icon: "cloudSun", status: "planned", span: "normal" },
  { id: "mandiPrices", icon: "trending", status: "planned", span: "normal" },
  { id: "marketplace", icon: "store", status: "planned", span: "wide" },
  { id: "equipmentRental", icon: "wrench", status: "planned", span: "normal" },
  { id: "employment", icon: "users", status: "planned", span: "normal" },
  { id: "transport", icon: "truck", status: "planned", span: "normal" },
  { id: "warehouse", icon: "warehouse", status: "planned", span: "normal" },
  { id: "knowledge", icon: "book", status: "planned", span: "wide" },
];
