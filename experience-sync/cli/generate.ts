#!/usr/bin/env tsx
import { writeExperiencesTs } from "experience-sync/lib/generate"

import { isCliEntry, requireExperiencesDocument } from "experience-sync/cli/shared"

/** Generate `src/data/experiences.ts` from the YAML source of truth. */
export function runGenerate(): void {
  const doc = requireExperiencesDocument({
    abortMessage: "Generation aborted due to validation errors.",
  })
  const out = writeExperiencesTs(doc)
  console.log(`Wrote ${out}`)
}

if (isCliEntry(import.meta.url)) {
  runGenerate()
}
