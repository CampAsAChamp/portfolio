import fs from "node:fs"
import path from "node:path"
import { parse as parseYaml, stringify as stringifyYaml } from "yaml"

import { CONTENT_DIR, EXPERIENCES_YAML, resolveContentPath } from "./paths"
import { validateExperiencesDocument, type ExperiencesDocument, type ValidationIssue } from "./schema"

export function listContentFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return []
  }
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .sort()
}

export function readYamlFile(filename: string): unknown {
  const filePath = resolveContentPath(filename)
  const raw = fs.readFileSync(filePath, "utf8")
  return parseYaml(raw)
}

export function writeYamlFile(filename: string, data: unknown): void {
  const filePath = resolveContentPath(filename)
  const yaml = stringifyYaml(data, {
    lineWidth: 100,
    defaultKeyType: "PLAIN",
  })
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, yaml.endsWith("\n") ? yaml : `${yaml}\n`, "utf8")
}

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
