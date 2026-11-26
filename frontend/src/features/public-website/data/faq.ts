/**
 * FAQ question IDs, in display order.
 *
 * Kept in `data/` rather than inside the section component for two reasons:
 *  1. it is content structure, not UI — the section's job is layout, and the
 *     repository rule is that static lists live in `data/`;
 *  2. a component module that also exports a constant trips the
 *     `react-refresh/only-export-components` lint rule, which previously produced
 *     a standing warning that obscured real ones.
 *
 * Each id maps to `faq.items.<id>.question` / `.answer` in the catalogues.
 */
export const FAQ_ITEMS = [
  "accounts",
  "availability",
  "services",
  "cost",
  "support",
  "data",
] as const;

export type FaqItemId = (typeof FAQ_ITEMS)[number];
