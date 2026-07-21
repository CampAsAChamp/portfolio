#!/usr/bin/env tsx
import fs from "node:fs"

import { writeExperiencesTs } from "../lib/generate"
import { loadExperiencesDocument } from "../lib/load"
import { EXPERIENCES_OUTPUT } from "../lib/paths"

const result = loadExperiencesDocument()
for (const issue of result.issues.filter((i) => i.severity === "error")) {
  console.error(`ERROR  ${issue.path}: ${issue.message}`)
}

if (!result.success || !result.data) {
  process.exit(1)
}

const before = fs.existsSync(EXPERIENCES_OUTPUT) ? fs.readFileSync(EXPERIENCES_OUTPUT) : null
writeExperiencesTs(result.data)
const after = fs.readFileSync(EXPERIENCES_OUTPUT)

if (before && Buffer.compare(before, after) === 0) {
  console.log("experiences.ts is up to date.")
  process.exit(0)
}

if (before) {
  fs.writeFileSync(EXPERIENCES_OUTPUT, before)
}

console.error(`${EXPERIENCES_OUTPUT} is out of date with career/content/experiences.yaml.\n` + `Run: yarn career:generate`)
process.exit(1)
