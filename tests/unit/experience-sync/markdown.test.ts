import { bulletToTsExpr, parseMarkdownSegments, stripMarkdownLinks } from "experience-sync/lib/markdown"
import { emitTsExpr } from "experience-sync/lib/tsEmit"
import { describe, expect, it } from "vitest"

describe("parseMarkdownSegments", () => {
  it("returns plain text as a single segment", () => {
    expect(parseMarkdownSegments("Just text")).toEqual([{ type: "text", value: "Just text" }])
  })

  it("parses a single markdown link", () => {
    expect(parseMarkdownSegments("See [docs](https://example.com) now")).toEqual([
      { type: "text", value: "See " },
      { type: "link", text: "docs", href: "https://example.com" },
      { type: "text", value: " now" },
    ])
  })

  it("parses multiple markdown links", () => {
    expect(parseMarkdownSegments("[A](https://a.example) and [B](http://b.example)")).toEqual([
      { type: "link", text: "A", href: "https://a.example" },
      { type: "text", value: " and " },
      { type: "link", text: "B", href: "http://b.example" },
    ])
  })
})

describe("stripMarkdownLinks", () => {
  it("keeps plain text unchanged", () => {
    expect(stripMarkdownLinks("No links here")).toBe("No links here")
  })

  it("replaces markdown links with their labels", () => {
    expect(stripMarkdownLinks("Used [React](https://react.dev) and [Vite](https://vite.dev)")).toBe("Used React and Vite")
  })
})

describe("bulletToTsExpr", () => {
  it("emits a text-only bullet array literal", () => {
    expect(emitTsExpr(bulletToTsExpr("Shipped features"))).toBe(`[
  "Shipped features",
]`)
  })

  it("emits createExternalLink calls for markdown links", () => {
    const emitted = emitTsExpr(bulletToTsExpr("Built [API](https://api.example)"))
    expect(emitted).toContain('createExternalLink("API", "https://api.example")')
    expect(emitted).toContain('"Built "')
  })
})
