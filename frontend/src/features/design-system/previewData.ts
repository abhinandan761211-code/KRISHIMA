/**
 * Token sample data for the dev preview page. Values here are READ FROM the live
 * CSS custom properties at runtime — this file only names them.
 */
export const SEMANTIC_SWATCHES: { token: string; label: string }[] = [
  { token: "--kr-bg", label: "Background" },
  { token: "--kr-surface", label: "Surface" },
  { token: "--kr-surface-muted", label: "Muted surface" },
  { token: "--kr-surface-secondary", label: "Secondary surface" },
  { token: "--kr-fg", label: "Heading text" },
  { token: "--kr-fg-body", label: "Body text" },
  { token: "--kr-fg-muted", label: "Secondary text" },
  { token: "--kr-fg-placeholder", label: "Placeholder" },
  { token: "--kr-border", label: "Decorative border" },
  { token: "--kr-border-strong", label: "Input border" },
  { token: "--kr-primary", label: "Primary" },
  { token: "--kr-primary-hover", label: "Primary hover" },
  { token: "--kr-primary-active", label: "Primary active" },
  { token: "--kr-secondary", label: "Secondary button" },
  { token: "--kr-accent", label: "Decorative accent" },
  { token: "--kr-focus-ring", label: "Focus ring" },
  { token: "--kr-success", label: "Success" },
  { token: "--kr-error", label: "Error" },
  { token: "--kr-warning", label: "Warning" },
  { token: "--kr-info", label: "Information" },
  { token: "--kr-footer-bg", label: "Footer" },
];

export const MODULE_ACCENTS: { token: string; label: string }[] = [
  { token: "--kr-mod-farmer", label: "Farmer" },
  { token: "--kr-mod-buyer", label: "Buyer" },
  { token: "--kr-mod-retailer", label: "Retailer" },
  { token: "--kr-mod-worker", label: "Worker" },
  { token: "--kr-mod-equipment", label: "Equipment owner" },
  { token: "--kr-mod-transporter", label: "Transporter" },
  { token: "--kr-mod-warehouse", label: "Warehouse" },
  { token: "--kr-mod-creator", label: "Creator" },
  { token: "--kr-mod-community", label: "Community" },
  { token: "--kr-mod-admin", label: "Administration" },
];

export const SPACE_SCALE = [
  "--kr-space-1",
  "--kr-space-2",
  "--kr-space-3",
  "--kr-space-4",
  "--kr-space-5",
  "--kr-space-6",
  "--kr-space-8",
  "--kr-space-10",
  "--kr-space-12",
  "--kr-space-16",
];

export const RADIUS_SCALE = [
  "--kr-radius-sm",
  "--kr-radius-md",
  "--kr-radius-card",
  "--kr-radius-lg",
  "--kr-radius-full",
];

export const TYPE_SCALE: { token: string; label: string; level: 1 | 2 | 3 | 4 | 5 | 6 | 0 }[] = [
  { token: "--kr-text-display", label: "Display", level: 0 },
  { token: "--kr-text-h1", label: "Heading 1", level: 1 },
  { token: "--kr-text-h2", label: "Heading 2", level: 2 },
  { token: "--kr-text-h3", label: "Heading 3", level: 3 },
  { token: "--kr-text-h4", label: "Heading 4", level: 4 },
  { token: "--kr-text-h5", label: "Heading 5", level: 5 },
  { token: "--kr-text-h6", label: "Heading 6", level: 6 },
  { token: "--kr-text-body", label: "Body (16px)", level: 0 },
  { token: "--kr-text-sm", label: "Small", level: 0 },
  { token: "--kr-text-caption", label: "Caption", level: 0 },
];
