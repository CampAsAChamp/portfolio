#!/usr/bin/env tsx
import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

import { loadExperiencesDocument } from "../lib/load"
import { CAREER_ROOT } from "../lib/paths"
import { formatResumeExport } from "../lib/resume"

const copy = process.argv.includes("--copy")
const outIdx = process.argv.indexOf("--out")
const outPath =
  outIdx >= 0 && process.argv[outIdx + 1] ? path.resolve(process.argv[outIdx + 1]!) : path.join(CAREER_ROOT, "exports/resume.md")

const result = loadExperiencesDocument()
for (const issue of result.issues.filter((i) => i.severity === "error")) {
  console.error(`ERROR  ${issue.path}: ${issue.message}`)
}

if (!result.success || !result.data) {
  process.exit(1)
}

const text = formatResumeExport(result.data)

if (copy) {
  const proc = spawnSync("pbcopy", [], { input: text, encoding: "utf8" })
  if (proc.error || proc.status !== 0) {
    console.error("Failed to copy to clipboard (pbcopy). Writing file instead.")
  } else {
    console.log("Resume export copied to clipboard.")
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true })
fs.writeFileSync(outPath, text, "utf8")
console.log(`Wrote ${outPath}`)
