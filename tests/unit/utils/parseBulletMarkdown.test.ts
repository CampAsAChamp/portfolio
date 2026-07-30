import { parseBulletMarkdown } from "utils/parseBulletMarkdown"
import { describe, expect, it } from "vitest"

describe("parseBulletMarkdown", () => {
  it("returns plain text as a single segment", () => {
    expect(parseBulletMarkdown("Just text")).toEqual(["Just text"])
  })

  it("parses a single markdown link", () => {
    expect(parseBulletMarkdown("See [docs](https://example.com) now")).toEqual([
      "See ",
      {
        text: "docs",
        href: "https://example.com",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      " now",
    ])
  })

  it("parses inline code", () => {
    expect(parseBulletMarkdown("Run `yarn exp:ui` to start.")).toEqual(["Run ", { code: "yarn exp:ui" }, " to start."])
  })

  it("parses links and inline code in the same bullet", () => {
    expect(parseBulletMarkdown("See [Playwright](https://playwright.dev/) and `config.save`.")).toEqual([
      "See ",
      {
        text: "Playwright",
        href: "https://playwright.dev/",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      " and ",
      { code: "config.save" },
      ".",
    ])
  })

  it("prefers the earliest special token when both appear", () => {
    expect(parseBulletMarkdown("[A](https://a.example) then `code`")).toEqual([
      {
        text: "A",
        href: "https://a.example",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      " then ",
      { code: "code" },
    ])
  })

  it("parses multiple markdown links", () => {
    expect(parseBulletMarkdown("[A](https://a.example) and [B](http://b.example)")).toEqual([
      {
        text: "A",
        href: "https://a.example",
        target: "_blank",
        rel: "noopener noreferrer",
      },
      " and ",
      {
        text: "B",
        href: "http://b.example",
        target: "_blank",
        rel: "noopener noreferrer",
      },
    ])
  })
})
