import { useI18n } from "@krishima/ui";
import { PageIntro } from "@/features/public-website/components/PageIntro";
import { PublicSection } from "@/features/public-website/components/PublicSection";
import { AppLink } from "@/features/public-website/components/AppLink";
import { useSeo } from "@/features/public-website/seo/useSeo";

/** 404 — a real page with navigation back, marked noindex. */
export function NotFoundPage() {
  const { t } = useI18n();
  useSeo({
    titleKey: "meta.notFound.title",
    descriptionKey: "meta.notFound.description",
    path: "/404",
    indexable: false,
  });

  return (
    <>
      <PageIntro eyebrow={t("notFound.eyebrow")} title={t("notFound.title")} description={t("notFound.description")}>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <AppLink to="/" variant="primary">
            {t("notFound.home")}
          </AppLink>
          <AppLink to="/services" variant="secondary">
            {t("cta.exploreServices")}
          </AppLink>
        </div>
      </PageIntro>

      <PublicSection>
        <div className="mx-auto w-full max-w-[var(--kr-container-public)] px-4 sm:px-6 lg:px-8">
          <nav aria-label={t("notFound.helpful")}>
            <h2 className="text-[length:var(--kr-text-h5)] font-semibold text-[color:var(--kr-fg)]">
              {t("notFound.helpful")}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["/about", "nav.about"],
                  ["/how-it-works", "nav.howItWorks"],
                  ["/faq", "nav.faq"],
                  ["/contact", "nav.contact"],
                  ["/help", "nav.help"],
                ] as const
              ).map(([path, key]) => (
                <li key={path}>
                  <AppLink to={path} variant="secondary" size="sm">
                    {t(key)}
                  </AppLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </PublicSection>
    </>
  );
}
