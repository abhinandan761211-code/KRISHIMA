/* eslint-disable react-refresh/only-export-components -- this module exports the
   public route table (a value) alongside the layout component, so the router and
   tests can import both from one place. Fast refresh does not apply to a route
   module; see the same pattern in app/router/index.tsx. */
import type { ReactElement } from "react";
import { PublicLayout } from "@/features/public-website/layouts/PublicLayout";
import { LandingPage } from "@/features/public-website/pages/LandingPage";
import { AboutPage } from "@/features/public-website/pages/AboutPage";
import { ServicesPage } from "@/features/public-website/pages/ServicesPage";
import { HowItWorksPage } from "@/features/public-website/pages/HowItWorksPage";
import { ContactPage } from "@/features/public-website/pages/ContactPage";
import { FaqPage, HelpPage } from "@/features/public-website/pages/FaqHelpPages";
import { PrivacyPage, TermsPage } from "@/features/public-website/pages/LegalPages";
import { SolutionPage } from "@/features/public-website/pages/SolutionPage";
import { NotFoundPage } from "@/features/public-website/pages/NotFoundPage";
import { PUBLIC_ROLES } from "@/features/public-website/data/roles";

/**
 * Public website route children — the ONLY place public routes are declared.
 *
 * Solutions routes are generated from PUBLIC_ROLES, so a role can never have a
 * card without a page (or a page without a card). Navbar, footer, sitemap and
 * tests all read the same data.
 *
 * These are children of a single layout route, so they have no leading "/".
 */
export interface PublicRouteChild {
  path: string;
  element: ReactElement;
}

export const publicRouteChildren: PublicRouteChild[] = [
  { path: "", element: <LandingPage /> },
  { path: "about", element: <AboutPage /> },
  { path: "services", element: <ServicesPage /> },
  { path: "how-it-works", element: <HowItWorksPage /> },
  { path: "faq", element: <FaqPage /> },
  { path: "contact", element: <ContactPage /> },
  { path: "help", element: <HelpPage /> },
  { path: "privacy", element: <PrivacyPage /> },
  { path: "terms", element: <TermsPage /> },
  ...PUBLIC_ROLES.map((role) => ({
    path: role.href.replace(/^\//, ""),
    element: <SolutionPage roleId={role.id} />,
  })),
  { path: "*", element: <NotFoundPage /> },
];

export { PublicLayout };
