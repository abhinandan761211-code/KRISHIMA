import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

/** Horizontally centred, responsive content container. */
export function Container({
  children,
  size = "xl",
  className,
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
}) {
  const max =
    size === "full"
      ? "max-w-none"
      : size === "sm"
        ? "max-w-[var(--kr-container-sm)]"
        : size === "md"
          ? "max-w-[var(--kr-container-md)]"
          : size === "lg"
            ? "max-w-[var(--kr-container-lg)]"
            : size === "2xl"
              ? "max-w-[var(--kr-container-2xl)]"
              : "max-w-[var(--kr-container-xl)]";

  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", max, className)}>{children}</div>
  );
}

/** Vertically spaced page section with an optional heading. */
export function Section({
  title,
  description,
  id,
  children,
  as: Heading = "h2",
  className,
}: {
  title?: string;
  description?: string;
  id?: string;
  as?: "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={title ? id : undefined} id={id} className={cn("py-6", className)}>
      {title && (
        <div className="mb-4">
          <Heading
            id={id}
            className="text-[length:var(--kr-text-h3)] font-semibold text-[color:var(--kr-fg)]"
          >
            {title}
          </Heading>
          {description && (
            <p className="mt-1 text-[15px] text-[color:var(--kr-fg-muted)]">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
