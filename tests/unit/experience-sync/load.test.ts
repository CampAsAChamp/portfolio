import { normalizeDocument } from "experience-sync/lib/accomplishmentDefaults"
import { validateExperiencesDocument } from "experience-sync/lib/schema"
import { describe, expect, it } from "vitest"

import { makeCompany, makeDocument } from "./helpers"

describe("experiences persistence", () => {
  it("preserves company nickname through validate and normalize", () => {
    const doc = makeDocument({
      companies: [makeCompany({ id: "raytheon", companyName: "Raytheon Intelligence & Space", nickname: "Raytheon" })],
    })

    const validated = validateExperiencesDocument(doc)
    expect(validated.success).toBe(true)
    expect(validated.data?.companies[0]?.nickname).toBe("Raytheon")

    const normalized = normalizeDocument(validated.data!)
    expect(normalized.companies[0]?.nickname).toBe("Raytheon")
  })

  it("strips blank nicknames when normalizing", () => {
    const doc = makeDocument({
      companies: [makeCompany({ id: "acme", nickname: "   " })],
    })

    const normalized = normalizeDocument(doc)
    expect(normalized.companies[0]?.nickname).toBeUndefined()
  })
})
