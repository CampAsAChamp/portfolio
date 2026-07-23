import { getRoleEndBeforeStartMessage, validateExperiencesDocument } from "experience-sync/lib/schema"
import { describe, expect, it } from "vitest"

import { makeAccomplishment, makeCompany, makeDocument, makeRole, makeRoleDate } from "./helpers"

describe("getRoleEndBeforeStartMessage", () => {
  it("allows the same month", () => {
    expect(getRoleEndBeforeStartMessage(makeRoleDate("Mar", 2021), makeRoleDate("Mar", 2021))).toBeNull()
  })

  it("allows end after start", () => {
    expect(getRoleEndBeforeStartMessage(makeRoleDate("Jan", 2020), makeRoleDate("Dec", 2021))).toBeNull()
  })

  it("rejects end before start", () => {
    expect(getRoleEndBeforeStartMessage(makeRoleDate("Jun", 2022), makeRoleDate("May", 2022))).toMatch(/must be on or after/)
  })
})

describe("validateExperiencesDocument", () => {
  it("accepts a valid document", () => {
    const result = validateExperiencesDocument(makeDocument())
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(result.issues).toEqual([])
  })

  it("errors when a selected destination has no variant text", () => {
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
                  variants: { portfolio: "Has portfolio text" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const result = validateExperiencesDocument(doc)
    expect(result.success).toBe(false)
    const issue = result.issues.find((i) => i.path === "companies.0.roles.0.accomplishments.0.variants.resume")
    expect(issue?.severity).toBe("error")
    expect(issue?.message).toContain('Destination "resume"')
  })

  it("warns when an orphan variant is set without its destination", () => {
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
                  variants: {
                    portfolio: "Portfolio only",
                    linkedin: "Orphan LinkedIn text",
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const result = validateExperiencesDocument(doc)
    expect(result.success).toBe(true)
    const issue = result.issues.find((i) => i.path === "companies.0.roles.0.accomplishments.0.variants.linkedin")
    expect(issue?.severity).toBe("warning")
    expect(issue?.message).toContain('Variant "linkedin"')
  })

  it("errors on duplicate company, role, and accomplishment ids", () => {
    const doc = makeDocument({
      companies: [
        makeCompany({
          id: "dup",
          roles: [
            makeRole({
              id: "role-dup",
              accomplishments: [
                makeAccomplishment({
                  id: "acc-dup",
                  destinations: ["portfolio"],
                  variants: { portfolio: "One" },
                }),
              ],
            }),
          ],
        }),
        makeCompany({
          id: "dup",
          roles: [
            makeRole({
              id: "role-dup",
              accomplishments: [
                makeAccomplishment({
                  id: "acc-dup",
                  destinations: ["portfolio"],
                  variants: { portfolio: "Two" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const result = validateExperiencesDocument(doc)
    expect(result.success).toBe(false)
    expect(result.issues.filter((i) => i.message.includes("Duplicate company id"))).toHaveLength(1)
    expect(result.issues.filter((i) => i.message.includes("Duplicate role id"))).toHaveLength(1)
    expect(result.issues.filter((i) => i.message.includes("Duplicate accomplishment id"))).toHaveLength(1)
  })

  it("errors when role end is before start", () => {
    const doc = makeDocument({
      companies: [
        makeCompany({
          id: "acme",
          roles: [
            makeRole({
              id: "r1",
              start: makeRoleDate("Jun", 2022),
              end: makeRoleDate("Jan", 2022),
            }),
          ],
        }),
      ],
    })

    const result = validateExperiencesDocument(doc)
    expect(result.success).toBe(false)
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        path: "companies.0.roles.0.end",
        severity: "error",
      }),
    )
  })

  it("allows role end in the same month as start", () => {
    const doc = makeDocument({
      companies: [
        makeCompany({
          id: "acme",
          roles: [
            makeRole({
              id: "r1",
              start: makeRoleDate("Mar", 2021),
              end: makeRoleDate("Mar", 2021),
            }),
          ],
        }),
      ],
    })

    const result = validateExperiencesDocument(doc)
    expect(result.success).toBe(true)
    expect(result.issues.filter((i) => i.path.endsWith(".end"))).toEqual([])
  })

  it("returns Zod path errors for structurally invalid input", () => {
    const result = validateExperiencesDocument({ companies: [] })
    expect(result.success).toBe(false)
    expect(result.issues.some((i) => i.severity === "error")).toBe(true)
  })
})
