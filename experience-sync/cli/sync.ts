#!/usr/bin/env tsx
import { runGenerate } from "experience-sync/cli/generate"
import { runLinkedIn } from "experience-sync/cli/linkedin"
import { runResume } from "experience-sync/cli/resume"
import { isCliEntry } from "experience-sync/cli/shared"

/** Generate portfolio TS, print LinkedIn export, and write resume markdown. */
export function runSync(): void {
  runGenerate()
  runLinkedIn()
  runResume()
  console.log("\nSync complete.")
}

if (isCliEntry(import.meta.url)) {
  runSync()
}
