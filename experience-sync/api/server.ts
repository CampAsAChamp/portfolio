import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { HttpMethod, sendJson } from "experience-sync/api/http"
import { routeRequest } from "experience-sync/api/routes"
import { CONTENT_DIR } from "experience-sync/lib/paths"

/** Default port for the standalone experience-sync API (`yarn exp:ui` overrides via Vite). */
export const DEFAULT_PORT = 4701

/**
 * Handle one HTTP request for the experience-sync API (`/api/*`).
 * Catches handler errors and responds with 500 JSON.
 */
export async function handleExperienceSyncApiRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "127.0.0.1"}`)
  const method = req.method ?? HttpMethod.GET

  try {
    await routeRequest(req, res, method, url.pathname)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    sendJson(res, 500, { error: message })
  }
}

/** Create the standalone HTTP server that serves `/api/*` for the experience editor. */
export function createExperienceSyncApiServer(): http.Server {
  return http.createServer((req, res) => {
    void handleExperienceSyncApiRequest(req, res)
  })
}

/**
 * Ensure `content/` exists and listen on `127.0.0.1`.
 * Used by `yarn exp:ui` (via Vite plugin) or when this module is run directly.
 */
export function startExperienceSyncApiServer(port = DEFAULT_PORT): http.Server {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true })
  }

  const server = createExperienceSyncApiServer()
  server.listen(port, "127.0.0.1", () => {
    console.log(`Experience sync API listening on http://127.0.0.1:${port}`)
  })
  return server
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const port = Number(process.env.EXPERIENCE_SYNC_API_PORT ?? DEFAULT_PORT)
  startExperienceSyncApiServer(port)
}
