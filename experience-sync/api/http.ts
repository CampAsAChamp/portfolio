import http from "node:http"

export type JsonBody = Record<string, unknown>

/** HTTP methods used by the experience-sync API. */
export const HttpMethod = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  OPTIONS: "OPTIONS",
} as const

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod]

/** Send a JSON response with CORS headers suitable for the local Vite UI. */
export function sendJson(res: http.ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body, null, 2)
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": Object.values(HttpMethod).join(", "),
    "Access-Control-Allow-Headers": "Content-Type",
  })
  res.end(payload)
}

/** Read the raw request body as UTF-8 text. */
function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on("data", (chunk: Buffer) => chunks.push(chunk))
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })
}

/**
 * Parse the request body as JSON.
 * Empty bodies become `{}`.
 */
export async function parseJsonBody(req: http.IncomingMessage): Promise<JsonBody> {
  const raw = await readBody(req)
  if (!raw.trim()) {
    return {}
  }
  return JSON.parse(raw) as JsonBody
}
