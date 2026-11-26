import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Container,
  DataTable,
  ErrorState,
  Heading,
  KrishimaLogo,
  PageHeader,
  SkeletonText,
  StatusBadge,
  Text,
  type Column,
  type StatusKind,
} from "@krishima/ui";
import { systemApi, type DependencyStatus } from "@/services/api";
import { config } from "@/config/env";

/**
 * DEVELOPMENT-ONLY System Status page.
 * Shows REAL results from the backend readiness probe. Never hardcoded.
 * Production renders a plain notice (no infrastructure diagnostics exposed).
 */
export function SystemStatusPage() {
  if (config.VITE_APP_ENV === "production") {
    return (
      <Container className="py-10">
        <KrishimaLogo as="h1" size="lg" />
        <Text className="mt-2">This diagnostics page is not available in production.</Text>
      </Container>
    );
  }
  return <DevSystemStatus />;
}

const DEP_STATUS: Record<string, StatusKind> = {
  connected: "connected",
  configured: "configured",
  not_configured: "not_configured",
  failed: "failed",
  not_tested: "not_tested",
  tested: "tested",
};

const FRIENDLY: Record<string, string> = {
  database: "PostgreSQL",
  supabase_auth: "Supabase Auth",
  google_oauth: "Google OAuth",
  storage: "Supabase Storage",
};

function DevSystemStatus() {
  const ready = useQuery({
    queryKey: ["system-ready"],
    queryFn: systemApi.ready,
    refetchInterval: 15_000,
    retry: 1,
  });
  const version = useQuery({ queryKey: ["system-version"], queryFn: systemApi.version, retry: 1 });

  const columns: Column<DependencyStatus>[] = [
    {
      key: "name",
      header: "Component",
      cell: (d) => <span className="font-medium">{FRIENDLY[d.name] ?? d.name}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (d) => <StatusBadge status={DEP_STATUS[d.status] ?? "not_tested"} />,
    },
    {
      key: "detail",
      header: "Detail",
      hideBelow: "md",
      cell: (d) => <span className="text-fg-muted">{d.detail}</span>,
    },
  ];

  return (
    <Container className="py-8">
      <PageHeader
        title="Foundation status"
        description="Development only — live results reported by the backend readiness probe."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card padding="sm">
          <Text size="caption">Environment</Text>
          <p className="font-medium text-fg">{config.VITE_APP_ENV}</p>
        </Card>
        <Card padding="sm">
          <Text size="caption">API version</Text>
          <p className="font-medium text-fg">{version.data?.api_version ?? "—"}</p>
        </Card>
        <Card padding="sm">
          <Text size="caption">App version</Text>
          <p className="font-medium text-fg">{version.data?.version ?? "—"}</p>
        </Card>
        <Card padding="sm">
          <Text size="caption">Uptime</Text>
          <p className="font-medium text-fg">
            {version.data ? `${Math.floor(version.data.uptime_seconds / 60)}m` : "—"}
          </p>
        </Card>
      </div>

      <Heading level={2} className="mb-3">
        Dependencies
      </Heading>

      {ready.isLoading && (
        <Card aria-busy="true">
          <SkeletonText lines={4} />
        </Card>
      )}

      {ready.isError && (
        <ErrorState
          title="Backend unreachable"
          description={(ready.error as Error).message}
          onRetry={() => void ready.refetch()}
        />
      )}

      {ready.data && (
        <>
          {ready.data.status === "degraded" && (
            <Alert tone="warning" title="Overall status: degraded" className="mb-4">
              One or more critical dependencies are unavailable.
            </Alert>
          )}
          <DataTable
            caption="Backend dependency status"
            columns={columns}
            rows={ready.data.dependencies}
            rowKey={(d) => d.name}
          />
          <Text size="caption" className="mt-3">
            Last checked: {new Date(ready.data.checked_at).toLocaleTimeString()} · results are
            computed live and never hardcoded.
          </Text>
        </>
      )}

      <div className="mt-6 flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => void ready.refetch()}>
          Refresh
        </Button>
      </div>
    </Container>
  );
}
