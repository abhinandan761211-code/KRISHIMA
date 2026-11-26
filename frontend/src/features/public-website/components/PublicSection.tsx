import type { ReactNode } from "react";
import { cn } from "@krishima/ui";

type Tone = "default" | "alt" | "surface";

/**
 * Public page section wrapper.
 *
 * `@krishima/ui`'s `Section` is tuned for dashboard density; marketing pages need
 * the editorial rhythm from `--kr-section-py` (48px mobile → 72px desktop) and an
 * optional alternating band. This is the ONLY section wrapper used by the public
 * site — sections never carry their own padding, so spacing stays consistent.
 */
export function PublicSection({
  id,
  labelledBy,
  tone = "default",
  className,
  children,
  as: Tag = "section",
}: {
  id?: string;
  /** id of the heading that names this section (landmark naming). */
  labelledBy?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
  as?: "section" | "div";
}) {
  const bg =
    tone === "alt"
      ? "bg-[color:var(--kr-surface-public-alt)]"
      : tone === "surface"
        ? "bg-[color:var(--kr-surface)]"
        : "bg-[color:var(--kr-bg)]";

  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-[length:var(--kr-section-py)]", bg, className)}
    >
      {children}
    </Tag>
  );
}

/** Section heading block: optional eyebrow, a real h2, and a lead paragraph. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "start",
  level = 2,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
  level?: 2 | 3;
  className?: string;
}) {
  const Tag = level === 2 ? "h2" : "h3";
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-[length:var(--kr-text-sm)] font-semibold uppercase tracking-[0.08em] text-[color:var(--kr-primary-text)]">
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={cn(
          "max-w-[42ch] text-balance font-semibold text-[color:var(--kr-fg)]",
          level === 2
            ? "text-[1.75rem] leading-tight md:text-[2rem]"
            : "text-[length:var(--kr-text-h3)]",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            "max-w-[62ch] text-[length:var(--kr-text-body)] text-[color:var(--kr-fg-body)]",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
