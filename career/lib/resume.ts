import { stripMarkdownLinks } from "./markdown"
import type { ExperiencesDocument } from "./schema"

function formatRoleDates(role: ExperiencesDocument["companies"][number]["roles"][number]): string {
  const start = `${role.start.month} ${role.start.year}`
  if (!role.end) {
    return `${start} – Present`
  }
  return `${start} – ${role.end.month} ${role.end.year}`
}

/** Resume-ready markdown (condensed variants) for paste into a Google Doc. */
export function formatResumeExport(doc: ExperiencesDocument): string {
  const sections: string[] = ["# Experience", ""]

  for (const company of doc.companies) {
    const roleBlocks: string[] = []

    for (const role of company.roles) {
      const bullets = role.accomplishments
        .filter((a) => a.destinations.includes("resume") && a.variants.resume?.trim())
        .map((a) => `- ${stripMarkdownLinks(a.variants.resume!.trim())}`)

      if (bullets.length === 0) {
        continue
      }

      roleBlocks.push(`### ${role.position}`, `*${formatRoleDates(role)}*`, "", ...bullets, "")
    }

    if (roleBlocks.length === 0) {
      continue
    }

    sections.push(`## ${company.companyName} — ${company.location}`, "", ...roleBlocks)
  }

  if (sections.length <= 2) {
    return "# Experience\n\nNo resume-tagged accomplishments found.\n"
  }

  return sections.join("\n").trimEnd() + "\n"
}
