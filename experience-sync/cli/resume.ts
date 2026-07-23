#!/usr/bin/env tsx
import fs from "node:fs"
import path from "node:path"

import { EXPERIENCE_SYNC_ROOT } from "experience-sync/lib/paths"
import { formatResumeExport } from "experience-sync/lib/resume"

import { copyToClipboard, flagValue, hasFlag, isCliEntry, requireExperiencesDocument } from "experience-sync/cli/shared"

const DEFAULT_OUT_PATH = path.join(EXPERIENCE_SYNC_ROOT, "exports/resume.md")

export interface ResumeCliOptions {
  copy?: boolean
  outPath?: string
}

/**
 * Parse `--copy` and `--out <path>` for the resume export command.
 * Defaults `outPath` to `experience-sync/exports/resume.md`.
 */
export function parseResumeOptions(argv: string[]): ResumeCliOptions {
  const out = flagValue(argv, "--out")
  return {
    copy: hasFlag(argv, "--copy"),
    outPath: out ? path.resolve(out) : DEFAULT_OUT_PATH,
  }
}

/** Write resume markdown (and optionally copy it with `--copy`). */
export function runResume(options: ResumeCliOptions = {}): void {
  const outPath = options.outPath ?? DEFAULT_OUT_PATH
  const doc = requireExperiencesDocument({ errorsOnly: true })
  const text = formatResumeExport(doc)

  if (options.copy) {
    if (copyToClipboard(text)) {
      console.log("Resume export copied to clipboard.")
    } else {
      console.error("Failed to copy to clipboard (pbcopy). Writing file instead.")
    }
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, text, "utf8")
  console.log(`Wrote ${outPath}`)
}

if (isCliEntry(import.meta.url)) {
  runResume(parseResumeOptions(process.argv.slice(2)))
}
