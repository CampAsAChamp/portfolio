import { formatResumeExport } from "experience-sync/lib/resume"
import { describe, expect, it } from "vitest"

import { makeAccomplishment, makeCompany, makeDocument, makeRole, makeRoleDate } from "./helpers"

describe("formatResumeExport", () => {
  it("formats resume markdown with company, role, and bullets", () => {
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
                  destinations: ["resume"],
                  variants: { resume: "Led [migration](https://example.com)" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const md = formatResumeExport(doc)
    expect(md).toContain("# Experience")
    expect(md).toContain("## Acme Corp — Remote")
    expect(md).toContain("### Engineer")
    expect(md).toContain("*Jan 2020 – Dec 2021*")
    expect(md).toContain("- Led migration")
    expect(md).not.toContain("https://example.com")
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
                  destinations: ["resume"],
                  variants: { resume: "Ongoing work" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    expect(formatResumeExport(doc)).toContain("*Jan 2020 – Present*")
  })

  it("returns an empty-state message when no resume accomplishments exist", () => {
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

    expect(formatResumeExport(doc)).toBe("# Experience\n\nNo resume-tagged accomplishments found.\n")
  })
})
