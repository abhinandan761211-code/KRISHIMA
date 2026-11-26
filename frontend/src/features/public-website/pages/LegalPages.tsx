import { useI18n } from "@krishima/ui";
import { ContentPage, LegalSectionBlock } from "@/features/public-website/components/ContentPage";
import { PUBLIC_SITE } from "@/features/public-website/data/site-config";

/**
 * /privacy and /terms — DRAFT legal content.
 *
 * These pages are deliberately short, generic and explicitly marked as drafts.
 * They are NOT legal advice and carry no compliance claim (DPDP Act 2023 review
 * is an open question — docs/OPEN-QUESTIONS.md A-09). The `draft` flag on
 * ContentPage renders a persistent banner; `PUBLIC_SITE.legalReviewStatus` is the
 * single switch that removes it once a lawyer approves the text.
 */
const PRIVACY_SECTIONS = ["collect", "use", "share", "rights", "contact"] as const;
const TERMS_SECTIONS = ["use", "accounts", "content", "liability", "changes"] as const;

function LegalFooterMeta() {
  const { t } = useI18n();
  return (
    <p className="text-[length:var(--kr-text-caption)] text-[color:var(--kr-fg-muted)]">
      {t("legal.lastUpdatedLabel")}: <time dateTime={PUBLIC_SITE.legalLastUpdated}>{PUBLIC_SITE.legalLastUpdated}</time>
    </p>
  );
}

export function PrivacyPage() {
  const { t } = useI18n();
  return (
    <ContentPage
      draft={PUBLIC_SITE.legalReviewStatus === "draft"}
      meta={{ titleKey: "meta.privacy.title", descriptionKey: "meta.privacy.description", path: "/privacy" }}
      intro={{ eyebrow: t("legal.eyebrow"), title: t("legal.privacyPage.title"), description: t("legal.privacyPage.lead") }}
    >
      <LegalFooterMeta />
      {PRIVACY_SECTIONS.map((id) => (
        <LegalSectionBlock key={id} id={`privacy.${id}`} paragraphKeys={[`legal.privacy.${id}.p`]} />
      ))}
    </ContentPage>
  );
}

export function TermsPage() {
  const { t } = useI18n();
  return (
    <ContentPage
      draft={PUBLIC_SITE.legalReviewStatus === "draft"}
      meta={{ titleKey: "meta.terms.title", descriptionKey: "meta.terms.description", path: "/terms" }}
      intro={{ eyebrow: t("legal.eyebrow"), title: t("legal.termsPage.title"), description: t("legal.termsPage.lead") }}
    >
      <LegalFooterMeta />
      {TERMS_SECTIONS.map((id) => (
        <LegalSectionBlock key={id} id={`terms.${id}`} paragraphKeys={[`legal.terms.${id}.p`]} />
      ))}
    </ContentPage>
  );
}
