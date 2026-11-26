import { useEffect, useId, useRef, useState } from "react";
import { Icon, KrishimaLogo, LanguageSwitcher, ThemeSwitcher, cn, useI18n } from "@krishima/ui";
import { Link, useLocation } from "react-router-dom";
import { ACCOUNT_ACTIONS } from "../data/account";
import { PRIMARY_NAV, SOLUTION_NAV } from "../data/site";
import { AppLink, NavTextLink } from "./AppLink";

/**
 * Solutions dropdown for the desktop bar.
 *
 * Implements the WAI-ARIA "disclosure navigation menu" pattern rather than a
 * menu role: the items are ordinary links, so they must stay links. Enter/Space
 * toggles, Escape closes and returns focus to the trigger, focus leaving the
 * group closes it, and clicking outside closes it.
 */
function SolutionsMenu() {
  const { t } = useI18n();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  // Close on route change (a selection is a navigation).
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("touchstart", onDocDown);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("touchstart", onDocDown);
    };
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && open) {
      e.stopPropagation();
      setOpen(false);
      triggerRef.current?.focus();
    }
    if ((e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") && !open) {
      e.preventDefault();
      setOpen(true);
      // Move focus to the first item after the popup renders.
      requestAnimationFrame(() => {
        rootRef.current?.querySelector<HTMLAnchorElement>("[data-solutions-item]")?.focus();
      });
    }
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex min-h-[var(--kr-touch-target)] items-center gap-1 whitespace-nowrap rounded-[var(--kr-radius-md)] px-3 text-[15px] font-medium",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2",
          pathname.startsWith("/solutions")
            ? "bg-[color:var(--kr-nav-item-selected-bg)] text-[color:var(--kr-nav-item-selected-fg)]"
            : "text-[color:var(--kr-nav-item-fg)] hover:bg-[color:var(--kr-nav-item-hover-bg)] hover:text-[color:var(--kr-fg)]",
        )}
      >
        {t("nav.solutions")}
        <Icon name="chevronDown" size={16} className={cn(open && "rotate-180 transition-transform")} />
      </button>

      <div
        id={menuId}
        hidden={!open}
        className={cn(
          "absolute left-1/2 top-full z-40 -translate-x-1/2 pt-2",
          "w-[min(92vw,34rem)]",
        )}
      >
        <div className="rounded-[var(--kr-radius-lg)] border border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] p-2 shadow-[var(--kr-shadow-md)]">
          <ul className="grid grid-cols-2 gap-1">
            {SOLUTION_NAV.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  data-solutions-item
                  aria-current={pathname === item.path ? "page" : undefined}
                  className="flex min-h-[var(--kr-touch-target)] items-center gap-2 rounded-[var(--kr-radius-md)] px-3 text-[15px] font-medium text-[color:var(--kr-fg-body)] hover:bg-[color:var(--kr-surface-muted)] aria-[current=page]:bg-[color:var(--kr-nav-item-selected-bg)] aria-[current=page]:text-[color:var(--kr-nav-item-selected-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-inset"
                >
                  <Icon name={item.icon} size={18} className="text-[color:var(--kr-primary-text)]" />
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Accessible mobile menu.
 *
 * A <dialog> cannot hold a 44px-tall scrolling nav comfortably, and a custom
 * focus trap duplicates platform behaviour, so this is a disclosure panel that:
 *  - is always in the DOM (so its links are crawlable) but hidden from AT;
 *  - moves focus to its first link when opened, and back to the trigger on close;
 *  - closes on Escape, on route change, and when the viewport grows to desktop.
 */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) onClose();
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      id="public-mobile-menu"
      hidden={!open}
      className="border-t border-[color:var(--kr-border)] bg-[color:var(--kr-surface)] lg:hidden"
    >
      <div className="mx-auto max-h-[calc(100dvh-8rem)] w-full max-w-[var(--kr-container-public)] overflow-y-auto px-4 pb-6 pt-2 sm:px-6">
        <ul className="flex flex-col">
          {PRIMARY_NAV.map((item) => (
            <li key={item.path}>
              <NavTextLink to={item.path} exact={item.path === "/"} onClick={onClose} className="w-full">
                {t(item.key)}
              </NavTextLink>
            </li>
          ))}
        </ul>

        <p className="mt-4 px-3 text-[length:var(--kr-text-caption)] font-semibold uppercase tracking-wide text-[color:var(--kr-fg-muted)]">
          {t("nav.solutions")}
        </p>
        <ul className="mt-1 flex flex-col">
          {SOLUTION_NAV.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={onClose}
                aria-current={undefined}
                className="flex min-h-[var(--kr-touch-target)] w-full items-center gap-2 rounded-[var(--kr-radius-md)] px-3 text-[15px] text-[color:var(--kr-fg-body)] hover:bg-[color:var(--kr-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-inset"
              >
                <Icon name={item.icon} size={18} className="text-[color:var(--kr-primary-text)]" />
                {t(item.key)}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-col gap-2 border-t border-[color:var(--kr-border)] pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          <AppLink to={ACCOUNT_ACTIONS.login.href} variant="secondary" size="md" className="w-full">
            {t(ACCOUNT_ACTIONS.login.labelKey)}
            {!ACCOUNT_ACTIONS.login.enabled && (
              <span className="text-[length:var(--kr-text-caption)] font-normal opacity-80">
                ({t("common.comingSoon")})
              </span>
            )}
          </AppLink>
          <AppLink to={ACCOUNT_ACTIONS.register.href} variant="primary" size="md" className="w-full">
            {t(ACCOUNT_ACTIONS.register.labelKey)}
            {!ACCOUNT_ACTIONS.register.enabled && (
              <span className="text-[length:var(--kr-text-caption)] font-normal opacity-80">
                ({t("common.comingSoon")})
              </span>
            )}
          </AppLink>
        </div>
      </div>
    </div>
  );
}

/**
 * PublicNavbar — the single navigation implementation for the public website.
 *
 * Layout: announcement bar → sticky header (logo, desktop links, actions) →
 * mobile disclosure panel. Exactly one <header> landmark per page.
 */
export function PublicNavbar() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const closeMobile = () => {
    setMobileOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--kr-nav-border)] bg-[color:var(--kr-nav-bg)]/95 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--kr-nav-bg)]/85">
      <div className="mx-auto flex min-h-[64px] w-full max-w-[var(--kr-container-public)] items-center gap-2 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label={t("nav.homeLabel")}
          className="inline-flex min-h-11 shrink-0 items-center rounded-[var(--kr-radius-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2"
        >
          <KrishimaLogo size="md" decorative />
        </Link>

        <nav aria-label={t("nav.primaryLabel")} className="ml-4 hidden items-center gap-0.5 lg:flex xl:gap-1">
          {PRIMARY_NAV.map((item) => (
            <NavTextLink key={item.path} to={item.path} exact={item.path === "/"}>
              {t(item.key)}
            </NavTextLink>
          ))}
          <SolutionsMenu />
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/*
           * The language + theme pair is ~341px wide. Revealing it at `lg` (1024px)
           * alongside the full nav, login and signup pushed the bar's content to
           * 1123px and caused horizontal page overflow (measured: 99px at 1024).
           * It is therefore shown only from `xl` (1280px), where the row fits; below
           * that it lives in the mobile menu, which already renders both controls.
           */}
          <div className="hidden items-center gap-2 xl:flex">
            <LanguageSwitcher compact />
            <ThemeSwitcher />
          </div>
          <AppLink
            to={ACCOUNT_ACTIONS.login.href}
            variant="ghost"
            size="sm"
            className="hidden whitespace-nowrap lg:inline-flex"
          >
            {t(ACCOUNT_ACTIONS.login.labelKey)}
          </AppLink>
          <AppLink
            to={ACCOUNT_ACTIONS.register.href}
            variant="primary"
            size="sm"
            className="hidden whitespace-nowrap lg:inline-flex"
          >
            {t(ACCOUNT_ACTIONS.register.labelKey)}
          </AppLink>

          <button
            ref={triggerRef}
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="public-mobile-menu"
            aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--kr-radius-md)] text-[color:var(--kr-fg)] hover:bg-[color:var(--kr-surface-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] lg:hidden"
          >
            <Icon name={mobileOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </div>

      <MobileMenu open={mobileOpen} onClose={closeMobile} />
    </header>
  );
}
