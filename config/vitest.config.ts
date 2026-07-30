import path from "path"
import { fileURLToPath } from "url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
      components: path.resolve(rootDir, "./src/components"),
      assets: path.resolve(rootDir, "./src/assets"),
      data: path.resolve(rootDir, "./src/data"),
      styles: path.resolve(rootDir, "./src/styles"),
      hooks: path.resolve(rootDir, "./src/hooks"),
      utils: path.resolve(rootDir, "./src/utils"),
      tests: path.resolve(rootDir, "./tests"),
      "experience-sync": path.resolve(rootDir, "./experience-sync"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/unit/utils/index.tsx",
    include: ["tests/unit/**/*.{test,spec}.{ts,tsx}"],
    css: true,
    coverage: {
      reportsDirectory: "./tests/test_results/unit/coverage",
    },
  },
})
