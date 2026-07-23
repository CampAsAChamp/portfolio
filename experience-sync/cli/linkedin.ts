#!/usr/bin/env tsx
import { copyToClipboard, hasFlag, isCliEntry, requireExperiencesDocument } from "experience-sync/cli/shared"
import { formatLinkedInExport } from "experience-sync/lib/linkedin"

export interface LinkedInCliOptions {
  copy?: boolean
}

/** Parse `--copy` from CLI argv for the LinkedIn export command. */
export function parseLinkedInOptions(argv: string[]): LinkedInCliOptions {
  return { copy: hasFlag(argv, "--copy") }
}

/** Print LinkedIn-ready experience text, or copy it with `--copy`. */
export function runLinkedIn(options: LinkedInCliOptions = {}): void {
  const doc = requireExperiencesDocument({ errorsOnly: true })
  const text = formatLinkedInExport(doc)

  if (!options.copy) {
    process.stdout.write(text)
    return
  }

  if (copyToClipboard(text)) {
    console.log("LinkedIn export copied to clipboard.")
    return
  }

  console.error("Failed to copy to clipboard (pbcopy). Printing instead:\n")
  process.stdout.write(text)
  process.exit(1)
}

if (isCliEntry(import.meta.url)) {
  runLinkedIn(parseLinkedInOptions(process.argv.slice(2)))
}
