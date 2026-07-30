import {
  expandAccomplishmentDefaults,
  expandDocumentDefaults,
  hasAllDestinations,
  isDefaultAccomplishmentSetup,
  isDefaultVariantSharing,
  isPortfolioOnly,
  normalizeAccomplishment,
  normalizeDocument,
} from "experience-sync/lib/accomplishmentDefaults"
import { resolveAccomplishment } from "experience-sync/lib/resolve"
import type { Accomplishment } from "experience-sync/lib/schema"
import { makeAccomplishment, makeCompany, makeDocument, makeRole } from "tests/unit/experience-sync/helpers"
import { describe, expect, it } from "vitest"

function defaultAllThreeBullet(overrides: Partial<Accomplishment> = {}): Accomplishment {
  return makeAccomplishment({
    id: "bullet-1",
    destinations: ["portfolio", "resume", "linkedin"],
    variantSources: { resume: "portfolio", linkedin: "portfolio" },
    variants: { portfolio: "Built things" },
    ...overrides,
  })
}

describe("accomplishmentDefaults", () => {
  it("detects all destinations and portfolio-only setups", () => {
    expect(hasAllDestinations(["portfolio", "resume", "linkedin"])).toBe(true)
    expect(hasAllDestinations(["portfolio", "resume"])).toBe(false)
    expect(isPortfolioOnly(["portfolio"])).toBe(true)
    expect(isPortfolioOnly(["portfolio", "resume"])).toBe(false)
  })

  it("treats all-3 portfolio-canonical bullets as default setup", () => {
    const acc = defaultAllThreeBullet()
    expect(isDefaultVariantSharing(acc)).toBe(true)
    expect(isDefaultAccomplishmentSetup(acc)).toBe(true)
  })

  it("treats portfolio-only bullets as default setup", () => {
    const acc = makeAccomplishment({
      id: "portfolio-only",
      destinations: ["portfolio"],
      variants: { portfolio: "Legacy bullet" },
    })
    expect(isDefaultAccomplishmentSetup(acc)).toBe(true)
  })

  it("rejects subset destinations as default setup", () => {
    const acc = makeAccomplishment({
      id: "subset",
      destinations: ["portfolio", "resume"],
      variantSources: { resume: "portfolio" },
      variants: { portfolio: "Shared text" },
    })
    expect(isDefaultAccomplishmentSetup(acc)).toBe(false)
  })

  it("rejects resume custom text as default setup", () => {
    const acc = defaultAllThreeBullet({
      variantSources: undefined,
      variants: {
        portfolio: "Portfolio text",
        resume: "Resume text",
        linkedin: "LinkedIn text",
      },
    })
    expect(isDefaultVariantSharing(acc)).toBe(false)
    expect(isDefaultAccomplishmentSetup(acc)).toBe(false)
  })

  it("rejects resume to linkedin aliasing as default setup", () => {
    const acc = defaultAllThreeBullet({
      variantSources: { resume: "linkedin" },
      variants: {
        portfolio: "Portfolio text",
        linkedin: "LinkedIn text",
      },
    })
    expect(isDefaultVariantSharing(acc)).toBe(false)
    expect(isDefaultAccomplishmentSetup(acc)).toBe(false)
  })

  it("treats implicit portfolio sharing as default variant sharing", () => {
    const acc = makeAccomplishment({
      id: "implicit",
      destinations: ["portfolio", "resume", "linkedin"],
      variants: { portfolio: "Canonical text" },
    })
    expect(isDefaultVariantSharing(acc)).toBe(true)
    expect(isDefaultAccomplishmentSetup(acc)).toBe(true)
  })

  it("expands implicit sharing for all-3 bullets with portfolio text only", () => {
    const acc = makeAccomplishment({
      id: "implicit",
      destinations: ["portfolio", "resume", "linkedin"],
      variants: { portfolio: "Canonical text" },
    })

    const expanded = expandAccomplishmentDefaults(acc)
    expect(expanded.variantSources).toEqual({ resume: "portfolio", linkedin: "portfolio" })
    expect(expandAccomplishmentDefaults(expanded)).toEqual(expanded)
  })

  it("does not expand when resume or linkedin already have explicit sources or text", () => {
    const withSource = makeAccomplishment({
      id: "explicit-source",
      destinations: ["portfolio", "resume", "linkedin"],
      variantSources: { resume: "linkedin" },
      variants: { portfolio: "Portfolio text", linkedin: "LinkedIn text" },
    })
    expect(expandAccomplishmentDefaults(withSource).variantSources).toEqual({ resume: "linkedin" })

    const withInline = makeAccomplishment({
      id: "inline-resume",
      destinations: ["portfolio", "resume", "linkedin"],
      variants: { portfolio: "Portfolio text", resume: "Resume text" },
    })
    expect(expandAccomplishmentDefaults(withInline).variantSources).toBeUndefined()
  })

  it("strips default variantSources on normalize", () => {
    const acc = defaultAllThreeBullet()
    const normalized = normalizeAccomplishment(acc)
    expect(normalized.variantSources).toBeUndefined()
    expect(normalized.variants).toEqual({ portfolio: "Built things" })
  })

  it("preserves resolved text across normalize and expand round-trip", () => {
    const acc = defaultAllThreeBullet()
    const before = resolveAccomplishment(acc)
    const roundTrip = expandAccomplishmentDefaults(normalizeAccomplishment(acc))
    const after = resolveAccomplishment(roundTrip)

    expect(after).toEqual(before)
  })

  it("normalizes and expands full documents", () => {
    const doc = makeDocument({
      companies: [
        makeCompany({
          id: "co",
          roles: [
            makeRole({
              id: "role",
              accomplishments: [defaultAllThreeBullet()],
            }),
          ],
        }),
      ],
    })

    const normalized = normalizeDocument(doc)
    expect(normalized.companies[0]!.roles[0]!.accomplishments[0]!.variantSources).toBeUndefined()

    const expanded = expandDocumentDefaults(normalized)
    expect(expanded.companies[0]!.roles[0]!.accomplishments[0]!.variantSources).toEqual({
      resume: "portfolio",
      linkedin: "portfolio",
    })
  })
})
