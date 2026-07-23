#!/usr/bin/env tsx
import fs from "node:fs"
import { isCliEntry, requireExperiencesDocument } from "experience-sync/cli/shared"
import { writeExperiencesTs } from "experience-sync/lib/generate"
import { EXPERIENCES_OUTPUT } from "experience-sync/lib/paths"

/**
 * Fail if `src/data/experiences.ts` is missing or differs from what the YAML would generate.
 * Restores the previous file contents when they differ so the check is non-mutating.
 */
export function runCheck(): void {
  const doc = requireExperiencesDocument({ errorsOnly: true })

  const before = fs.existsSync(EXPERIENCES_OUTPUT) ? fs.readFileSync(EXPERIENCES_OUTPUT) : null
  writeExperiencesTs(doc)
  const after = fs.readFileSync(EXPERIENCES_OUTPUT)

  if (before && Buffer.compare(before, after) === 0) {
    console.log("experiences.ts is up to date.")
    return
  }

  if (before) {
    fs.writeFileSync(EXPERIENCES_OUTPUT, before)
  }

  console.error(`${EXPERIENCES_OUTPUT} is out of date with experience-sync/content/experiences.yaml.\n` + `Run: yarn exp:generate`)
  process.exit(1)
}

if (isCliEntry(import.meta.url)) {
  runCheck()
}
