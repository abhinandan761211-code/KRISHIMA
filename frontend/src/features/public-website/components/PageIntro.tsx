import type { ReactNode } from "react";
import { Container } from "@krishima/ui";
import { PublicSection } from "./PublicSection";

/**
 * Interior-page hero shared by every non-landing public page.
 *
 * The landing hero is intentionally different (photograph + CTAs), so this is
 * not a duplicate: it is the standard "page header on the alternate band"
 * treatment that keeps interior pages visually identical to each other.
 */
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <PublicSection tone="alt">
      <Container size="2xl" className="max-w-[var(--kr-container-public)]">
        <div className="flex max-w-[62rem] flex-col gap-4">
          {eyebrow && (
            <p className="text-[length:var(--kr-text-sm)] font-semibold uppercase tracking-[0.08em] text-[color:var(--kr-primary-text)]">
              {eyebrow}
            </p>
          )}
          <h1 className="text-balance text-[2rem] font-bold leading-tight tracking-tight text-[color:var(--kr-fg)] sm:text-[2.5rem]">
            {title}
          </h1>
          {description && (
            <p className="max-w-[64ch] text-[length:var(--kr-text-body)] leading-relaxed text-[color:var(--kr-fg-body)] sm:text-[1.0625rem]">
              {description}
            </p>
          )}
          {children}
        </div>
      </Container>
    </PublicSection>
  );
}
