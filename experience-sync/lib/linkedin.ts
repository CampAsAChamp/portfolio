import { stripMarkdownLinks } from "experience-sync/lib/markdown"
import type { ExperienceRole, ExperiencesDocument } from "experience-sync/lib/schema"

/** Format a role's date range for LinkedIn (e.g. `Jan 2020 - Present`). */
function formatRoleDates(role: ExperienceRole): string {
  const start = `${role.start.month} ${role.start.year}`
  if (!role.end) {
    return `${start} - Present`
  }
  return `${start} - ${role.end.month} ${role.end.year}`
}

/**
 * Build LinkedIn-ready plain text for experience sections.
 * Includes only accomplishments tagged `linkedin`; strips markdown links.
 */
export function formatLinkedInExport(doc: ExperiencesDocument): string {
  const blocks: string[] = []

  for (const company of doc.companies) {
    for (const role of company.roles) {
      const bullets = role.accomplishments
        .filter((a) => a.destinations.includes("linkedin") && a.variants.linkedin?.trim())
        .map((a) => `• ${stripMarkdownLinks(a.variants.linkedin!.trim())}`)

      if (bullets.length === 0) {
        continue
      }

      const lines = [
        role.position,
        `${company.companyName} · ${company.location}`,
        formatRoleDates(role),
        "", // blank line before bullets
        ...bullets,
      ]
      blocks.push(lines.join("\n"))
    }
  }

  if (blocks.length === 0) {
    return "No LinkedIn-tagged accomplishments found.\n"
  }

  // Blank line between roles so pasted blocks stay visually separated.
  return blocks.join("\n\n") + "\n"
}
