import { arr, call, emitTsExpr, ident, lit, obj } from "experience-sync/lib/tsEmit"
import { describe, expect, it } from "vitest"

describe("emitTsExpr", () => {
  it("emits primitives and identifiers", () => {
    expect(emitTsExpr(lit("hi"))).toBe('"hi"')
    expect(emitTsExpr(lit(42))).toBe("42")
    expect(emitTsExpr(ident("COLORS.INTUIT"))).toBe("COLORS.INTUIT")
  })

  it("emits calls, arrays, and objects", () => {
    expect(emitTsExpr(call("createExternalLink", lit("A"), lit("https://a.example")))).toBe('createExternalLink("A", "https://a.example")')
    expect(emitTsExpr(arr([]))).toBe("[]")
    expect(
      emitTsExpr(
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
