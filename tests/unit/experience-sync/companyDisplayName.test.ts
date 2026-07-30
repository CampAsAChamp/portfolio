import { getCompanyDisplayName } from "experience-sync/lib/companyDisplayName"
import { describe, expect, it } from "vitest"

import { makeCompany } from "./helpers"

describe("getCompanyDisplayName", () => {
  it("returns companyName when nickname is unset", () => {
    expect(getCompanyDisplayName(makeCompany({ id: "acme" }))).toBe("Acme Corp")
  })

  it("returns nickname when set", () => {
    expect(getCompanyDisplayName(makeCompany({ id: "raytheon", companyName: "Raytheon Intelligence & Space", nickname: "Raytheon" }))).toBe(
      "Raytheon",
    )
  })

  it("falls back to companyName when nickname is blank", () => {
    expect(getCompanyDisplayName(makeCompany({ id: "acme", nickname: "   " }))).toBe("Acme Corp")
  })
})
