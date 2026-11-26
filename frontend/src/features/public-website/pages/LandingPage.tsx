import { useSeo } from "@/features/public-website/seo/useSeo";
import { HeroSection } from "@/features/public-website/sections/HeroSection";
import { PlatformIntroSection } from "@/features/public-website/sections/PlatformIntroSection";
import { RolesSection } from "@/features/public-website/sections/RolesSection";
import { FeaturesSection } from "@/features/public-website/sections/FeaturesSection";
import { EcosystemSection } from "@/features/public-website/sections/EcosystemSection";
import { HowItWorksSection } from "@/features/public-website/sections/HowItWorksSection";
import { FarmerSolutionsSection, BusinessSolutionsSection } from "@/features/public-website/sections/SolutionsSections";
import { MarketplacePreviewSection } from "@/features/public-website/sections/MarketplacePreviewSection";
import { CommunitySection } from "@/features/public-website/sections/CommunitySection";
import { TrustSection } from "@/features/public-website/sections/TrustSection";
import { FaqSection, FinalCtaSection } from "@/features/public-website/sections/FaqAndCtaSections";

/**
 * Landing page (public website, landing spec §5 — not roadmap Phase 3).
 *
 * Deliberately a thin composition: each of the 15 sections is an independent,
 * individually testable component with its own data and its own i18n keys. This
 * file must never grow business logic or inline copy — if a section needs new
 * behaviour it changes in its own module.
 *
 * Section order (matches the specification):
 *  1 AnnouncementBar (in the layout)   9  Business solutions
 *  2 Hero                              10 Marketplace preview
 *  3 Platform introduction             11 Community & knowledge
 *  4 Account categories                12 Trust & security
 *  5 Platform features (bento)         13 FAQ
 *  6 Connected ecosystem               14 Final CTA
 *  7 How it works                      15 Footer (in the layout)
 *  8 Farmer solutions
 */
export function LandingPage() {
  useSeo({
    titleKey: "meta.home.title",
    descriptionKey: "meta.home.description",
    path: "/",
    imagePath: "/images/og-default.jpg",
  });

  return (
    <>
      <HeroSection />
      <PlatformIntroSection />
      <RolesSection />
      <FeaturesSection />
      <EcosystemSection />
      <HowItWorksSection />
      <FarmerSolutionsSection />
      <BusinessSolutionsSection />
      <MarketplacePreviewSection />
      <CommunitySection />
      <TrustSection />
      <FaqSection />
      <FinalCtaSection />
    </>
  );
}
