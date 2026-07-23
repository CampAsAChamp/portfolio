import { arr, call, ident, lit, obj, printTsExpr } from "experience-sync/lib/tsExpr"
import { describe, expect, it } from "vitest"

describe("printTsExpr", () => {
  it("prints primitives and identifiers", () => {
    expect(printTsExpr(lit("hi"))).toBe('"hi"')
    expect(printTsExpr(lit(42))).toBe("42")
    expect(printTsExpr(ident("COLORS.INTUIT"))).toBe("COLORS.INTUIT")
  })

  it("prints calls, arrays, and objects", () => {
    expect(printTsExpr(call("createExternalLink", lit("A"), lit("https://a.example")))).toBe('createExternalLink("A", "https://a.example")')
    expect(printTsExpr(arr([]))).toBe("[]")
    expect(
      printTsExpr(
        obj({
          name: lit("Acme"),
          logo: ident("AcmeLogo"),
          skip: undefined,
        }),
      ),
    ).toBe(`{
  name: "Acme",
  logo: AcmeLogo,
}`)
  })
})
