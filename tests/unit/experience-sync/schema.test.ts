import { getRoleEndBeforeStartMessage, validateExperiencesDocument } from "experience-sync/lib/schema"
import { describe, expect, it } from "vitest"

import { makeAccomplishment, makeCompany, makeDocument, makeRole, makeRoleDate, makeSharedVariant } from "./helpers"

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

  it("accepts a document without sharedVariants (backward compatible)", () => {
    const result = validateExperiencesDocument({ companies: [makeCompany({ id: "acme" })] })
    expect(result.success).toBe(true)
    expect(result.data?.sharedVariants).toEqual([])
  })

  it("accepts linked destinations when shared variant has text", () => {
    const doc = makeDocument({
      sharedVariants: [
        makeSharedVariant({
          id: "shared-1",
          variants: { portfolio: "Shared text", resume: "Shared resume" },
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
                  destinations: ["portfolio", "resume"],
                  sharedVariants: { portfolio: "shared-1", resume: "shared-1" },
                  variants: {},
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const result = validateExperiencesDocument(doc)
    expect(result.success).toBe(true)
    expect(result.issues).toEqual([])
  })

  it("errors when a shared variant ref is missing", () => {
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
                  sharedVariants: { portfolio: "missing-id" },
                  variants: {},
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const result = validateExperiencesDocument(doc)
    expect(result.success).toBe(false)
    expect(result.issues.some((i) => i.message.includes('Shared variant "missing-id" not found'))).toBe(true)
  })

  it("errors when shared variant lacks text for linked destination", () => {
    const doc = makeDocument({
      sharedVariants: [makeSharedVariant({ id: "shared-1", variants: { portfolio: "Only portfolio" } })],
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
                  sharedVariants: { resume: "shared-1" },
                  variants: {},
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const result = validateExperiencesDocument(doc)
    expect(result.success).toBe(false)
    expect(result.issues.some((i) => i.message.includes('has no text for destination "resume"'))).toBe(true)
  })

  it("warns when inline variant exists on a linked destination", () => {
    const doc = makeDocument({
      sharedVariants: [makeSharedVariant({ id: "shared-1", variants: { portfolio: "Shared text" } })],
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
                  variants: { portfolio: "Ignored inline" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const result = validateExperiencesDocument(doc)
    expect(result.success).toBe(true)
    expect(result.issues.some((i) => i.severity === "warning" && i.message.includes("Inline variant ignored"))).toBe(true)
  })

  it("errors on duplicate shared variant ids", () => {
    const doc = makeDocument({
      sharedVariants: [
        makeSharedVariant({ id: "dup", variants: { portfolio: "One" } }),
        makeSharedVariant({ id: "dup", variants: { portfolio: "Two" } }),
      ],
    })

    const result = validateExperiencesDocument(doc)
    expect(result.success).toBe(false)
    expect(result.issues.some((i) => i.message.includes("Duplicate shared variant id"))).toBe(true)
  })

  it("warns when a shared variant has no destination text", () => {
    const doc = makeDocument({
      sharedVariants: [makeSharedVariant({ id: "empty", variants: {} })],
    })

    const result = validateExperiencesDocument(doc)
    expect(result.success).toBe(true)
    expect(result.issues.some((i) => i.path === "sharedVariants.0.variants" && i.severity === "warning")).toBe(true)
  })
})
