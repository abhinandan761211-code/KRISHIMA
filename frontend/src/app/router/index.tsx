/* eslint-disable react-refresh/only-export-components -- this module exports a
   router instance (a value), not components; fast-refresh rule does not apply. */
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Spinner } from "@krishima/ui";
import { AppLayout } from "@/app/layouts/AppLayout";
import { AuthCallbackPage } from "@/features/auth/pages/AuthCallbackPage";
import { SystemStatusPage } from "@/features/system-status/pages/SystemStatusPage";
import { PublicLayout, publicRouteChildren } from "@/features/public-website/routes";
import { config } from "@/config/env";
import { lazy, Suspense } from "react";

// Dev-only pages are code-split so they never bloat the production bundle.
const DesignSystemPage = lazy(() =>
  import("@/features/design-system/pages/DesignSystemPage").then((m) => ({
    default: m.DesignSystemPage,
  })),
);

const devFallback = (
  <div className="flex justify-center py-16">
    <Spinner label="Loading design system" />
  </div>
);

/*
 * Route tree (non-component module: exported as a value, so it is intentionally
 * not a React component export).
 *
 * "/" is the PUBLIC website (marketing site; NOT roadmap Phase 3). Its pages are
 * declared in features/public-website/routes.tsx from a single data source. The
 * internal application shell (status page, auth callback, dev tools) keeps its
 * own namespace so marketing and app chrome never share a layout.
 *
 * Note: the roadmap's Phase 3 is "Catalog & Listings" and has not started. The
 * public website is foundation work outside the phased business scope.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: publicRouteChildren,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { path: "system-status", element: <SystemStatusPage /> },
      { path: "auth/callback", element: <AuthCallbackPage /> },
      ...(config.VITE_APP_ENV !== "production"
        ? [
            {
              path: "dev/design-system",
              element: (
                <Suspense fallback={devFallback}>
                  <DesignSystemPage />
                </Suspense>
              ),
            },
          ]
        : []),
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
