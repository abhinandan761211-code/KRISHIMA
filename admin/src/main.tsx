import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Alert,
  Badge,
  Card,
  Container,
  KrishimaLogo,
  PageHeader,
  StatusBadge,
  Text,
  ThemeProvider,
  ThemeSwitcher,
} from "@krishima/ui";
import { config } from "@/config/env";
import { supabase } from "@/services/supabase";
import "@/styles/index.css";

/**
 * Admin shell (Phase 2 — design system applied).
 *
 * Still deliberately minimal: establishes session presence and backend reachability.
 * It does NOT implement admin features or client-side role checks — staff
 * authorization is enforced by the backend (`/api/v1/admin/*`), not yet implemented.
 * The admin console uses the shared design tokens (denser, desktop-first layout).
 */
function AdminApp() {
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [backend, setBackend] = useState<string>("checking…");

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user.email ?? null);
    });
    fetch(`${config.VITE_API_BASE_URL.replace(/\/$/, "")}/ready`)
      .then((r) => r.json())
      .then((j) => setBackend(j?.status ?? "unknown"))
      .catch(() => setBackend("unreachable"));
  }, []);

  const backendOk = backend === "ready";

  return (
    <Container size="xl" className="py-8">
      <PageHeader
        title="KRISHIMA Administration"
        description="Staff console — separate application, same backend and design tokens."
        actions={<ThemeSwitcher />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Text size="caption">Session</Text>
          <p className="mt-1 font-medium text-fg">
            {sessionEmail ?? "Not signed in"}
          </p>
          <div className="mt-2">
            <StatusBadge status={sessionEmail ? "active" : "inactive"} label={sessionEmail ? "Signed in" : "Signed out"} />
          </div>
        </Card>
        <Card>
          <Text size="caption">Backend readiness</Text>
          <p className="mt-1 font-medium text-fg">{backend}</p>
          <div className="mt-2">
            <StatusBadge status={backendOk ? "connected" : backend === "checking…" ? "pending" : "failed"} />
          </div>
        </Card>
        <Card>
          <Text size="caption">Staff authorization</Text>
          <p className="mt-1 font-medium text-fg">Server-side only</p>
          <div className="mt-2">
            <Badge tone="info" icon={<span aria-hidden="true">⚙</span>}>
              Not implemented yet
            </Badge>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Alert tone="info" title="Phase 2 foundation">
          The administrative permission model, MFA and audit views are implemented in a later
          phase. Admin permissions are never granted from this client.
        </Alert>
      </div>

      <footer className="mt-8 flex items-center gap-2 border-t border-border pt-4">
        <KrishimaLogo size="sm" decorative />
        <Text size="caption">Deployed separately from the marketplace app.</Text>
      </footer>
    </Container>
  );
}

const el = document.getElementById("root");
if (!el) throw new Error("Root element #root not found.");
createRoot(el).render(
  <StrictMode>
    <ThemeProvider>
      <AdminApp />
    </ThemeProvider>
  </StrictMode>,
);
