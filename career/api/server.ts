import { spawn } from "node:child_process"
import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { writeExperiencesTs } from "../lib/generate"
import { formatLinkedInExport } from "../lib/linkedin"
import { listContentFiles, loadExperiencesDocument, readYamlFile, saveExperiencesDocument, writeYamlFile } from "../lib/load"
import { CAREER_ROOT, CONTENT_DIR, resolveContentPath } from "../lib/paths"
import { formatResumeExport } from "../lib/resume"
import { validateExperiencesDocument } from "../lib/schema"

export const DEFAULT_PORT = 5175

type JsonBody = Record<string, unknown>

function sendJson(res: http.ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body, null, 2)
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  })
  res.end(payload)
}

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on("data", (chunk: Buffer) => chunks.push(chunk))
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })
}

async function parseJsonBody(req: http.IncomingMessage): Promise<JsonBody> {
  const raw = await readBody(req)
  if (!raw.trim()) {
    return {}
  }
  return JSON.parse(raw) as JsonBody
}

function runCli(script: string): Promise<{ ok: boolean; output: string }> {
  return new Promise((resolve) => {
    const tsxBin = path.resolve(CAREER_ROOT, "../node_modules/.bin/tsx")
    const child = spawn(tsxBin, [path.join(CAREER_ROOT, "cli", script)], {
      cwd: path.resolve(CAREER_ROOT, ".."),
    })
    let output = ""
    child.stdout?.on("data", (d: Buffer) => {
      output += d.toString()
    })
    child.stderr?.on("data", (d: Buffer) => {
      output += d.toString()
    })
    child.on("close", (code) => {
      resolve({ ok: code === 0, output })
    })
  })
}

export async function handleCareerApiRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "127.0.0.1"}`)
  const { pathname } = url
  const method = req.method ?? "GET"

  if (method === "OPTIONS") {
    sendJson(res, 204, {})
    return
  }

  try {
    if (method === "GET" && pathname === "/api/health") {
      sendJson(res, 200, { ok: true })
      return
    }

    if (method === "GET" && pathname === "/api/files") {
      sendJson(res, 200, { files: listContentFiles() })
      return
    }

    if (method === "GET" && pathname.startsWith("/api/files/")) {
      const filename = decodeURIComponent(pathname.slice("/api/files/".length))
      resolveContentPath(filename)
      const data = readYamlFile(filename)
      sendJson(res, 200, { filename, data })
      return
    }

    if (method === "PUT" && pathname.startsWith("/api/files/")) {
      const filename = decodeURIComponent(pathname.slice("/api/files/".length))
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
      return
    }

    if (method === "POST" && pathname === "/api/validate") {
      const body = await parseJsonBody(req)
      const result = validateExperiencesDocument(body.data ?? body)
      sendJson(res, result.success ? 200 : 400, {
        ok: result.success,
        issues: result.issues,
        data: result.data,
      })
      return
    }

    if (method === "POST" && pathname === "/api/generate") {
      const loaded = loadExperiencesDocument()
      if (!loaded.success || !loaded.data) {
        sendJson(res, 400, { ok: false, issues: loaded.issues })
        return
      }
      const out = writeExperiencesTs(loaded.data)
      sendJson(res, 200, { ok: true, path: out, issues: loaded.issues })
      return
    }

    if (method === "GET" && pathname === "/api/export/linkedin") {
      const loaded = loadExperiencesDocument()
      if (!loaded.success || !loaded.data) {
        sendJson(res, 400, { ok: false, issues: loaded.issues })
        return
      }
      sendJson(res, 200, { text: formatLinkedInExport(loaded.data) })
      return
    }

    if (method === "GET" && pathname === "/api/export/resume") {
      const loaded = loadExperiencesDocument()
      if (!loaded.success || !loaded.data) {
        sendJson(res, 400, { ok: false, issues: loaded.issues })
        return
      }
      sendJson(res, 200, { text: formatResumeExport(loaded.data) })
      return
    }

    if (method === "GET" && pathname === "/api/preview") {
      const loaded = loadExperiencesDocument()
      if (!loaded.success || !loaded.data) {
        sendJson(res, 400, { ok: false, issues: loaded.issues })
        return
      }
      sendJson(res, 200, {
        linkedin: formatLinkedInExport(loaded.data),
        resume: formatResumeExport(loaded.data),
      })
      return
    }

    if (method === "POST" && pathname === "/api/sync") {
      const result = await runCli("sync.ts")
      sendJson(res, result.ok ? 200 : 500, { ok: result.ok, output: result.output })
      return
    }

    sendJson(res, 404, { error: `Not found: ${method} ${pathname}` })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    sendJson(res, 500, { error: message })
  }
}

export function createCareerApiServer(): http.Server {
  return http.createServer((req, res) => {
    void handleCareerApiRequest(req, res)
  })
}

export function startCareerApiServer(port = DEFAULT_PORT): http.Server {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true })
  }

  const server = createCareerApiServer()
  server.listen(port, "127.0.0.1", () => {
    console.log(`Career API listening on http://127.0.0.1:${port}`)
  })
  return server
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain) {
  const port = Number(process.env.CAREER_API_PORT ?? DEFAULT_PORT)
  startCareerApiServer(port)
}
