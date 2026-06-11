import { defineConfig } from "vitest/config";

export default defineConfig({
  // PAGES_BASE is set when building for GitHub Pages (served under /monaco-editor-code-review/)
  base: process.env.PAGES_BASE ?? "/",
  build: {
    outDir: "site",
    rollupOptions: {
      input: "examples/index.html",
    },
  },
  test: {
    environment: "jsdom",
    coverage: {
      include: ["src/**"],
      exclude: ["src/docs.ts"],
    },
  },
});
