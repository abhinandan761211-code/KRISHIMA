import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nProvider, ThemeProvider, ToastProvider } from "@krishima/ui";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

/**
 * Single provider stack for the app. There must be exactly ONE ThemeProvider,
 * ONE I18nProvider and ONE ToastProvider in the tree (see packages/ui).
 * `initI18n()` runs at module scope in main.tsx, before this mounts.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>{children}</ToastProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
