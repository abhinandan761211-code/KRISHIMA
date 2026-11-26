import { Outlet } from "react-router-dom";
import { useI18n } from "@krishima/ui";
import { AnnouncementBar } from "@/features/public-website/components/AnnouncementBar";
import { PublicFooter } from "@/features/public-website/components/PublicFooter";
import { PublicNavbar } from "@/features/public-website/components/PublicNavbar";
import { useRouteFocus } from "@/features/public-website/seo/useSeo";

/**
 * Public website shell.
 *
 * Structure is fixed so every marketing page shares the same landmarks:
 *   skip link → header → main#main-content → footer
 * The skip link is the first focusable element on the page and is visually
 * hidden until focused (WCAG 2.4.1).
 */
export function PublicLayout() {
  const { t } = useI18n();
  useRouteFocus();

  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--kr-bg)]">
      <a
        href="#main-content"
        className="sr-only z-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:inline-flex focus:min-h-[var(--kr-touch-target)] focus:items-center focus:rounded-[var(--kr-radius-md)] focus:bg-[color:var(--kr-primary)] focus:px-4 focus:text-[color:var(--kr-primary-fg)] focus:shadow-[var(--kr-shadow-md)]"
      >
        {t("nav.skipToContent")}
      </a>
      <AnnouncementBar />
      <PublicNavbar />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
