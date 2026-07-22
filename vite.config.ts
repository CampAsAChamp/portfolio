import path from "path"
import react from "@vitejs/plugin-react"
import { visualizer } from "rollup-plugin-visualizer"
import { defineConfig, type Plugin } from "vite"
import viteCompression from "vite-plugin-compression"

// https://vitejs.dev/config/
export default defineConfig({
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
      "@": path.resolve(__dirname, "./src"),
      components: path.resolve(__dirname, "./src/components"),
      assets: path.resolve(__dirname, "./src/assets"),
      data: path.resolve(__dirname, "./src/data"),
      styles: path.resolve(__dirname, "./src/styles"),
      hooks: path.resolve(__dirname, "./src/hooks"),
      utils: path.resolve(__dirname, "./src/utils"),
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
          // Split heavy vendor code out of the entry chunk so the main bundle
          // stays small and first paint isn't blocked by the React reconciler.
          // A function (not an object map) is required here: react-dom's real
          // runtime lives in deep imports (react-dom/client, react-dom-client.production.js,
          // scheduler) that an object map keyed on "react-dom" does NOT capture,
          // which previously left the ~540KB reconciler in the entry chunk.
          if (id.includes("node_modules")) {
            if (/[\\/]react-dom[\\/]|[\\/]scheduler[\\/]|[\\/]react[\\/]/.test(id)) {
              return "react"
            }
            if (id.includes("react-animate-on-scroll")) {
              return "animations"
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
