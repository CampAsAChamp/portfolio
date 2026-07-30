import { resolveDocument, type ResolvedCompany, type ResolvedExperienceRole } from "experience-sync/lib/resolve"
import type { ExperiencesDocument } from "experience-sync/lib/schema"

/** One role's structured preview fields (avoids re-parsing export text in the UI). */
export interface ExportRolePreview {
  position: string
  dates: string
  /** LinkedIn-only second line (`Company · Location`). */
  metaLine?: string
  /** Export-formatted bullet lines (`• …` or `- …`). */
  bullets: string[]
}

/** One company's LinkedIn/resume export text for preview panes. */
export interface CompanyExportBlock {
  companyName: string
  location: string
  text: string
  roles: ExportRolePreview[]
}

/** Format a role's date range for LinkedIn (e.g. `Jan 2020 - Present`). */
function formatRoleDates(role: ResolvedExperienceRole): string {
  const start = `${role.start.month} ${role.start.year}`
  if (!role.end) {
    return `${start} - Present`
  }
  return `${start} - ${role.end.month} ${role.end.year}`
}

function buildLinkedInRolePreview(company: ResolvedCompany, role: ResolvedExperienceRole): ExportRolePreview | null {
  const bullets = role.accomplishments
    .filter((a) => a.destinations.includes("linkedin") && a.variants.linkedin?.trim())
    .map((a) => `• ${a.variants.linkedin!.trim()}`)

  if (bullets.length === 0) {
    return null
  }

  return {
    position: role.position,
    metaLine: `${company.companyName} · ${company.location}`,
    dates: formatRoleDates(role),
    bullets,
  }
}

function formatLinkedInRoleText(role: ExportRolePreview): string {
  const lines = [role.position, role.metaLine!, role.dates, "", ...role.bullets]
  return lines.join("\n")
}

/** LinkedIn export text grouped by company (for preview UI separators). */
export function formatLinkedInExportBlocks(doc: ExperiencesDocument): CompanyExportBlock[] {
  const resolved = resolveDocument(doc)
  const blocks: CompanyExportBlock[] = []

  for (const company of resolved.companies) {
    const roles = company.roles
      .map((role) => buildLinkedInRolePreview(company, role))
      .filter((role): role is ExportRolePreview => role != null)

    if (roles.length === 0) {
      continue
    }

    blocks.push({
      companyName: company.companyName,
      location: company.location,
      roles,
      text: roles.map((role) => formatLinkedInRoleText(role)).join("\n\n"),
    })
  }

  return blocks
}

/**
 * Build LinkedIn-ready plain text for experience sections.
 * Includes only accomplishments tagged `linkedin`; preserves markdown links.
 */
export function formatLinkedInExport(doc: ExperiencesDocument): string {
  const blocks = formatLinkedInExportBlocks(doc)

  if (blocks.length === 0) {
    return "No LinkedIn-tagged accomplishments found.\n"
  }

  // Blank line between roles so pasted blocks stay visually separated.
  return blocks.map((block) => block.text).join("\n\n") + "\n"
}
