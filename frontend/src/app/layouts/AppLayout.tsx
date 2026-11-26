import { Outlet } from "react-router-dom";
import { Container, KrishimaLogo, LanguageSwitcher, Navbar, ThemeSwitcher } from "@krishima/ui";

/**
 * Application shell (Phase 2 design system).
 * Uses the shared Navbar + Logo + ThemeSwitcher + LanguageSwitcher. Navigation items
 * are intentionally absent until real routes exist (no placeholder/fake links).
 */
export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Navbar
        brand={<KrishimaLogo size="md" />}
        actions={
          <>
            <LanguageSwitcher compact />
            <ThemeSwitcher />
          </>
        }
      />
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="mt-8 bg-[color:var(--kr-footer-bg)] py-6 text-[color:var(--kr-footer-fg)]">
        <Container size="xl">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <KrishimaLogo size="sm" variant="inverse" />
            <p className="opacity-80">Agriculture super-application for India</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
