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

export const accomplishmentSchema = z.object({
  id: z.string().min(1),
  destinations: z.array(destinationSchema).min(1),
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
  const issues: ValidationIssue[] = []

  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      issues.push({
        path: issue.path.join(".") || "(root)",
        message: issue.message,
        severity: "error",
      })
    }
    return { success: false, issues }
  }

  const doc = parsed.data
  const seenCompanyIds = new Set<string>()
  const seenRoleIds = new Set<string>()
  const seenAccomplishmentIds = new Set<string>()

  for (const [ci, company] of doc.companies.entries()) {
    if (seenCompanyIds.has(company.id)) {
      issues.push({
        path: `companies.${ci}.id`,
        message: `Duplicate company id "${company.id}"`,
        severity: "error",
      })
    }
    seenCompanyIds.add(company.id)

    for (const [ri, role] of company.roles.entries()) {
      const rolePath = `companies.${ci}.roles.${ri}`
      if (seenRoleIds.has(role.id)) {
        issues.push({
          path: `${rolePath}.id`,
          message: `Duplicate role id "${role.id}"`,
          severity: "error",
        })
      }
      seenRoleIds.add(role.id)

      if (role.end) {
        const dateMessage = getRoleEndBeforeStartMessage(role.start, role.end)
        if (dateMessage) {
          issues.push({
            path: `${rolePath}.end`,
            message: dateMessage,
            severity: "error",
          })
        }
      }

      for (const [ai, accomplishment] of role.accomplishments.entries()) {
        const base = `companies.${ci}.roles.${ri}.accomplishments.${ai}`
        if (seenAccomplishmentIds.has(accomplishment.id)) {
          issues.push({
            path: `${base}.id`,
            message: `Duplicate accomplishment id "${accomplishment.id}"`,
            severity: "error",
          })
        }
        seenAccomplishmentIds.add(accomplishment.id)

        const destSet = new Set(accomplishment.destinations)
        for (const dest of DESTINATIONS) {
          const variant = accomplishment.variants[dest]
          const hasVariant = typeof variant === "string" && variant.trim().length > 0
          const selected = destSet.has(dest)

          if (selected && !hasVariant) {
            issues.push({
              path: `${base}.variants.${dest}`,
              message: `Destination "${dest}" is selected but has no variant text`,
              severity: "error",
            })
          }
          if (!selected && hasVariant) {
            issues.push({
              path: `${base}.variants.${dest}`,
              message: `Variant "${dest}" is set but destination is not selected`,
              severity: "warning",
            })
          }
        }
      }
    }
  }

  const hasErrors = issues.some((i) => i.severity === "error")
  return {
    success: !hasErrors,
    data: hasErrors ? undefined : doc,
    issues,
  }
}
