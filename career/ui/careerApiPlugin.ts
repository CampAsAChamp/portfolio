import type { Plugin } from "vite"

import { handleCareerApiRequest } from "../api/server"

/** Mount the career content API on the Vite dev server at /api/*. */
export function careerApiPlugin(): Plugin {
  return {
    name: "career-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith("/api/")) {
          next()
          return
        }
        void handleCareerApiRequest(req, res)
      })
    },
  }
}
