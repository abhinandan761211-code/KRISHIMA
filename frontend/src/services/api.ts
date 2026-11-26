/**
 * Centralized API client for the FastAPI backend.
 *
 * Every backend call goes through here. The Supabase access token is attached as a
 * Bearer token; the backend verifies it and resolves authorization server-side.
 * No scattered fetch(), no client-side authorization decisions.
 */
import { config } from "@/config/env";
import { getAccessToken } from "@/services/supabase";

const API_BASE = config.VITE_API_BASE_URL.replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  idempotencyKey?: string;
  signal?: AbortSignal;
}

/**
 * Returns the parsed JSON body exactly as the FastAPI response model defines it —
 * no invented {data: ...} envelope (the backend returns plain objects).
 */
async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const token = await getAccessToken();
  const headers: Record<string, string> = { Accept: "application/json" };
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  if (opts.idempotencyKey) headers["Idempotency-Key"] = opts.idempotencyKey;

  const response = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
  });

  if (!response.ok) {
    let code = "internal_error";
    let message = `Request failed with status ${response.status}.`;
    let requestId: string | undefined;
    try {
      const payload = await response.json();
      code = payload?.error?.code ?? code;
      message = payload?.error?.message ?? message;
      requestId = payload?.error?.request_id;
    } catch {
      /* non-JSON error body: keep defaults, never surface raw text */
    }
    throw new ApiError(response.status, code, message, requestId);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown, idempotencyKey?: string) =>
    request<T>(path, { method: "POST", body, idempotencyKey }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: "PATCH", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

/** Readiness probe used by the foundation status page (unauthenticated). */
export type DependencyState =
  | "connected"
  | "configured"
  | "not_configured"
  | "failed"
  | "not_tested"
  | "tested";

export interface DependencyStatus {
  name: string;
  status: DependencyState;
  detail: string;
  critical?: boolean;
}
export interface Readiness {
  status: "ready" | "degraded";
  checked_at: string;
  dependencies: DependencyStatus[];
}
export interface VersionInfo {
  name: string;
  version: string;
  api_version: string;
  environment: string;
  uptime_seconds: number;
}

export const systemApi = {
  health: () =>
    fetch(`${API_BASE}/health`).then(
      (r) => r.json() as Promise<{ status: string; env: string; unhealthy_dependencies: string[] }>,
    ),
  // The readiness probe returns 503 when degraded — that is still a valid report.
  ready: async (): Promise<Readiness> => {
    const r = await fetch(`${API_BASE}/ready`);
    if (r.status !== 200 && r.status !== 503) {
      throw new ApiError(r.status, "unavailable", "Readiness probe failed.");
    }
    return (await r.json()) as Readiness;
  },
  version: () => fetch(`${API_BASE}/version`).then((r) => r.json() as Promise<VersionInfo>),
  authConfig: () =>
    fetch(`${API_BASE}/auth/config`).then((r) => r.json()) as Promise<{
      email_password_enabled: boolean;
      google_enabled: boolean;
      email_confirmation_required: boolean;
      jwt_verification_mode: string;
      redirect_callback_path: string;
    }>,
};
