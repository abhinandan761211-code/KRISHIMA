import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { initI18n } from "@krishima/ui";
import { AppProviders } from "@/app/providers/AppProviders";
import { router } from "@/app/router";
import { messages } from "@/features/public-website/i18n";
import "@/styles/index.css";

// Register the message catalogue and restore the persisted locale BEFORE the
// first render, so no page ever flashes the wrong language (or a raw key).
initI18n({ defaultLocale: "en", locales: messages });

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root not found.");

createRoot(container).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
