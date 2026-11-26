import { Icon, useI18n } from "@krishima/ui";
import { ContentPage } from "@/features/public-website/components/ContentPage";
import { AppLink } from "@/features/public-website/components/AppLink";

/** /about — what KRISHIMA is, why it exists, and what state it is in today. */
const PRINCIPLES = ["trust", "rural", "modular", "languages"] as const;
const PRINCIPLE_ICONS = { trust: "shield", rural: "mapPin", modular: "box", languages: "globe" } as const;

export function AboutPage() {
  const { t } = useI18n();

  return (
    <ContentPage
      meta={{ titleKey: "meta.about.title", descriptionKey: "meta.about.description", path: "/about" }}
      intro={{
        eyebrow: t("about.eyebrow"),
        title: t("about.title"),
        description: t("about.description"),
      }}
    >
      <h2 id="about-mission" className="text-[length:var(--kr-text-h3)] font-semibold text-[color:var(--kr-fg)]">
        {t("about.missionTitle")}
      </h2>
      <p className="text-[length:var(--kr-text-body)] leading-relaxed text-[color:var(--kr-fg-body)]">
        {t("about.mission")}
      </p>

      <h2 className="mt-4 text-[length:var(--kr-text-h3)] font-semibold text-[color:var(--kr-fg)]">
        {t("about.principlesTitle")}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((id) => (
          <li
            key={id}
            className="rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-5"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--kr-radius-md)] bg-[color:var(--kr-primary-subtle)] text-[color:var(--kr-primary-fg-on-subtle)]"
            >
              <Icon name={PRINCIPLE_ICONS[id]} size={18} />
            </span>
            <h3 className="mt-3 text-[length:var(--kr-text-h5)] font-semibold text-[color:var(--kr-fg)]">
              {t(`about.principles.${id}.title`)}
            </h3>
            <p className="mt-1 text-[length:var(--kr-text-sm)] leading-relaxed text-[color:var(--kr-fg-body)]">
              {t(`about.principles.${id}.description`)}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mt-4 text-[length:var(--kr-text-h3)] font-semibold text-[color:var(--kr-fg)]">
        {t("about.statusTitle")}
      </h2>
      <p className="text-[length:var(--kr-text-body)] leading-relaxed text-[color:var(--kr-fg-body)]">
        {t("about.status")}
      </p>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <AppLink to="/services" variant="secondary">
          {t("cta.exploreServices")}
        </AppLink>
        <AppLink to="/contact" variant="link">
          {t("about.contactCta")}
        </AppLink>
      </div>
    </ContentPage>
  );
}
