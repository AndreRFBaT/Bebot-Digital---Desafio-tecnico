/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // host: true permite acesso de fora do container (escuta em 0.0.0.0).
    host: true,
    port: 5173,
    proxy: {
      // No Docker aponta para o serviço "api"; local cai no default localhost.
      "/api": process.env.API_PROXY_TARGET ?? "http://localhost:3001",
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    pool: "forks",
    poolOptions: { forks: { singleFork: true } },
  },
});
