import { describe, expect, it } from "vitest";
import { ApiError } from "@/services/api";

describe("centralized API error model", () => {
  it("carries code, status and request id from the backend envelope", () => {
    const err = new ApiError(401, "unauthenticated", "Authentication required.", "req-123");
    expect(err.status).toBe(401);
    expect(err.code).toBe("unauthenticated");
    expect(err.requestId).toBe("req-123");
    expect(err).toBeInstanceOf(Error);
  });
});

describe("environment config", () => {
  it("loads validated public configuration", async () => {
    const { config } = await import("@/config/env");
    expect(config.VITE_API_BASE_URL).toMatch(/^https?:\/\//);
    expect(config.VITE_SUPABASE_URL).toMatch(/^https?:\/\//);
    expect(config.googleAuthEnabled).toBe(true);
  });
});
