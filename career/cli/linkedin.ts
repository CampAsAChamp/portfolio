#!/usr/bin/env tsx
import { spawnSync } from "node:child_process"

import { formatLinkedInExport } from "../lib/linkedin"
import { loadExperiencesDocument } from "../lib/load"

const copy = process.argv.includes("--copy")

const result = loadExperiencesDocument()
for (const issue of result.issues.filter((i) => i.severity === "error")) {
  console.error(`ERROR  ${issue.path}: ${issue.message}`)
}

if (!result.success || !result.data) {
  process.exit(1)
}

const text = formatLinkedInExport(result.data)

if (copy) {
  const proc = spawnSync("pbcopy", [], { input: text, encoding: "utf8" })
  if (proc.error || proc.status !== 0) {
    console.error("Failed to copy to clipboard (pbcopy). Printing instead:\n")
    process.stdout.write(text)
    process.exit(1)
  }
  console.log("LinkedIn export copied to clipboard.")
} else {
  process.stdout.write(text)
}
