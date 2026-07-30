import { render, screen } from "@testing-library/react"
import { BulletPoint } from "components/Common/BulletPoint"
import { createExternalLink, createInlineCode } from "utils/contentUtils"
import { describe, expect, it } from "vitest"

describe("BulletPoint", () => {
  it("renders markdown-lite strings with inline code", () => {
    render(
      <ul>
        <BulletPoint bulletPoint="Run `yarn exp:ui` to start the editor." />
      </ul>,
    )

    const code = screen.getByText("yarn exp:ui")
    expect(code.tagName).toBe("CODE")
    expect(code).toHaveClass("bullet-inline-code")
  })

  it("renders markdown-lite strings with links and inline code", () => {
    render(
      <ul>
        <BulletPoint bulletPoint="See [Playwright](https://playwright.dev/) and `config.save`." />
      </ul>,
    )

    expect(screen.getByRole("link", { name: "Playwright" })).toHaveAttribute("href", "https://playwright.dev/")
    expect(screen.getByText("config.save")).toHaveClass("bullet-inline-code")
  })

  it("renders pre-parsed segment arrays", () => {
    render(
      <ul>
        <BulletPoint bulletPoint={["Run ", createInlineCode("yarn exp:ui"), " to start the editor."]} />
      </ul>,
    )

    const code = screen.getByText("yarn exp:ui")
    expect(code.tagName).toBe("CODE")
    expect(code).toHaveClass("bullet-inline-code")
  })

  it("renders links and inline code in pre-parsed segment arrays", () => {
    render(
      <ul>
        <BulletPoint
          bulletPoint={["See ", createExternalLink("Playwright", "https://playwright.dev/"), " and ", createInlineCode("config.save"), "."]}
        />
      </ul>,
    )

    expect(screen.getByRole("link", { name: "Playwright" })).toHaveAttribute("href", "https://playwright.dev/")
    expect(screen.getByText("config.save")).toHaveClass("bullet-inline-code")
  })
})
