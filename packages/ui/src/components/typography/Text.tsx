import type { ElementType, ReactNode } from "react";
import { cn } from "../../lib/cn";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const HEADING_CLASS: Record<HeadingLevel, string> = {
  1: "text-[length:var(--kr-text-h1)] font-semibold leading-tight text-[color:var(--kr-fg)]",
  2: "text-[length:var(--kr-text-h2)] font-semibold leading-tight text-[color:var(--kr-fg)]",
  3: "text-[length:var(--kr-text-h3)] font-semibold text-[color:var(--kr-fg)]",
  4: "text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]",
  5: "text-[length:var(--kr-text-h5)] font-semibold text-[color:var(--kr-fg)]",
  6: "text-[length:var(--kr-text-h6)] font-semibold uppercase tracking-wide text-[color:var(--kr-fg-muted)]",
};

/**
 * Heading with semantic level. Always keep levels in order (no h4 before h2);
 * use `as` only to adjust visual size while preserving document structure.
 */
export function Heading({
  level = 2,
  as,
  children,
  className,
  id,
}: {
  level?: HeadingLevel;
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const Tag = (as ?? (`h${level}` as ElementType)) as ElementType;
  return (
    <Tag id={id} className={cn(HEADING_CLASS[level], className)}>
      {children}
    </Tag>
  );
}

/** Body copy. Defaults to 16px — the farmer-facing minimum. */
export function Text({
  children,
  size = "body",
  className,
}: {
  children: ReactNode;
  size?: "body" | "sm" | "caption";
  className?: string;
}) {
  const cls =
    size === "caption"
      ? "text-[length:var(--kr-text-caption)] text-[color:var(--kr-fg-placeholder)]"
      : size === "sm"
        ? "text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-muted)]"
        : "text-[length:var(--kr-text-body)] text-[color:var(--kr-fg-body)]";
  return <p className={cn(cls, className)}>{children}</p>;
}

/** Financial / numeric value with tabular figures for column alignment. */
export function NumericText({
  children,
  className,
  emphasis = false,
}: {
  children: ReactNode;
  className?: string;
  emphasis?: boolean;
}) {
  return (
    <span
      className={cn(
        "tabular-nums",
        emphasis
          ? "text-[length:var(--kr-text-h4)] font-semibold text-[color:var(--kr-fg)]"
          : "text-[color:var(--kr-fg-body)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
