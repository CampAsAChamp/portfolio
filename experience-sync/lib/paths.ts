import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Repo root (portfolio/). */
export const REPO_ROOT = path.resolve(__dirname, "../..")

/** experience-sync/ directory. */
export const EXPERIENCE_SYNC_ROOT = path.resolve(__dirname, "..")

/** YAML content directory. */
export const CONTENT_DIR = path.join(EXPERIENCE_SYNC_ROOT, "content")

/** Generated portfolio experiences file. */
export const EXPERIENCES_OUTPUT = path.join(REPO_ROOT, "src/data/experiences.ts")

/** Primary experiences content file. */
export const EXPERIENCES_YAML = path.join(CONTENT_DIR, "experiences.yaml")

/** Template for generated `src/data/experiences.ts`. */
export const EXPERIENCES_TS_TEMPLATE = path.join(EXPERIENCE_SYNC_ROOT, "templates/experiences.ts.template")

/**
 * Map a bare YAML filename to an absolute path under CONTENT_DIR.
 * @throws if the filename is invalid or would escape CONTENT_DIR
 */
export function contentFilePath(filename: string): string {
  const base = path.basename(filename)
  if (base !== filename || filename.includes("..") || path.isAbsolute(filename)) {
    throw new Error(`Invalid content filename: ${filename}`)
  }
  if (!base.endsWith(".yaml") && !base.endsWith(".yml")) {
    throw new Error(`Content file must be .yaml or .yml: ${filename}`)
  }
  const resolved = path.resolve(CONTENT_DIR, base)
  if (!resolved.startsWith(CONTENT_DIR + path.sep) && resolved !== CONTENT_DIR) {
    throw new Error(`Path escapes content directory: ${filename}`)
  }
  return resolved
}
