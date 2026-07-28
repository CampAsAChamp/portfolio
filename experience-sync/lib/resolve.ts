import type {
  Accomplishment,
  Company,
  Destination,
  ExperienceRole,
  ExperiencesDocument,
  SharedVariant,
  Variants,
} from "experience-sync/lib/schema"

/** Accomplishment with all shared-variant refs resolved to inline text. */
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

/** Index shared variants by id for O(1) lookup during resolution and validation. */
export function buildSharedVariantIndex(doc: ExperiencesDocument): Map<string, SharedVariant> {
  const index = new Map<string, SharedVariant>()
  for (const shared of doc.sharedVariants ?? []) {
    index.set(shared.id, shared)
  }
  return index
}

/** Resolve one accomplishment's per-destination text from shared refs or inline variants. */
export function resolveAccomplishment(
  accomplishment: Accomplishment,
  sharedVariantsById: Map<string, SharedVariant>,
): ResolvedAccomplishment {
  const resolvedVariants: Variants = {}
  const sharedRefs = accomplishment.sharedVariants ?? {}

  for (const dest of accomplishment.destinations) {
    const refId = sharedRefs[dest]
    if (refId) {
      const shared = sharedVariantsById.get(refId)
      resolvedVariants[dest] = shared?.variants[dest] ?? ""
    } else {
      resolvedVariants[dest] = accomplishment.variants[dest] ?? ""
    }
  }

  return {
    id: accomplishment.id,
    destinations: accomplishment.destinations,
    variants: resolvedVariants,
  }
}

export function resolveRole(role: ExperienceRole, sharedVariantsById: Map<string, SharedVariant>): ResolvedExperienceRole {
  return {
    ...role,
    accomplishments: role.accomplishments.map((a) => resolveAccomplishment(a, sharedVariantsById)),
  }
}

export function resolveCompany(company: Company, sharedVariantsById: Map<string, SharedVariant>): ResolvedCompany {
  return {
    ...company,
    roles: company.roles.map((r) => resolveRole(r, sharedVariantsById)),
  }
}

/** Resolve the full document for portfolio, LinkedIn, and resume exporters. */
export function resolveDocument(doc: ExperiencesDocument): ResolvedExperiencesDocument {
  const index = buildSharedVariantIndex(doc)
  return {
    companies: doc.companies.map((c) => resolveCompany(c, index)),
  }
}

/**
 * Map each shared variant id to accomplishment paths that reference it.
 * Paths use dot notation, e.g. `companies.0.roles.1.accomplishments.2`.
 */
export function listSharedVariantReferences(doc: ExperiencesDocument): Map<string, string[]> {
  const refs = new Map<string, string[]>()

  for (const [ci, company] of doc.companies.entries()) {
    for (const [ri, role] of company.roles.entries()) {
      for (const [ai, accomplishment] of role.accomplishments.entries()) {
        const base = `companies.${ci}.roles.${ri}.accomplishments.${ai}`
        const sharedRefs = accomplishment.sharedVariants ?? {}
        for (const refId of Object.values(sharedRefs)) {
          const paths = refs.get(refId) ?? []
          paths.push(base)
          refs.set(refId, paths)
        }
      }
    }
  }

  return refs
}
