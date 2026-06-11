import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["esm", "cjs", "iife"],
  globalName: "MonacoEditorCodeReview",
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2020",
});
