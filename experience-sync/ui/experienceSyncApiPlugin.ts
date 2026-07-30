import type { Plugin } from "vite"

/** Mount the experience-sync API on the Vite dev server at /api/*. */
export function experienceSyncApiPlugin(): Plugin {
  return {
    name: "experience-sync-api",
    configureServer(server) {
      // Load after Vite config/aliases are active — bare `experience-sync/*` imports
      // cannot resolve while Node is still evaluating this config file.
      server.middlewares.use((req, res, next) => {
        void (async () => {
          const { API_PREFIX } = await server.ssrLoadModule("experience-sync/api/routes")
          if (!req.url?.startsWith(`${API_PREFIX}/`)) {
            next()
            return
          }
          const { handleExperienceSyncApiRequest } = await server.ssrLoadModule("experience-sync/api/server")
          await handleExperienceSyncApiRequest(req, res)
        })().catch(next)
      })
    },
  }
}
