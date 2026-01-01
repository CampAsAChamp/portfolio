import { render } from "@testing-library/react"
import { ThemeSwitcher } from "components/NavBar/ThemeSwitcher"
import { describe, it } from "vitest"

describe("ThemeSwitcher", () => {
  it("renders without crashing", () => {
    render(<ThemeSwitcher />)
  })
})
