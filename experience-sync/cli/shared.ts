import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

import { loadExperiencesDocument } from "experience-sync/lib/load"
import type { ExperiencesDocument, ValidationIssue } from "experience-sync/lib/schema"

/** True when this module was launched directly via `tsx …/cli/<file>.ts`. */
export function isCliEntry(importMetaUrl: string): boolean {
  const entry = process.argv[1]
  if (!entry) {
    return false
  }
  return fileURLToPath(importMetaUrl) === path.resolve(entry)
}

/** True when `argv` contains the given flag (e.g. `--copy`). */
export function hasFlag(argv: string[], flag: string): boolean {
  return argv.includes(flag)
}

/** Value after `--flag`, or `undefined` if the flag is missing / has no value. */
export function flagValue(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag)
  if (index < 0) {
    return undefined
  }
  return argv[index + 1]
}

/**
 * Print validation issues to stderr (`ERROR` / `WARN`).
 * Pass `errorsOnly` to skip warnings.
 */
export function printIssues(issues: ValidationIssue[], options?: { errorsOnly?: boolean }): void {
  const filtered = options?.errorsOnly ? issues.filter((issue) => issue.severity === "error") : issues

  for (const issue of filtered) {
    const tag = issue.severity === "error" ? "ERROR" : "WARN "
    console.error(`${tag}  ${issue.path}: ${issue.message}`)
  }
}

/**
 * Load and validate experiences.yaml. Prints issues and exits on failure.
 * Returns the document when validation succeeds.
 */
export function requireExperiencesDocument(options?: { errorsOnly?: boolean; abortMessage?: string }): ExperiencesDocument {
  const result = loadExperiencesDocument()
  printIssues(result.issues, { errorsOnly: options?.errorsOnly })

  if (!result.success || !result.data) {
    if (options?.abortMessage) {
      console.error(`\n${options.abortMessage}`)
    }
    process.exit(1)
  }

  return result.data
}

/** Copy text to the macOS clipboard via `pbcopy`. Returns false on failure. */
export function copyToClipboard(text: string): boolean {
  const proc = spawnSync("pbcopy", [], { input: text, encoding: "utf8" })
  return !proc.error && proc.status === 0
}
