import type { CompanyExportBlock, ExportRolePreview } from "experience-sync/lib/linkedin"
import { stripMarkdownLinks } from "experience-sync/lib/markdown"
import { resolveDocument, type ResolvedCompany, type ResolvedExperienceRole } from "experience-sync/lib/resolve"
import type { ExperiencesDocument } from "experience-sync/lib/schema"

/** Format a role's date range for resume markdown (e.g. `Jan 2020 - Present`). */
function formatRoleDates(role: ResolvedExperienceRole): string {
  const start = `${role.start.month} ${role.start.year}`
  if (!role.end) {
    return `${start} - Present`
  }
  return `${start} - ${role.end.month} ${role.end.year}`
}

function buildResumeRolePreview(role: ResolvedExperienceRole): ExportRolePreview | null {
  const bullets = role.accomplishments
    .filter((a) => a.destinations.includes("resume") && a.variants.resume?.trim())
    .map((a) => `- ${stripMarkdownLinks(a.variants.resume!.trim())}`)

  if (bullets.length === 0) {
    return null
  }

  return {
    position: role.position,
    dates: formatRoleDates(role),
    bullets,
  }
}

function formatResumeRoleText(role: ExportRolePreview): string {
  return [`### ${role.position}`, `*${role.dates}*`, "", ...role.bullets, ""].join("\n")
}

function formatResumeCompanyBlock(company: ResolvedCompany): CompanyExportBlock | null {
  const roles = company.roles.map((role) => buildResumeRolePreview(role)).filter((role): role is ExportRolePreview => role != null)

  if (roles.length === 0) {
    return null
  }

  const roleBlocks = roles.map((role) => formatResumeRoleText(role))

  return {
    companyName: company.companyName,
    location: company.location,
    roles,
    text: [`## ${company.companyName} — ${company.location}`, "", ...roleBlocks].join("\n"),
  }
}

/** Resume export text grouped by company (for preview UI separators). */
export function formatResumeExportBlocks(doc: ExperiencesDocument): CompanyExportBlock[] {
  const resolved = resolveDocument(doc)
  const blocks: CompanyExportBlock[] = []

  for (const company of resolved.companies) {
    const block = formatResumeCompanyBlock(company)
    if (block) {
      blocks.push(block)
    }
  }

  return blocks
}

/**
 * Build resume-ready markdown (condensed variants) for paste into a Google Doc.
 * Includes only accomplishments tagged `resume`; strips markdown links.
 */
export function formatResumeExport(doc: ExperiencesDocument): string {
  const blocks = formatResumeExportBlocks(doc)

  if (blocks.length === 0) {
    return "# Experience\n\nNo resume-tagged accomplishments found.\n"
  }

  return ["# Experience", "", ...blocks.map((block) => block.text)].join("\n").trimEnd() + "\n"
}
