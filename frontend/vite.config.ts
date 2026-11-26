import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { seoFilesPlugin } from "./scripts/seo-files";

export default defineConfig({
  plugins: [react(), seoFilesPlugin({ envDir: fileURLToPath(new URL(".", import.meta.url)) })],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { port: 5173, strictPort: true },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split large, rarely-changing vendors so they cache independently of app code.
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-auth": ["@supabase/supabase-js"],
          "vendor-query": ["@tanstack/react-query"],
        },
      },
    },
  },
});
