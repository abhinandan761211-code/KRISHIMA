import type { SVGProps } from "react";
import { cn } from "../../lib/cn";

/**
 * Curated icon set for KRISHIMA.
 *
 * Inline SVG rather than an icon dependency: no extra runtime, no icon font
 * flash, and every glyph inherits `currentColor` so it themes automatically.
 * All paths are drawn on a 24×24 grid with a 1.75 stroke, matching the design
 * system's line weight.
 *
 * Accessibility: icons are DECORATIVE by default (`aria-hidden`). When an icon
 * is the only content of a control, give the control an `aria-label` — never
 * rely on the icon's shape alone.
 */

const PATHS = {
  // — Agriculture & roles —
  sprout: "M12 20v-7m0 0c0-3-2.5-5-6-5 0 3.5 2.5 5 6 5Zm0 0c0-3 2.5-5 6-5 0 3.5-2.5 5-6 5Z",
  leaf: "M5 19c0-8 5-13 14-13 0 9-5 14-14 13Zm0 0 7-7",
  tractor: "M4 17h2m8 0h4M4 13V8h5l2 5h7v4M9 8V6h3M7 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  bag: "M6 8h12l-1 12H7L6 8Zm3 0V6a3 3 0 0 1 6 0v2",
  store: "M4 9h16v10H4V9Zm0 0 2-5h12l2 5M9 19v-5h6v5",
  users: "M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m6.5-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM21 19v-1a4 4 0 0 0-3-3.87M16.5 4.13a3 3 0 0 1 0 5.75",
  truck: "M3 7h11v9H3V7Zm11 3h4l3 3v3h-7M6.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  warehouse: "M3 20V9l9-4 9 4v11M7 20v-7h10v7M7 16h10",
  video: "M3 7h12v10H3V7Zm12 3 6-3v10l-6-3",
  handshake: "m8 12 3 3 5-5 4 4-5 5-3-3-2 2-6-6 3-3 3 3",
  wrench: "M14.5 6.5a4 4 0 0 0 5 5L11 20l-3-3 8.5-8.5a4 4 0 0 1-2-2Z",
  box: "m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Zm0 0v18M4 7.5l8 4.5 8-4.5",
  // — Platform features —
  cloudSun: "M7 8a4 4 0 0 1 7.5-1A3.5 3.5 0 1 1 16 14H7a3 3 0 0 1 0-6Zm-2-4v2m-3 1 1.5 1.5M3 14H1",
  trending: "m3 17 5-5 4 4 8-8m0 0h-5m5 0v5",
  chart: "M4 20V4m0 16h16M8 16V9m4 7V6m4 10v-5",
  book: "M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2V5Zm2-2v14h12",
  message: "M4 5h16v11H9l-5 4V5Z",
  calendar: "M4 6h16v14H4V6Zm0 4h16M8 3v4m8-4v4",
  fileText: "M6 3h8l4 4v14H6V3Zm8 0v4h4M9 12h6m-6 4h6",
  // — Actions & UI —
  arrowRight: "M5 12h14m0 0-5-5m5 5-5 5",
  arrowDown: "M12 5v14m0 0-5-5m5 5 5-5",
  check: "m5 12 4.5 4.5L19 7",
  checkCircle: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-4-9 3 3 5-5",
  close: "m6 6 12 12M18 6 6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  chevronDown: "m6 9 6 6 6-6",
  external: "M14 4h6v6m0-6-9 9M19 14v5H5V5h5",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-14v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4",
  moon: "M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z",
  shield: "M12 3 4 6v6c0 4.5 3.2 7.7 8 9 4.8-1.3 8-4.5 8-9V6l-8-3Zm-3 9 2 2 4-4",
  lock: "M6 11h12v9H6v-9Zm3 0V8a3 3 0 0 1 6 0v3",
  mapPin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z",
  mail: "M4 6h16v12H4V6Zm0 0 8 7 8-7",
  help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.2-11a2.2 2.2 0 1 1 3.3 1.9c-.7.4-1.1 1-1.1 1.8M12 17h.01",
  sparkle: "M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2.5 2.5m7 7L18 18M18 6l-2.5 2.5m-7 7L6 18",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-9v4m0-8h.01",
  rupee: "M7 4h10M7 8h10M7 4c5 0 7 1.5 7 4s-2 4-7 4l7 8",
  scale: "M12 4v16m-4 0h8M6 8h12M6 8 3 15h6L6 8Zm12 0-3 7h6l-3-7Z",
  refresh: "M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4",
} as const;

export type IconName = keyof typeof PATHS;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Pixel size; defaults to 20 (body text rhythm). */
  size?: number;
  /** Provide a title only when the icon carries meaning on its own. */
  title?: string;
}

export function Icon({ name, size = 20, title, className, ...rest }: IconProps) {
  const labelled = Boolean(title);
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      {...rest}
    >
      {labelled && <title>{title}</title>}
      <path d={PATHS[name]} />
    </svg>
  );
}
