import type { Accomplishment, Destination, ExperiencesDocument, Variants } from "experience-sync/lib/schema";





export const ALL_DESTINATIONS = ["portfolio", "resume", "linkedin"] as const satisfies readonly Destination[]

function hasNonEmptyText(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0
}

/** All three destinations are selected. */
export function hasAllDestinations(destinations: Destination[] | undefined): boolean {
  if (!destinations) {
    return false
  }
  return ALL_DESTINATIONS.every((dest) => destinations.includes(dest))
}

/** Only the portfolio destination is selected. */
export function isPortfolioOnly(destinations: Destination[]): boolean {
  return destinations.length === 1 && destinations[0] === "portfolio"
}

/**
 * Portfolio is never aliased; every other selected destination aliases to portfolio
 * (or is portfolio itself).
 */
export function isDefaultVariantSharing(accomplishment: Accomplishment): boolean {
  if (shouldExpandImplicitSharing(accomplishment)) {
    return true
  }

  const sources = accomplishment.variantSources ?? {}

  if (sources.portfolio) {
    return false
  }

  for (const dest of accomplishment.destinations) {
    if (dest === "portfolio") {
      continue
    }
    if (sources[dest] !== "portfolio") {
      return false
    }
  }

  return true
}

/** Bullet uses the canonical simple setup (all-3 or portfolio-only with default sharing). */
export function isDefaultAccomplishmentSetup(accomplishment: Accomplishment): boolean {
  const { destinations } = accomplishment
  const defaultDestinations = hasAllDestinations(destinations) || isPortfolioOnly(destinations)
  return defaultDestinations && isDefaultVariantSharing(accomplishment)
}

/** All-3 bullet with portfolio text only — resume/linkedin implicitly reuse portfolio on load. */
function shouldExpandImplicitSharing(accomplishment: Accomplishment): boolean {
  if (!hasAllDestinations(accomplishment.destinations)) {
    return false
  }

  if (!hasNonEmptyText(accomplishment.variants.portfolio)) {
    return false
  }

  const sources = accomplishment.variantSources ?? {}

  for (const dest of ["resume", "linkedin"] as const) {
    if (sources[dest]) {
      return false
    }
    if (hasNonEmptyText(accomplishment.variants[dest])) {
      return false
    }
  }

  return true
}

/** Fill implicit resume/linkedin → portfolio sharing for editor and export consumers. */
export function expandAccomplishmentDefaults(accomplishment: Accomplishment): Accomplishment {
  if (!shouldExpandImplicitSharing(accomplishment)) {
    return accomplishment
  }

  return {
    ...accomplishment,
    variantSources: {
      ...accomplishment.variantSources,
      resume: "portfolio",
      linkedin: "portfolio",
    },
  }
}

function pruneVariants(accomplishment: Accomplishment): Variants {
  const selected = new Set(accomplishment.destinations)
  const pruned: Variants = {}

  for (const dest of ALL_DESTINATIONS) {
    const value = accomplishment.variants[dest]
    if (!selected.has(dest)) {
      continue
    }
    if (accomplishment.variantSources?.[dest]) {
      continue
    }
    if (value !== undefined) {
      pruned[dest] = value
    }
  }

  return pruned
}

/** Strip redundant variantSources and orphan variant keys before persisting YAML. */
export function normalizeAccomplishment(accomplishment: Accomplishment): Accomplishment {
  const expanded = expandAccomplishmentDefaults(accomplishment)
  const next: Accomplishment = {
    ...expanded,
    variants: pruneVariants(expanded),
  }

  if (isDefaultVariantSharing(next)) {
    delete next.variantSources
  }

  return next
}

export function expandDocumentDefaults(doc: ExperiencesDocument): ExperiencesDocument {
  return {
    companies: doc.companies.map((company) => ({
      ...company,
      roles: company.roles.map((role) => ({
        ...role,
        accomplishments: role.accomplishments.map((acc) => expandAccomplishmentDefaults(acc)),
      })),
    })),
  }
}

export function normalizeDocument(doc: ExperiencesDocument): ExperiencesDocument {
  return {
    companies: doc.companies.map((company) => ({
      ...company,
      roles: company.roles.map((role) => ({
        ...role,
        accomplishments: role.accomplishments.map((acc) => normalizeAccomplishment(acc)),
      })),
    })),
  }
}
