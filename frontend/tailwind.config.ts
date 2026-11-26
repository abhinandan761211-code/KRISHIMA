import type { Config } from "tailwindcss";

/**
 * KRISHIMA — Tailwind is wired to the CSS custom properties defined in
 * packages/ui/styles/tokens.css. Raw hex NEVER appears here: every colour is a
 * semantic token reference, so light/dark themes switch without class changes.
 *
 * Usage in components: bg-surface, text-fg, border-border, ring-focus …
 * (prefer the shared components from @krishima/ui for anything non-trivial).
 */
const token = (name: string) => `var(--kr-${name})`;

export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    // Include the shared component library so its classes are generated.
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
          raised: token("surface-raised"),
        },
        fg: {
          DEFAULT: token("fg"),
          body: token("fg-body"),
          muted: token("fg-muted"),
          placeholder: token("fg-placeholder"),
          inverse: token("fg-inverse"),
        },
        primary: {
          DEFAULT: token("primary"),
          hover: token("primary-hover"),
          active: token("primary-active"),
          fg: token("primary-fg"),
          subtle: token("primary-subtle"),
          text: token("primary-text"),
        },
        accent: token("accent"),
        secondary: {
          DEFAULT: token("secondary"),
          fg: token("secondary-fg"),
        },
        border: {
          DEFAULT: token("border"),
          strong: token("border-strong"),
          subtle: token("border-subtle"),
        },
        ring: token("focus-ring"),
        success: { DEFAULT: token("success"), bg: token("success-bg") },
        error: { DEFAULT: token("error"), bg: token("error-bg") },
        warning: { DEFAULT: token("warning"), bg: token("warning-bg") },
        info: { DEFAULT: token("info"), bg: token("info-bg") },
        footer: {
          DEFAULT: token("footer-bg"),
          fg: token("footer-fg"),
          muted: token("footer-muted"),
          border: token("footer-border"),
          link: token("footer-link"),
          "link-hover": token("footer-link-hover"),
        },
        // Module accents (icons/labels only)
        module: {
          farmer: token("mod-farmer"),
          buyer: token("mod-buyer"),
          retailer: token("mod-retailer"),
          worker: token("mod-worker"),
          equipment: token("mod-equipment"),
          transporter: token("mod-transporter"),
          warehouse: token("mod-warehouse"),
          creator: token("mod-creator"),
          community: token("mod-community"),
          admin: token("mod-admin"),
        },
      },
      fontFamily: {
        sans: ["var(--kr-font-sans)"],
        hindi: ["var(--kr-font-hindi)"],
        mono: ["var(--kr-font-mono)"],
      },
      borderRadius: {
        sm: token("radius-sm"),
        md: token("radius-md"),
        card: token("radius-card"),
        lg: token("radius-lg"),
        full: token("radius-full"),
      },
      spacing: {
        1: token("space-1"),
        2: token("space-2"),
        3: token("space-3"),
        4: token("space-4"),
        5: token("space-5"),
        6: token("space-6"),
        8: token("space-8"),
        10: token("space-10"),
        12: token("space-12"),
        16: token("space-16"),
      },
      boxShadow: {
        xs: token("shadow-xs"),
        sm: token("shadow-sm"),
        md: token("shadow-md"),
      },
      minHeight: { touch: token("touch-target") },
      maxWidth: {
        public: token("container-public"),
        measure: token("measure"),
      },
      padding: { section: token("section-py"), hero: token("hero-py") },
      transitionDuration: { fast: token("motion-fast"), base: token("motion-base") },
    },
  },
  plugins: [],
} satisfies Config;
