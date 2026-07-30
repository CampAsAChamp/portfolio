import { expandDocumentDefaults } from "experience-sync/lib/accomplishmentDefaults"
import { resolveAccomplishment } from "experience-sync/lib/resolve"
import { z } from "zod"

export const DESTINATIONS = ["portfolio", "resume", "linkedin"] as const
export type Destination = (typeof DESTINATIONS)[number]

export const MONTH_ABBREVS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"] as const

export const destinationSchema = z.enum(DESTINATIONS)

export const roleDateSchema = z.object({
  month: z.enum(MONTH_ABBREVS),
  year: z.number().int().min(1970).max(2100),
})

export const variantsSchema = z
  .object({
    portfolio: z.string().optional(),
    resume: z.string().optional(),
    linkedin: z.string().optional(),
  })
  .strict()

export const variantSourcesSchema = z
  .object({
    portfolio: destinationSchema.optional(),
    resume: destinationSchema.optional(),
    linkedin: destinationSchema.optional(),
  })
  .strict()

export const accomplishmentSchema = z.object({
  id: z.string().min(1),
  destinations: z.array(destinationSchema).min(1),
  /** Per-destination alias to another destination's variant text on this accomplishment. */
  variantSources: variantSourcesSchema.optional(),
  variants: variantsSchema,
})

export const roleSchema = z.object({
  id: z.string().min(1),
  position: z.string().min(1),
  start: roleDateSchema,
  end: roleDateSchema.optional(),
  accomplishments: z.array(accomplishmentSchema),
})

export const companySchema = z.object({
  id: z.string().min(1),
  companyName: z.string().min(1),
  /** Optional short label for the editor sidebar (exports use companyName). */
  nickname: z.string().min(1).optional(),
  location: z.string().min(1),
  /** Key into COLORS (e.g. INTUIT). */
  colorKey: z.string().min(1),
  /** Filename under assets/Company_Logos/ without path (e.g. Intuit.svg). */
  logoFile: z.string().min(1),
  /** Exported names from data/technologies (e.g. JAVA, REACT). */
  technologies: z.array(z.string().min(1)),
  roles: z.array(roleSchema).min(1),
})

export const experiencesDocumentSchema = z.object({
  companies: z.array(companySchema).min(1),
})

export type RoleDate = z.infer<typeof roleDateSchema>
export type Variants = z.infer<typeof variantsSchema>
export type VariantSources = z.infer<typeof variantSourcesSchema>
export type Accomplishment = z.infer<typeof accomplishmentSchema>
export type ExperienceRole = z.infer<typeof roleSchema>
export type Company = z.infer<typeof companySchema>
export type ExperiencesDocument = z.infer<typeof experiencesDocumentSchema>

export interface ValidationIssue {
  path: string
  message: string
  severity: "error" | "warning"
}

/** Numeric order for a role date (higher = more recent). */
function roleDateOrder({ month, year }: RoleDate): number {
  return year * 12 + MONTH_ABBREVS.indexOf(month)
}

/** Returns an error message when end is before start; same month is allowed. */
export function getRoleEndBeforeStartMessage(start: RoleDate, end: RoleDate): string | null {
  if (roleDateOrder(end) < roleDateOrder(start)) {
    return `End date (${end.month} ${end.year}) must be on or after start date (${start.month} ${start.year})`
  }
  return null
}

function zodIssuesToValidationIssues(zodIssues: z.ZodIssue[]): ValidationIssue[] {
  return zodIssues.map((issue) => ({
    path: issue.path.join(".") || "(root)",
    message: issue.message,
    severity: "error" as const,
  }))
}

function collectDuplicateIdIssue(
  id: string,
  seen: Set<string>,
  path: string,
  kind: "company" | "role" | "accomplishment",
): ValidationIssue | null {
  if (seen.has(id)) {
    return {
      path,
      message: `Duplicate ${kind} id "${id}"`,
      severity: "error",
    }
  }
  seen.add(id)
  return null
}

function hasNonEmptyVariantText(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0
}

function hasVariantSourceCycle(sources: VariantSources, start: Destination): boolean {
  const visited = new Set<Destination>()
  let current: Destination | undefined = start
  while (current) {
    if (visited.has(current)) return true
    visited.add(current)
    current = sources[current]
  }
  return false
}

function collectRoleDateIssues(role: ExperienceRole, rolePath: string): ValidationIssue[] {
  if (!role.end) return []
  const dateMessage = getRoleEndBeforeStartMessage(role.start, role.end)
  if (!dateMessage) return []
  return [
    {
      path: `${rolePath}.end`,
      message: dateMessage,
      severity: "error",
    },
  ]
}

function collectVariantDestinationIssues(accomplishment: Accomplishment, basePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const destSet = new Set(accomplishment.destinations)
  const sources = accomplishment.variantSources ?? {}

  for (const dest of DESTINATIONS) {
    const inlineVariant = accomplishment.variants[dest]
    const hasInline = hasNonEmptyVariantText(inlineVariant)
    const selected = destSet.has(dest)
    const sourceDest = sources[dest]
    const inlinePath = `${basePath}.variants.${dest}`
    const sourcePath = `${basePath}.variantSources.${dest}`

    if (sourceDest) {
      if (sourceDest === dest) {
        issues.push({
          path: sourcePath,
          message: `Destination "${dest}" cannot alias itself`,
          severity: "error",
        })
      } else if (!destSet.has(sourceDest)) {
        issues.push({
          path: sourcePath,
          message: `Variant source "${sourceDest}" is not a selected destination`,
          severity: "error",
        })
      } else if (hasVariantSourceCycle(sources, dest)) {
        issues.push({
          path: sourcePath,
          message: `Variant source for "${dest}" creates a cycle`,
          severity: "error",
        })
      }

      if (hasInline) {
        issues.push({
          path: inlinePath,
          message: `Inline variant ignored because destination "${dest}" uses text from "${sourceDest}"`,
          severity: "warning",
        })
      }
    }

    if (!selected && hasInline) {
      issues.push({
        path: inlinePath,
        message: `Variant "${dest}" is set but destination is not selected`,
        severity: "warning",
      })
    }

    if (!selected && sourceDest) {
      issues.push({
        path: sourcePath,
        message: `Variant source "${dest}" is set but destination is not selected`,
        severity: "warning",
      })
    }
  }

  const resolved = resolveAccomplishment(accomplishment)

  for (const dest of accomplishment.destinations) {
    const sourceDest = sources[dest]
    // Aliased destinations inherit text from their source; report once on the root variant.
    if (sourceDest) {
      continue
    }
    const hasResolvedText = hasNonEmptyVariantText(resolved.variants[dest])
    if (!hasResolvedText) {
      issues.push({
        path: `${basePath}.variants.${dest}`,
        message: "This bullet has no text",
        severity: "error",
      })
    }
  }

  return issues
}

function collectSemanticIssues(doc: ExperiencesDocument): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const seenCompanyIds = new Set<string>()
  const seenRoleIds = new Set<string>()
  const seenAccomplishmentIds = new Set<string>()

  for (const [ci, company] of doc.companies.entries()) {
    const companyDup = collectDuplicateIdIssue(company.id, seenCompanyIds, `companies.${ci}.id`, "company")
    if (companyDup) issues.push(companyDup)

    for (const [ri, role] of company.roles.entries()) {
      const rolePath = `companies.${ci}.roles.${ri}`
      const roleDup = collectDuplicateIdIssue(role.id, seenRoleIds, `${rolePath}.id`, "role")
      if (roleDup) issues.push(roleDup)

      issues.push(...collectRoleDateIssues(role, rolePath))

      for (const [ai, accomplishment] of role.accomplishments.entries()) {
        const base = `${rolePath}.accomplishments.${ai}`
        const accomplishmentDup = collectDuplicateIdIssue(accomplishment.id, seenAccomplishmentIds, `${base}.id`, "accomplishment")
        if (accomplishmentDup) issues.push(accomplishmentDup)

        issues.push(...collectVariantDestinationIssues(accomplishment, base))
      }
    }
  }

  return issues
}

/**
 * Structural Zod parse plus destination/variant consistency rules.
 * Missing variant for a selected destination → error.
 * Orphan variant (present but destination not selected) → warning.
 * Role end before start → error (same month is allowed).
 */
export function validateExperiencesDocument(data: unknown): {
  success: boolean
  data?: ExperiencesDocument
  issues: ValidationIssue[]
} {
  const parsed = experiencesDocumentSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, issues: zodIssuesToValidationIssues(parsed.error.issues) }
  }

  const doc = expandDocumentDefaults(parsed.data)
  const issues = collectSemanticIssues(doc)
  const hasErrors = issues.some((i) => i.severity === "error")

  return {
    success: !hasErrors,
    data: hasErrors ? undefined : doc,
    issues,
  }
}
