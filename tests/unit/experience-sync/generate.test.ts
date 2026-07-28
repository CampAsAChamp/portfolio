import { generateExperiencesTs } from "experience-sync/lib/generate"
import { describe, expect, it } from "vitest"

import { makeAccomplishment, makeCompany, makeDocument, makeRole, makeSharedVariant } from "./helpers"

describe("generateExperiencesTs", () => {
  it("includes a logo import derived from the logo filename", () => {
    const source = generateExperiencesTs(makeDocument())
    expect(source).toContain('import IntuitLogo from "assets/Company_Logos/Intuit.svg"')
    expect(source).toContain("logo: IntuitLogo")
  })

  it("includes only portfolio-tagged accomplishments", () => {
    const doc = makeDocument({
      companies: [
        makeCompany({
          id: "acme",
          roles: [
            makeRole({
              id: "r1",
              accomplishments: [
                makeAccomplishment({
                  id: "port",
                  destinations: ["portfolio"],
                  variants: { portfolio: "Portfolio only bullet" },
                }),
                makeAccomplishment({
                  id: "li",
                  destinations: ["linkedin"],
                  variants: { linkedin: "LinkedIn only bullet" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const source = generateExperiencesTs(doc)
    expect(source).toContain("Portfolio only bullet")
    expect(source).not.toContain("LinkedIn only bullet")
  })

  it("expands markdown links into createExternalLink calls", () => {
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
                  destinations: ["portfolio"],
                  variants: { portfolio: "Shipped [Tool](https://tool.example)" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const source = generateExperiencesTs(doc)
    expect(source).toContain('createExternalLink("Tool", "https://tool.example")')
  })

  it("sanitizes logo filenames that start with a digit", () => {
    const doc = makeDocument({
      companies: [makeCompany({ id: "acme", logoFile: "123Corp.svg" })],
    })

    const source = generateExperiencesTs(doc)
    expect(source).toContain('import _123CorpLogo from "assets/Company_Logos/123Corp.svg"')
    expect(source).toContain("logo: _123CorpLogo")
  })

  it("writes empty bulletPoints when no portfolio accomplishments exist", () => {
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
                  destinations: ["resume"],
                  variants: { resume: "Resume only" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const source = generateExperiencesTs(doc)
    expect(source).toContain("bulletPoints: [],")
  })

  it("resolves shared variant text for multiple accomplishments", () => {
    const doc = makeDocument({
      sharedVariants: [makeSharedVariant({ id: "shared-1", variants: { portfolio: "Shared portfolio bullet" } })],
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

    const source = generateExperiencesTs(doc)
    expect(source.match(/Shared portfolio bullet/g)?.length).toBe(2)
  })
})
