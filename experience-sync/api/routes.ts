import http from "node:http"
import { HttpMethod, parseJsonBody, sendJson } from "experience-sync/api/http"
import { runCli } from "experience-sync/api/runCli"
import { writeExperiencesTs } from "experience-sync/lib/generate"
import { formatLinkedInExport } from "experience-sync/lib/linkedin"
import { listContentFiles, loadExperiencesDocument, readYamlFile, saveExperiencesDocument, writeYamlFile } from "experience-sync/lib/load"
import { contentFilePath } from "experience-sync/lib/paths"
import { formatResumeExport } from "experience-sync/lib/resume"
import { validateExperiencesDocument, type ExperiencesDocument, type ValidationIssue } from "experience-sync/lib/schema"

type RouteHandler = (req: http.IncomingMessage, res: http.ServerResponse, pathname: string) => Promise<void> | void

/** URL prefix for all experience-sync API routes. */
export const API_PREFIX = "/api"

const FILES_ROUTE = `${API_PREFIX}/files`
const FILES_ROUTE_PREFIX = `${FILES_ROUTE}/`

/** Route table keys are `${method} ${path}` where path is relative to API_PREFIX (e.g. `/health`). */
const exactRoutes: Record<string, RouteHandler> = {
  [`${HttpMethod.GET} /health`]: handleHealth,
  [`${HttpMethod.GET} /files`]: handleListFiles,
  [`${HttpMethod.POST} /validate`]: handleValidate,
  [`${HttpMethod.POST} /generate`]: handleGenerate,
  [`${HttpMethod.GET} /export/linkedin`]: handleExportLinkedIn,
  [`${HttpMethod.GET} /export/resume`]: handleExportResume,
  [`${HttpMethod.GET} /preview`]: handlePreview,
  [`${HttpMethod.POST} /sync`]: handleSync,
}

/** Strip `/api` so route keys match relative paths; returns `undefined` when not under the API. */
function toRelativeApiPath(pathname: string): string | undefined {
  if (pathname === API_PREFIX) {
    return "/"
  }
  if (pathname.startsWith(`${API_PREFIX}/`)) {
    return pathname.slice(API_PREFIX.length)
  }
  return undefined
}

/** Decode the filename segment from `/api/files/<name>`. */
function filenameFromFilesPath(pathname: string): string {
  return decodeURIComponent(pathname.slice(FILES_ROUTE_PREFIX.length))
}

/** Load experiences.yaml, or send a 400 and return without calling onSuccess. */
function loadExperiencesOrRespond(
  res: http.ServerResponse,
  onSuccess: (data: ExperiencesDocument, issues: ValidationIssue[]) => void,
): void {
  const loaded = loadExperiencesDocument()
  if (!loaded.success || !loaded.data) {
    sendJson(res, 400, { ok: false, issues: loaded.issues })
    return
  }
  onSuccess(loaded.data, loaded.issues)
}

/** `GET /api/health` — liveness check for the editor UI. */
function handleHealth(_req: http.IncomingMessage, res: http.ServerResponse): void {
  sendJson(res, 200, { ok: true })
}

/** `GET /api/files` — list YAML basenames under `content/`. */
function handleListFiles(_req: http.IncomingMessage, res: http.ServerResponse): void {
  sendJson(res, 200, { files: listContentFiles() })
}

/** `GET /api/files/:name` — read and return one YAML file's parsed contents. */
function handleGetFile(_req: http.IncomingMessage, res: http.ServerResponse, pathname: string): void {
  const filename = filenameFromFilesPath(pathname)
  contentFilePath(filename)
  const data = readYamlFile(filename)
  sendJson(res, 200, { filename, data })
}

/**
 * `PUT /api/files/:name` — write YAML; `experiences.yaml` is validated before save.
 */
async function handlePutFile(req: http.IncomingMessage, res: http.ServerResponse, pathname: string): Promise<void> {
  const filename = filenameFromFilesPath(pathname)
  const body = await parseJsonBody(req)
  if (filename === "experiences.yaml") {
    const result = saveExperiencesDocument(body.data ?? body)
    if (!result.success) {
      sendJson(res, 400, { ok: false, issues: result.issues })
      return
    }
    sendJson(res, 200, { ok: true, issues: result.issues, data: result.data })
    return
  }
  writeYamlFile(filename, body.data ?? body)
  sendJson(res, 200, { ok: true })
}

/** `POST /api/validate` — validate a document body without writing to disk. */
async function handleValidate(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const body = await parseJsonBody(req)
  const result = validateExperiencesDocument(body.data ?? body)
  sendJson(res, result.success ? 200 : 400, {
    ok: result.success,
    issues: result.issues,
    data: result.data,
  })
}

/** `POST /api/generate` — write `src/data/experiences.ts` from on-disk YAML. */
function handleGenerate(_req: http.IncomingMessage, res: http.ServerResponse): void {
  loadExperiencesOrRespond(res, (data, issues) => {
    const out = writeExperiencesTs(data)
    sendJson(res, 200, { ok: true, path: out, issues })
  })
}

/** `GET /api/export/linkedin` — LinkedIn-ready plain text from on-disk YAML. */
function handleExportLinkedIn(_req: http.IncomingMessage, res: http.ServerResponse): void {
  loadExperiencesOrRespond(res, (data) => {
    sendJson(res, 200, { text: formatLinkedInExport(data) })
  })
}

/** `GET /api/export/resume` — resume markdown from on-disk YAML. */
function handleExportResume(_req: http.IncomingMessage, res: http.ServerResponse): void {
  loadExperiencesOrRespond(res, (data) => {
    sendJson(res, 200, { text: formatResumeExport(data) })
  })
}

/** `GET /api/preview` — both LinkedIn and resume export texts in one response. */
function handlePreview(_req: http.IncomingMessage, res: http.ServerResponse): void {
  loadExperiencesOrRespond(res, (data) => {
    sendJson(res, 200, {
      linkedin: formatLinkedInExport(data),
      resume: formatResumeExport(data),
    })
  })
}

/** `POST /api/sync` — run `cli/sync.ts` (portfolio generate + LinkedIn + resume). */
async function handleSync(_req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const result = await runCli("sync.ts")
  sendJson(res, result.ok ? 200 : 500, { ok: result.ok, output: result.output })
}

/** Resolve an exact or `/api/files/:name` handler for the given method and path. */
function matchRoute(method: string, pathname: string): RouteHandler | undefined {
  const relativePath = toRelativeApiPath(pathname)
  if (relativePath === undefined) {
    return undefined
  }

  const exact = exactRoutes[`${method} ${relativePath}`]
  if (exact) {
    return exact
  }

  if (pathname.startsWith(FILES_ROUTE_PREFIX) && pathname.length > FILES_ROUTE_PREFIX.length) {
    if (method === HttpMethod.GET) {
      return handleGetFile
    }
    if (method === HttpMethod.PUT) {
      return handlePutFile
    }
  }

  return undefined
}

/** Look up the handler for method+pathname and run it (or 404 / OPTIONS). */
export async function routeRequest(req: http.IncomingMessage, res: http.ServerResponse, method: string, pathname: string): Promise<void> {
  if (method === HttpMethod.OPTIONS) {
    sendJson(res, 204, {})
    return
  }

  const handler = matchRoute(method, pathname)
  if (!handler) {
    sendJson(res, 404, { error: `Not found: ${method} ${pathname}` })
    return
  }

  await handler(req, res, pathname)
}
