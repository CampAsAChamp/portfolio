#!/usr/bin/env tsx
import { writeExperiencesTs } from "../lib/generate"
import { loadExperiencesDocument } from "../lib/load"

function printIssues(issues: { path: string; message: string; severity: "error" | "warning" }[]): void {
  for (const issue of issues) {
    const tag = issue.severity === "error" ? "ERROR" : "WARN "
    console.error(`${tag}  ${issue.path}: ${issue.message}`)
  }
}

const result = loadExperiencesDocument()
printIssues(result.issues)

if (!result.success || !result.data) {
  console.error("\nGeneration aborted due to validation errors.")
  process.exit(1)
}

const out = writeExperiencesTs(result.data)
console.log(`Wrote ${out}`)
