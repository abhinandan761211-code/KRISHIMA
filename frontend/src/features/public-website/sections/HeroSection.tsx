import { Icon, useI18n } from "@krishima/ui";
import { ACCOUNT_ACTIONS } from "../data/account";
import { AppLink } from "../components/AppLink";

/**
 * Hero (landing §2).
 *
 * Performance choices for rural, low-bandwidth users:
 *  - the photograph is a plain <img> with srcset/sizes (two sizes, ~67KB/244KB),
 *    `fetchpriority="high"` because it is the LCP element, and a fixed aspect
 *    ratio so it reserves space and never causes layout shift;
 *  - the <picture> art direction keeps the phone payload small;
 *  - no WebP/AVIF variants yet: the source is a JPEG and transcoding needs a build
 *    step, which is documented as a limitation rather than hidden.
 *
 * No statistics, no counts, no claims — the copy avoids unverifiable numbers
 * because the platform has no launched population yet.
 */
export function HeroSection() {
  const { t } = useI18n();

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-[color:var(--kr-bg)] pb-[length:var(--kr-section-py)] pt-[length:var(--kr-hero-py)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-64 bg-[color:var(--kr-surface-muted)] opacity-60 [mask-image:radial-gradient(60%_100%_at_50%_0%,black,transparent)]"
      />
      <div className="relative mx-auto grid w-full max-w-[var(--kr-container-public)] items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <div className="flex flex-col items-start gap-6">
          <p className="inline-flex items-center gap-2 rounded-[var(--kr-radius-full)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] px-3 py-1 text-[length:var(--kr-text-sm)] font-medium text-[color:var(--kr-primary-text)]">
            <Icon name="sprout" size={16} />
            {t("hero.eyebrow")}
          </p>
          <h1
            id="hero-heading"
            className="max-w-[20ch] text-balance text-[2rem] font-bold leading-[1.15] tracking-tight text-[color:var(--kr-fg)] sm:text-[2.5rem] lg:text-[3rem]"
          >
            {t("hero.title")}
          </h1>
          <p className="max-w-[56ch] text-[length:var(--kr-text-body)] leading-relaxed text-[color:var(--kr-fg-body)] sm:text-[1.0625rem]">
            {t("hero.description")}
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <AppLink to={ACCOUNT_ACTIONS.register.href} size="lg" className="w-full sm:w-auto">
              {t("cta.getStarted")}
              {!ACCOUNT_ACTIONS.register.enabled && (
                <span className="text-[length:var(--kr-text-caption)] font-normal opacity-80">
                  ({t("common.comingSoon")})
                </span>
              )}
            </AppLink>
            <AppLink to="/services" variant="secondary" size="lg" className="w-full sm:w-auto">
              {t("cta.exploreServices")}
              <Icon name="arrowRight" size={18} />
            </AppLink>
          </div>
          <p className="text-[length:var(--kr-text-sm)] text-[color:var(--kr-fg-muted)]">
            {t("hero.supportNote")}
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[var(--kr-radius-lg)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface-muted)] shadow-[var(--kr-shadow-sm)]">
            <picture>
              {/* WebP first: ~45% smaller than the JPEG fallback on typical connections.
               * Two width variants let the browser pick by viewport; the small one is
               * used below 640px. Both are 16:9 so the container never shifts. */}
              <source
                type="image/webp"
                media="(max-width: 640px)"
                srcSet="/images/hero-farm-800.webp"
                width={800}
                height={450}
              />
              <source type="image/webp" srcSet="/images/hero-farm-1600.webp" width={1600} height={900} />
              <source
                media="(max-width: 640px)"
                srcSet="/images/hero-farm-800.jpg"
                width={800}
                height={450}
              />
              <img
                src="/images/hero-farm-1600.jpg"
                srcSet="/images/hero-farm-800.jpg 800w, /images/hero-farm-1600.jpg 1600w"
                sizes="(max-width: 1024px) 100vw, 560px"
                width={1600}
                height={900}
                alt={t("hero.imageAlt")}
                fetchPriority="high"
                decoding="async"
                className="aspect-[16/9] h-auto w-full object-cover"
              />
            </picture>
          </div>
          <div className="absolute -bottom-4 -left-3 hidden rounded-[var(--kr-radius-card)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] px-4 py-3 shadow-[var(--kr-shadow-sm)] sm:block">
            <p className="text-[length:var(--kr-text-caption)] font-semibold uppercase tracking-wide text-[color:var(--kr-fg-muted)]">
              {t("hero.rolesCaption")}
            </p>
            <p className="mt-0.5 text-[length:var(--kr-text-sm)] font-semibold text-[color:var(--kr-fg)]">
              {t("hero.rolesSummary")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
