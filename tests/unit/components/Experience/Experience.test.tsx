import { render, screen } from "@testing-library/react"
import { Experience } from "components/Experience/Experience"
import { describe, expect, it } from "vitest"

describe("Experience", () => {
  it("renders without crashing", () => {
    render(<Experience />)
  })

  it("shows both Intuit roles on the first card", () => {
    render(<Experience />)

    expect(screen.getByText("Senior Software Engineer")).toBeInTheDocument()
    expect(screen.getByText("Software Engineer 2 - Full Stack")).toBeInTheDocument()
  })
})
