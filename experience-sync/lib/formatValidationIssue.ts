import { getCompanyDisplayName } from "experience-sync/lib/companyDisplayName"
import type { Destination, ExperiencesDocument, ValidationIssue } from "experience-sync/lib/schema"

const DESTINATION_LABELS: Record<Destination, string> = {
  portfolio: "Portfolio",
  resume: "Resume",
  linkedin: "LinkedIn",
}

/**
 * Turn a validation issue path into a readable location label
 * (e.g. "Intuit → Staff Engineer → Bullet 4 (Portfolio)").
 */
export function formatValidationIssue(doc: ExperiencesDocument | null | undefined, issue: ValidationIssue): string {
  if (!doc) {
    return issue.message
  }

  const accomplishmentMatch = /^companies\.(\d+)\.roles\.(\d+)\.accomplishments\.(\d+)/.exec(issue.path)
  if (accomplishmentMatch) {
    const companyIdx = Number(accomplishmentMatch[1])
    const roleIdx = Number(accomplishmentMatch[2])
    const accIdx = Number(accomplishmentMatch[3])
    const company = doc.companies[companyIdx]
    const role = company?.roles[roleIdx]
    const companyName = company ? getCompanyDisplayName(company) : `Company ${companyIdx + 1}`
    const roleName = role?.position || `Role ${roleIdx + 1}`
    const bulletLabel = `Bullet ${accIdx + 1}`

    const destMatch = /\.(?:variants|variantSources)\.(\w+)$/.exec(issue.path)
    const dest = destMatch?.[1] as Destination | undefined
    const destLabel = dest ? DESTINATION_LABELS[dest] : undefined

    if (destLabel) {
      return `${companyName} → ${roleName} → ${bulletLabel} (${destLabel}): ${issue.message}`
    }
    return `${companyName} → ${roleName} → ${bulletLabel}: ${issue.message}`
  }

  const roleEndMatch = /^companies\.(\d+)\.roles\.(\d+)\.end$/.exec(issue.path)
  if (roleEndMatch) {
    const companyIdx = Number(roleEndMatch[1])
    const roleIdx = Number(roleEndMatch[2])
    const company = doc.companies[companyIdx]
    const role = company?.roles[roleIdx]
    const companyName = company ? getCompanyDisplayName(company) : `Company ${companyIdx + 1}`
    const roleName = role?.position || `Role ${roleIdx + 1}`
    return `${companyName} → ${roleName}: ${issue.message}`
  }

  const roleMatch = /^companies\.(\d+)\.roles\.(\d+)/.exec(issue.path)
  if (roleMatch) {
    const companyIdx = Number(roleMatch[1])
    const roleIdx = Number(roleMatch[2])
    const company = doc.companies[companyIdx]
    const role = company?.roles[roleIdx]
    const companyName = company ? getCompanyDisplayName(company) : `Company ${companyIdx + 1}`
    const roleName = role?.position || `Role ${roleIdx + 1}`
    return `${companyName} → ${roleName}: ${issue.message}`
  }

  const companyMatch = /^companies\.(\d+)/.exec(issue.path)
  if (companyMatch) {
    const companyIdx = Number(companyMatch[1])
    const company = doc.companies[companyIdx]
    const companyName = company ? getCompanyDisplayName(company) : `Company ${companyIdx + 1}`
    return `${companyName}: ${issue.message}`
  }

  return issue.message
}

/** Short multi-line summary for save/validation toasts. */
export function formatValidationSummary(doc: ExperiencesDocument | null | undefined, issues: ValidationIssue[], maxLines = 3): string {
  const errors = issues.filter((issue) => issue.severity === "error")
  if (errors.length === 0) {
    return "Validation failed"
  }

  const lines = errors.map((issue) => formatValidationIssue(doc, issue))
  if (lines.length === 1) {
    return `Save failed: ${lines[0]}\nYour edits are still in the editor.`
  }

  const head = lines.slice(0, maxLines).join("\n")
  const extra = lines.length > maxLines ? `\n…and ${lines.length - maxLines} more` : ""
  return `Save failed (${lines.length} issues). Your edits are still in the editor.\n${head}${extra}`
}
