import path from "path"
import { fileURLToPath } from "url"
import react from "@vitejs/plugin-react"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig, type Plugin } from "vite"
import viteCompression from "vite-plugin-compression"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")

// https://vitejs.dev/config/
export default defineConfig({
  envDir: path.join(rootDir, "config"),
  plugins: [
    react(),
    // Gzip compression for production builds
    viteCompression({
      algorithm: "gzip",
      ext: ".gz",
    }),
    // Brotli compression for production builds
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
    }),
    // Bundle visualization (generates stats.html after build)
    visualizer({
      filename: "./build/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }) as Plugin,
  ],
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "./src"),
      components: path.resolve(rootDir, "./src/components"),
      assets: path.resolve(rootDir, "./src/assets"),
      data: path.resolve(rootDir, "./src/data"),
      styles: path.resolve(rootDir, "./src/styles"),
      hooks: path.resolve(rootDir, "./src/hooks"),
      utils: path.resolve(rootDir, "./src/utils"),
    },
  },
  build: {
    outDir: "build", // Cloudflare Pages expects 'build'
    sourcemap: "hidden", // Generate maps for tooling without exposing them to browsers
    // CSS code splitting
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split react-dom (the ~540KB reconciler) and swiper out of the
          // entry chunk so the main bundle stays small and first paint isn't
          // blocked. `react` itself is deliberately left to Vite/Rollup's
          // default chunking rather than given its own manualChunks bucket:
          // an earlier attempt did that (and also split react-animate-on-scroll
          // into its own "animations" chunk), and Rollup placed a shared
          // CJS-interop helper in "animations" instead of "react", creating a
          // genuine circular import between the two chunks. Because one
          // side's top-level code (react.production.js's
          // `exports.Activity = ...`) ran before the cycle's other side
          // finished initializing, it crashed at runtime with
          // "Cannot set properties of undefined (setting 'Activity')".
          // Leaving react (and react-animate-on-scroll, which depends on it)
          // in Rollup's default chunking avoids that hazard while still
          // isolating react-dom's bulk from the entry chunk.
          if (id.includes("node_modules")) {
            if (/[\\/]react-dom[\\/]/.test(id)) {
              return "react-dom"
            }
            if (id.includes("swiper")) {
              return "swiper"
            }
          }
          return undefined
        },
        // Asset file naming for better caching
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split(".")
          const ext = info?.[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext ?? "")) {
            return `assets/images/[name]-[hash][extname]`
          } else if (/woff|woff2|eot|ttf|otf/i.test(ext ?? "")) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
      },
    },
    // Warn if chunk size exceeds limits
    chunkSizeWarningLimit: 1000, // 1000 KB
  },
})
