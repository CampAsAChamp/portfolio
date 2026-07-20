import { createExternalLink, createLink } from "utils/contentUtils"
import { describe, expect, it } from "vitest"

describe("contentUtils", () => {
  it("creates an internal link", () => {
    expect(createLink("Home", "/")).toEqual({ text: "Home", href: "/" })
  })

  it("creates a link with optional target and rel", () => {
    expect(createLink("Docs", "/docs", { target: "_self", rel: "nofollow" })).toEqual({
      text: "Docs",
      href: "/docs",
      target: "_self",
      rel: "nofollow",
    })
  })

  it("creates an external link with safe defaults", () => {
    expect(createExternalLink("GitHub", "https://github.com")).toEqual({
      text: "GitHub",
      href: "https://github.com",
      target: "_blank",
      rel: "noopener noreferrer",
    })
  })
})
