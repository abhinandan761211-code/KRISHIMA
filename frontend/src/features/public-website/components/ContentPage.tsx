import type { ReactNode } from "react";
import { Container, useI18n } from "@krishima/ui";
import { PageIntro } from "./PageIntro";
import { PublicSection } from "./PublicSection";
import { AppLink } from "./AppLink";
import { useSeo } from "@/features/public-website/seo/useSeo";

/**
 * Prose page shell used by /about, /help and the legal pages.
 *
 * Legal pages MUST pass `draft` so the draft banner shows — an unreviewed policy
 * presented as final would be a false claim (task §6).
 */
export function ContentPage({
  meta,
  intro,
  children,
  draft = false,
}: {
  meta: { titleKey: string; descriptionKey: string; path: string };
  intro: { eyebrow?: string; title: string; description?: string; actions?: ReactNode };
  children: ReactNode;
  draft?: boolean;
}) {
  const { t } = useI18n();
  useSeo({
    titleKey: meta.titleKey,
    descriptionKey: meta.descriptionKey,
    path: meta.path,
    imagePath: "/images/og-default.jpg",
  });

  return (
    <>
      <PageIntro eyebrow={intro.eyebrow} title={intro.title} description={intro.description}>
        {intro.actions && <div className="mt-2 flex flex-col gap-3 sm:flex-row">{intro.actions}</div>}
      </PageIntro>
      {draft && (
        <div className="border-b border-[color:var(--kr-warning)] bg-[color:var(--kr-warning-bg)]">
          <Container size="2xl" className="max-w-[var(--kr-container-public)]">
            <p className="py-3 text-[length:var(--kr-text-sm)] font-medium text-[color:var(--kr-warning)]">
              {t("legal.draftNotice")}
            </p>
          </Container>
        </div>
      )}
      <PublicSection>
        <Container size="2xl" className="max-w-[var(--kr-container-public)]">
          <div className="flex max-w-[68ch] flex-col gap-6">{children}</div>
          <div className="mt-10">
            <AppLink to="/contact" variant="link">
              {t("common.questionsContact")}
            </AppLink>
          </div>
        </Container>
      </PublicSection>
    </>
  );
}

/** Long-form legal block: heading + one or more paragraphs from the catalogue. */
export function LegalSectionBlock({ id, paragraphKeys }: { id: string; paragraphKeys: string[] }) {
  const { t } = useI18n();
  const anchor = id.replace(/\./g, "-");
  return (
    <section aria-labelledby={`legal-${anchor}`} className="flex flex-col gap-2">
      <h2 id={`legal-${anchor}`} className="text-[length:var(--kr-text-h3)] font-semibold text-[color:var(--kr-fg)]">
        {t(`legal.${id}.title`)}
      </h2>
      {paragraphKeys.map((key) => (
        <p key={key} className="text-[length:var(--kr-text-body)] leading-relaxed text-[color:var(--kr-fg-body)]">
          {t(key)}
        </p>
      ))}
    </section>
  );
}
