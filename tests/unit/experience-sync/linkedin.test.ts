import { formatLinkedInExport } from "experience-sync/lib/linkedin"
import { describe, expect, it } from "vitest"

import { makeAccomplishment, makeCompany, makeDocument, makeRole, makeRoleDate } from "./helpers"

describe("formatLinkedInExport", () => {
  it("formats a role with LinkedIn bullets and ranged dates", () => {
    const doc = makeDocument({
      companies: [
        makeCompany({
          id: "acme",
          companyName: "Acme Corp",
          location: "Remote",
          roles: [
            makeRole({
              id: "r1",
              position: "Engineer",
              start: makeRoleDate("Jan", 2020),
              end: makeRoleDate("Dec", 2021),
              accomplishments: [
                makeAccomplishment({
                  id: "a1",
                  destinations: ["linkedin"],
                  variants: { linkedin: "Shipped [API](https://api.example)" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const text = formatLinkedInExport(doc)
    expect(text).toContain("Engineer")
    expect(text).toContain("Acme Corp · Remote")
    expect(text).toContain("Jan 2020 – Dec 2021")
    expect(text).toContain("• Shipped API")
    expect(text).not.toContain("https://api.example")
  })

  it("uses Present when role has no end date", () => {
    const doc = makeDocument({
      companies: [
        makeCompany({
          id: "acme",
          roles: [
            makeRole({
              id: "r1",
              end: undefined,
              accomplishments: [
                makeAccomplishment({
                  id: "a1",
                  destinations: ["linkedin"],
                  variants: { linkedin: "Still shipping" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    expect(formatLinkedInExport(doc)).toContain("Jan 2020 – Present")
  })

  it("skips roles without LinkedIn-tagged accomplishments", () => {
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
                  variants: { portfolio: "Portfolio only" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    expect(formatLinkedInExport(doc)).toBe("No LinkedIn-tagged accomplishments found.\n")
  })
})
