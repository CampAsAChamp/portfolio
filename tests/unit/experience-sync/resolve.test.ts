import { resolveAccomplishment, resolveDestinationText, resolveDocument } from "experience-sync/lib/resolve"
import { describe, expect, it } from "vitest"

import { makeAccomplishment, makeCompany, makeDocument, makeRole } from "./helpers"

describe("resolveDestinationText", () => {
  it("returns inline text when no alias is set", () => {
    const accomplishment = makeAccomplishment({
      id: "a1",
      destinations: ["portfolio"],
      variants: { portfolio: "Inline text" },
    })

    expect(resolveDestinationText(accomplishment, "portfolio")).toBe("Inline text")
  })

  it("follows a single alias", () => {
    const accomplishment = makeAccomplishment({
      id: "a1",
      destinations: ["resume", "linkedin"],
      variantSources: { resume: "linkedin" },
      variants: { linkedin: "LinkedIn text" },
    })

    expect(resolveDestinationText(accomplishment, "resume")).toBe("LinkedIn text")
  })

  it("follows alias chains", () => {
    const accomplishment = makeAccomplishment({
      id: "a1",
      destinations: ["portfolio", "resume", "linkedin"],
      variantSources: { portfolio: "resume", resume: "linkedin" },
      variants: { linkedin: "Source text" },
    })

    expect(resolveDestinationText(accomplishment, "portfolio")).toBe("Source text")
  })

  it("returns empty string on alias cycles", () => {
    const accomplishment = makeAccomplishment({
      id: "a1",
      destinations: ["portfolio", "resume"],
      variantSources: { portfolio: "resume", resume: "portfolio" },
      variants: { portfolio: "A", resume: "B" },
    })

    expect(resolveDestinationText(accomplishment, "portfolio")).toBe("")
  })
})

describe("resolveAccomplishment", () => {
  it("uses inline variants when no aliases are set", () => {
    const accomplishment = makeAccomplishment({
      id: "a1",
      destinations: ["portfolio"],
      variants: { portfolio: "Inline text" },
    })

    const resolved = resolveAccomplishment(accomplishment)
    expect(resolved.variants.portfolio).toBe("Inline text")
  })

  it("resolves aliased destinations from another destination on the same accomplishment", () => {
    const accomplishment = makeAccomplishment({
      id: "a1",
      destinations: ["portfolio", "resume", "linkedin"],
      variantSources: { resume: "linkedin" },
      variants: {
        portfolio: "Portfolio text",
        linkedin: "LinkedIn text",
      },
    })

    const resolved = resolveAccomplishment(accomplishment)
    expect(resolved.variants.portfolio).toBe("Portfolio text")
    expect(resolved.variants.linkedin).toBe("LinkedIn text")
    expect(resolved.variants.resume).toBe("LinkedIn text")
  })

  it("mixes aliased and custom destinations on one accomplishment", () => {
    const accomplishment = makeAccomplishment({
      id: "a1",
      destinations: ["portfolio", "linkedin"],
      variantSources: { portfolio: "linkedin" },
      variants: { linkedin: "Custom LinkedIn" },
    })

    const resolved = resolveAccomplishment(accomplishment)
    expect(resolved.variants.portfolio).toBe("Custom LinkedIn")
    expect(resolved.variants.linkedin).toBe("Custom LinkedIn")
  })

  it("resolves implicit resume and linkedin sharing from portfolio-only YAML", () => {
    const accomplishment = makeAccomplishment({
      id: "a1",
      destinations: ["portfolio", "resume", "linkedin"],
      variants: { portfolio: "Shared bullet" },
    })

    const resolved = resolveAccomplishment(accomplishment)
    expect(resolved.variants.portfolio).toBe("Shared bullet")
    expect(resolved.variants.resume).toBe("Shared bullet")
    expect(resolved.variants.linkedin).toBe("Shared bullet")
  })
})

describe("resolveDocument", () => {
  it("resolves variantSources for all accomplishments", () => {
    const doc = makeDocument({
      companies: [
        makeCompany({
          id: "acme",
          roles: [
            makeRole({
              id: "r1",
              accomplishments: [
                makeAccomplishment({
                  id: "a1",
                  destinations: ["portfolio", "resume"],
                  variantSources: { resume: "portfolio" },
                  variants: { portfolio: "Shared bullet" },
                }),
                makeAccomplishment({
                  id: "a2",
                  destinations: ["linkedin"],
                  variants: { linkedin: "LinkedIn only" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const resolved = resolveDocument(doc)
    const accomplishments = resolved.companies[0]!.roles[0]!.accomplishments
    expect(accomplishments[0]!.variants.resume).toBe("Shared bullet")
    expect(accomplishments[1]!.variants.linkedin).toBe("LinkedIn only")
  })
})
