import type { Plugin } from "vite"

import { API_PREFIX } from "experience-sync/api/routes"
import { handleExperienceSyncApiRequest } from "experience-sync/api/server"

/** Mount the experience-sync API on the Vite dev server at /api/*. */
export function experienceSyncApiPlugin(): Plugin {
  return {
    name: "experience-sync-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith(`${API_PREFIX}/`)) {
          next()
          return
        }
        void handleExperienceSyncApiRequest(req, res)
      })
    },
  }
}
