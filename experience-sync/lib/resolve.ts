import type { Accomplishment, Company, Destination, ExperienceRole, ExperiencesDocument, Variants } from "experience-sync/lib/schema";





/** Accomplishment with all variant-source aliases resolved to inline text. */
export interface ResolvedAccomplishment {
  id: string
  destinations: Destination[]
  variants: Variants
}

export interface ResolvedExperienceRole extends Omit<ExperienceRole, "accomplishments"> {
  accomplishments: ResolvedAccomplishment[]
}

export interface ResolvedCompany extends Omit<Company, "roles"> {
  roles: ResolvedExperienceRole[]
}

/** Document tree with resolved variant text for export consumers. */
export interface ResolvedExperiencesDocument {
  companies: ResolvedCompany[]
}

/** Resolve one destination's text, following variantSources aliases (cycle-safe). */
export function resolveDestinationText(accomplishment: Accomplishment, dest: Destination, visited = new Set<Destination>()): string {
  if (visited.has(dest)) return ""
  visited.add(dest)

  const sourceDest = accomplishment.variantSources?.[dest]
  if (sourceDest) {
    return resolveDestinationText(accomplishment, sourceDest, visited)
  }

  return accomplishment.variants[dest] ?? ""
}

/** Resolve one accomplishment's per-destination text from custom variants or aliases. */
export function resolveAccomplishment(accomplishment: Accomplishment): ResolvedAccomplishment {
  const resolvedVariants: Variants = {}

  for (const dest of accomplishment.destinations) {
    resolvedVariants[dest] = resolveDestinationText(accomplishment, dest)
  }

  return {
    id: accomplishment.id,
    destinations: accomplishment.destinations,
    variants: resolvedVariants,
  }
}

export function resolveRole(role: ExperienceRole): ResolvedExperienceRole {
  return {
    ...role,
    accomplishments: role.accomplishments.map((a) => resolveAccomplishment(a)),
  }
}

export function resolveCompany(company: Company): ResolvedCompany {
  return {
    ...company,
    roles: company.roles.map((r) => resolveRole(r)),
  }
}

/** Resolve the full document for portfolio, LinkedIn, and resume exporters. */
export function resolveDocument(doc: ExperiencesDocument): ResolvedExperiencesDocument {
  return {
    companies: doc.companies.map((c) => resolveCompany(c)),
  }
}
