import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Container, KrishimaLogo, Spinner, Text } from "@krishima/ui";
import { authService } from "@/services/auth";

/**
 * Auth callback route — handles the return from Supabase (email confirmation or
 * Google OAuth) and establishes the session. Full onboarding is a later phase.
 */
export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<"processing" | "ok" | "error">("processing");
  const [message, setMessage] = useState("Completing sign-in…");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await authService.getSession();
        if (cancelled) return;
        if (session) {
          setState("ok");
          setMessage("Signed in. Redirecting…");
          setTimeout(() => navigate("/", { replace: true }), 600);
        } else {
          setState("error");
          setMessage("We could not establish a session. The link may have expired — please try again.");
        }
      } catch (err) {
        if (cancelled) return;
        setState("error");
        setMessage(err instanceof Error ? err.message : "Authentication failed.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <Container size="sm" className="py-16">
      <KrishimaLogo as="h1" size="lg" />
      <div className="mt-6" aria-live="polite">
        {state === "processing" && (
          <div className="flex items-center gap-3">
            <Spinner decorative />
            <Text>{message}</Text>
          </div>
        )}
        {state === "ok" && <Alert tone="success" title={message} />}
        {state === "error" && (
          <>
            <Alert tone="error" title="Sign-in failed">
              {message}
            </Alert>
            <Link
              to="/"
              className="mt-4 inline-flex min-h-[var(--kr-touch-target)] items-center rounded-[var(--kr-radius-md)] bg-[color:var(--kr-secondary)] px-4 text-sm font-medium text-[color:var(--kr-secondary-fg)] hover:bg-[color:var(--kr-secondary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kr-focus-ring)] focus-visible:ring-offset-2"
            >
              Return to start
            </Link>
          </>
        )}
      </div>
    </Container>
  );
}
