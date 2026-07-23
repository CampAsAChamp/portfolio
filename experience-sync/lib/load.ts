import fs from "node:fs"
import path from "node:path"
import { CONTENT_DIR, contentFilePath, EXPERIENCES_YAML } from "experience-sync/lib/paths"
import { validateExperiencesDocument, type ExperiencesDocument, type ValidationIssue } from "experience-sync/lib/schema"
import { parse as parseYaml, stringify as stringifyYaml } from "yaml"

/** List YAML filenames under `experience-sync/content` (sorted). */
export function listContentFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return []
  }
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .sort()
}

/**
 * Parse a content YAML file by basename.
 * Path-safe via {@link contentFilePath}.
 */
export function readYamlFile(filename: string): unknown {
  const filePath = contentFilePath(filename)
  const raw = fs.readFileSync(filePath, "utf8")
  return parseYaml(raw)
}

/**
 * Serialize `data` to YAML and write under `content/`.
 * Creates parent directories as needed; always ends the file with a newline.
 */
export function writeYamlFile(filename: string, data: unknown): void {
  const filePath = contentFilePath(filename)
  const yaml = stringifyYaml(data, {
    lineWidth: 100,
    defaultKeyType: "PLAIN",
  })
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, yaml.endsWith("\n") ? yaml : `${yaml}\n`, "utf8")
}

/**
 * Read and validate `experiences.yaml`.
 * Returns `success: false` with issues when the file is missing or invalid.
 */
export function loadExperiencesDocument(): {
  success: boolean
  data?: ExperiencesDocument
  issues: ValidationIssue[]
} {
  if (!fs.existsSync(EXPERIENCES_YAML)) {
    return {
      success: false,
      issues: [
        {
          path: "experiences.yaml",
          message: `Missing content file: ${EXPERIENCES_YAML}`,
          severity: "error",
        },
      ],
    }
  }
  const raw = readYamlFile("experiences.yaml")
  return validateExperiencesDocument(raw)
}

/**
 * Validate then persist experiences to `experiences.yaml`.
 * Does not write when validation fails.
 */
export function saveExperiencesDocument(data: unknown): {
  success: boolean
  data?: ExperiencesDocument
  issues: ValidationIssue[]
} {
  const result = validateExperiencesDocument(data)
  if (!result.success || !result.data) {
    return result
  }
  writeYamlFile("experiences.yaml", result.data)
  return result
}
