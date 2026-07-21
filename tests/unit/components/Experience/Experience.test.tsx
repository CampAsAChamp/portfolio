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

  it("formats completed role durations from structured dates", () => {
    render(<Experience />)

    expect(screen.getByText("Oct 2023 - Jul 2026 (2 yrs 10 mos)")).toBeInTheDocument()
    expect(screen.getByText("Jan 2022 - Oct 2023 (1 yr 10 mos)")).toBeInTheDocument()
  })

  it("shows Intuit roles newest-first", () => {
    render(<Experience />)

    const senior = screen.getByText("Senior Software Engineer")
    const se2 = screen.getByText("Software Engineer 2 - Full Stack")

    expect(senior.compareDocumentPosition(se2) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
})
