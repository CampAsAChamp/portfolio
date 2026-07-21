import path from "node:path"
import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { careerApiPlugin } from "./careerApiPlugin"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
  plugins: [react(), careerApiPlugin()],
  resolve: {
    alias: {
      "@career": path.resolve(__dirname, ".."),
      assets: path.resolve(__dirname, "../../src/assets"),
      components: path.resolve(__dirname, "../../src/components"),
      data: path.resolve(__dirname, "../../src/data"),
      hooks: path.resolve(__dirname, "../../src/hooks"),
      styles: path.resolve(__dirname, "../../src/styles"),
      types: path.resolve(__dirname, "../../src/types"),
      utils: path.resolve(__dirname, "../../src/utils"),
    },
  },
  publicDir: path.resolve(__dirname, "../../public"),
  server: {
    host: "127.0.0.1",
    port: 4700,
    strictPort: true,
  },
})
