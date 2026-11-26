import type { Config } from "tailwindcss";

/**
 * KRISHIMA Admin — Tailwind wired to the shared design tokens.
 * Admin uses the same palette/tokens as the marketplace app, with a denser,
 * desktop-first layout. No raw hex values here.
 */
const token = (name: string) => `var(--kr-${name})`;

export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: token("bg"),
        surface: {
          DEFAULT: token("surface"),
          muted: token("surface-muted"),
          secondary: token("surface-secondary"),
        },
        fg: {
          DEFAULT: token("fg"),
          body: token("fg-body"),
          muted: token("fg-muted"),
          placeholder: token("fg-placeholder"),
        },
        primary: {
          DEFAULT: token("primary"),
          hover: token("primary-hover"),
          fg: token("primary-fg"),
          subtle: token("primary-subtle"),
          text: token("primary-text"),
        },
        secondary: { DEFAULT: token("secondary"), fg: token("secondary-fg") },
        border: { DEFAULT: token("border"), strong: token("border-strong") },
        ring: token("focus-ring"),
        success: { DEFAULT: token("success"), bg: token("success-bg") },
        error: { DEFAULT: token("error"), bg: token("error-bg") },
        warning: { DEFAULT: token("warning"), bg: token("warning-bg") },
        info: { DEFAULT: token("info"), bg: token("info-bg") },
      },
      fontFamily: { sans: ["var(--kr-font-sans)"] },
      borderRadius: {
        sm: token("radius-sm"),
        md: token("radius-md"),
        card: token("radius-card"),
        lg: token("radius-lg"),
        full: token("radius-full"),
      },
      minHeight: { touch: token("touch-target") },
    },
  },
  plugins: [],
} satisfies Config;
