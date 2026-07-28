import { buildSharedVariantIndex, listSharedVariantReferences, resolveAccomplishment, resolveDocument } from "experience-sync/lib/resolve"
import { describe, expect, it } from "vitest"

import { makeAccomplishment, makeCompany, makeDocument, makeRole, makeSharedVariant } from "./helpers"

describe("resolveAccomplishment", () => {
  it("uses inline variants when no shared refs are set", () => {
    const accomplishment = makeAccomplishment({
      id: "a1",
      destinations: ["portfolio"],
      variants: { portfolio: "Inline text" },
    })

    const resolved = resolveAccomplishment(accomplishment, buildSharedVariantIndex(makeDocument()))
    expect(resolved.variants.portfolio).toBe("Inline text")
  })

  it("resolves linked destinations from shared variants", () => {
    const doc = makeDocument({
      sharedVariants: [
        makeSharedVariant({
          id: "shared-1",
          variants: {
            portfolio: "Shared portfolio",
            resume: "Shared resume",
          },
        }),
      ],
    })
    const index = buildSharedVariantIndex(doc)
    const accomplishment = makeAccomplishment({
      id: "a1",
      destinations: ["portfolio", "resume"],
      sharedVariants: {
        portfolio: "shared-1",
        resume: "shared-1",
      },
      variants: {},
    })

    const resolved = resolveAccomplishment(accomplishment, index)
    expect(resolved.variants.portfolio).toBe("Shared portfolio")
    expect(resolved.variants.resume).toBe("Shared resume")
  })

  it("mixes shared and custom destinations on one accomplishment", () => {
    const doc = makeDocument({
      sharedVariants: [
        makeSharedVariant({
          id: "shared-1",
          variants: { portfolio: "Shared portfolio" },
        }),
      ],
    })
    const index = buildSharedVariantIndex(doc)
    const accomplishment = makeAccomplishment({
      id: "a1",
      destinations: ["portfolio", "linkedin"],
      sharedVariants: { portfolio: "shared-1" },
      variants: { linkedin: "Custom LinkedIn" },
    })

    const resolved = resolveAccomplishment(accomplishment, index)
    expect(resolved.variants.portfolio).toBe("Shared portfolio")
    expect(resolved.variants.linkedin).toBe("Custom LinkedIn")
  })
})

describe("resolveDocument", () => {
  it("resolves shared text for multiple accomplishments referencing the same variant", () => {
    const doc = makeDocument({
      sharedVariants: [
        makeSharedVariant({
          id: "shared-1",
          variants: { portfolio: "Shared bullet" },
        }),
      ],
      companies: [
        makeCompany({
          id: "acme",
          roles: [
            makeRole({
              id: "r1",
              accomplishments: [
                makeAccomplishment({
                  id: "a1",
                  destinations: ["portfolio"],
                  sharedVariants: { portfolio: "shared-1" },
                  variants: {},
                }),
                makeAccomplishment({
                  id: "a2",
                  destinations: ["portfolio"],
                  sharedVariants: { portfolio: "shared-1" },
                  variants: {},
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const resolved = resolveDocument(doc)
    const bullets = resolved.companies[0]!.roles[0]!.accomplishments.map((a) => a.variants.portfolio)
    expect(bullets).toEqual(["Shared bullet", "Shared bullet"])
  })
})

describe("listSharedVariantReferences", () => {
  it("maps shared variant ids to accomplishment paths", () => {
    const doc = makeDocument({
      sharedVariants: [makeSharedVariant({ id: "shared-1" })],
      companies: [
        makeCompany({
          id: "acme",
          roles: [
            makeRole({
              id: "r1",
              accomplishments: [
                makeAccomplishment({
                  id: "a1",
                  destinations: ["portfolio"],
                  sharedVariants: { portfolio: "shared-1" },
                  variants: {},
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const refs = listSharedVariantReferences(doc)
    expect(refs.get("shared-1")).toEqual(["companies.0.roles.0.accomplishments.0"])
  })
})
