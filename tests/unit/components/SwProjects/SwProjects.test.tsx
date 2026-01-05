import { render, screen } from "@testing-library/react"
import { SWProjects } from "components/SwProjects/SwProjects"
import { projects } from "data/swProjects"
import { describe, expect, it } from "vitest"

describe("SWProjects", () => {
  it("renders without crashing", () => {
    render(<SWProjects />)
  })

  it("renders the correct number of project cards", () => {
    render(<SWProjects />)
    const projectCards = screen.getAllByRole("button")
    // Should have 10 project action buttons (8 "View Code" + 2 "Visit Site")
    // Plus 2 theme switcher buttons = 12 total
    expect(projectCards.length).toBe(12)
  })

  it("renders View Code button for projects with githubLink", () => {
    render(<SWProjects />)
    const githubButtons = screen.getAllByText("View Code")
    // All 8 projects have GitHub links
    expect(githubButtons.length).toBe(8)
  })

  it("renders Visit Site button for projects with siteLink", () => {
    render(<SWProjects />)
    const siteButtons = screen.getAllByText("Visit Site")
    // 2 projects have site links (Anna M. Schneider Law and Portfolio Website)
    expect(siteButtons.length).toBe(2)
  })

  it("renders all project names", () => {
    render(<SWProjects />)
    projects.forEach((project) => {
      expect(screen.getByText(project.name)).toBeInTheDocument()
    })
  })
})
