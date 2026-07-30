import { formatValidationIssue, formatValidationSummary } from "experience-sync/lib/formatValidationIssue"
import { validateExperiencesDocument } from "experience-sync/lib/schema"
import { describe, expect, it } from "vitest"

import { makeAccomplishment, makeCompany, makeDocument, makeRole } from "./helpers"

describe("formatValidationIssue", () => {
  it("formats accomplishment variant issues with company, role, bullet, and destination", () => {
    const doc = makeDocument({
      companies: [
        makeCompany({
          id: "intuit",
          companyName: "Intuit",
          roles: [
            makeRole({
              id: "staff",
              position: "Staff Engineer",
              accomplishments: [
                makeAccomplishment({
                  id: "a1",
                  destinations: ["portfolio"],
                  variants: { portfolio: "" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const issue = {
      path: "companies.0.roles.0.accomplishments.0.variants.portfolio",
      message: "This bullet has no text",
      severity: "error" as const,
    }

    expect(formatValidationIssue(doc, issue)).toBe("Intuit → Staff Engineer → Bullet 1 (Portfolio): This bullet has no text")
  })

  it("formats role date issues", () => {
    const doc = makeDocument({
      companies: [
        makeCompany({
          id: "acme",
          companyName: "Acme Corp",
          roles: [makeRole({ id: "r1", position: "Engineer" })],
        }),
      ],
    })

    const issue = {
      path: "companies.0.roles.0.end",
      message: "End date (Jan 2020) must be on or after start date (Jun 2022)",
      severity: "error" as const,
    }

    expect(formatValidationIssue(doc, issue)).toBe("Acme Corp → Engineer: End date (Jan 2020) must be on or after start date (Jun 2022)")
  })
})

describe("formatValidationSummary", () => {
  it("notes that editor state is preserved on save failure", () => {
    const doc = makeDocument()
    const issues = [
      {
        path: "companies.0.roles.0.accomplishments.0.variants.portfolio",
        message: "This bullet has no text",
        severity: "error" as const,
      },
    ]

    expect(formatValidationSummary(doc, issues)).toContain("Your edits are still in the editor")
  })
})

describe("validateExperiencesDocument alias deduplication", () => {
  it("reports one empty-text error when resume and linkedin alias an empty portfolio", () => {
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
                  destinations: ["portfolio", "resume", "linkedin"],
                  variantSources: { resume: "portfolio", linkedin: "portfolio" },
                  variants: { portfolio: "" },
                }),
              ],
            }),
          ],
        }),
      ],
    })

    const result = validateExperiencesDocument(doc)
    expect(result.success).toBe(false)
    const emptyTextIssues = result.issues.filter((issue) => issue.message === "This bullet has no text")
    expect(emptyTextIssues).toHaveLength(1)
    expect(emptyTextIssues[0]?.path).toBe("companies.0.roles.0.accomplishments.0.variants.portfolio")
  })
})
