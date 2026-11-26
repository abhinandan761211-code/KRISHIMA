import { cn } from "../../lib/cn";

export type LogoSize = "sm" | "md" | "lg";

const SIZES: Record<LogoSize, string> = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-3xl",
};

interface KrishimaLogoProps {
  size?: LogoSize;
  /** Render "KRISHIMA" as a heading for the page (default: inline brand mark). */
  as?: "span" | "h1";
  className?: string;
  /** Hide the accessible name when a nearby heading already states it. */
  decorative?: boolean;
  /** Force the inverse (on-dark) treatment for decorative dark surfaces. */
  variant?: "default" | "inverse";
}

/**
 * The KRISHIMA wordmark — the ONLY approved rendering of the logo.
 *   KRISHI → brand green (#15803D) in both themes
 *   MA     → black in light mode, white in dark mode (theme-driven token)
 * Proportions, letter-spacing and weights are fixed; do not restyle per module.
 */
export function KrishimaLogo({
  size = "md",
  as: Tag = "span",
  className,
  decorative = false,
  variant = "default",
}: KrishimaLogoProps) {
  // KRISHI is always brand green (AGENTS §11). The token resolves to brand green
  // in light mode and to the lightened brand green in dark mode, where the
  // original green fails the 3:1 contrast minimum.
  const krishiColor = variant === "inverse" ? "#ffffff" : "var(--kr-logo-krishi)";
  const maColor = variant === "inverse" ? "#ffffff" : "var(--kr-logo-ma)";

  return (
    <Tag
      className={cn(
        "inline-flex items-baseline font-bold tracking-tight select-none",
        SIZES[size],
        className,
      )}
      {...(decorative ? { "aria-hidden": true } : { "aria-label": "KRISHIMA" })}
    >
      <span data-logo="krishi" style={{ color: krishiColor }}>
        KRISHI
      </span>
      <span data-logo="ma" style={{ color: maColor }}>
        MA
      </span>
    </Tag>
  );
}
