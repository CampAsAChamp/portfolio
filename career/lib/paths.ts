import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Repo root (portfolio/). */
export const REPO_ROOT = path.resolve(__dirname, "../..")

/** career/ directory. */
export const CAREER_ROOT = path.resolve(__dirname, "..")

/** YAML content directory. */
export const CONTENT_DIR = path.join(CAREER_ROOT, "content")

/** Generated portfolio experiences file. */
export const EXPERIENCES_OUTPUT = path.join(REPO_ROOT, "src/data/experiences.ts")

/** Primary experiences content file. */
export const EXPERIENCES_YAML = path.join(CONTENT_DIR, "experiences.yaml")

/**
 * Resolve a content file path, ensuring it stays under CONTENT_DIR.
 * @throws if the path escapes CONTENT_DIR
 */
export function resolveContentPath(filename: string): string {
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
