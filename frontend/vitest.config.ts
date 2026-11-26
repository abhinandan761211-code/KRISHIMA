import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const appRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Single React instance: the workspace package must resolve React from the
      // app, not from its own node_modules (prevents duplicate-hook failures).
      react: `${appRoot}node_modules/react`,
      "react-dom": `${appRoot}node_modules/react-dom`,
      "react/jsx-runtime": `${appRoot}node_modules/react/jsx-runtime`,
      "react/jsx-dev-runtime": `${appRoot}node_modules/react/jsx-dev-runtime`,
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
