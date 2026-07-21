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
    },
  },
  server: {
    host: "127.0.0.1",
    port: 4700,
    strictPort: true,
  },
})
