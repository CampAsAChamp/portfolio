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
    // Should have 19 project action buttons (15 "View Code" + 4 "Visit Site")
    // Plus 2 theme switcher buttons = 21 total
    expect(projectCards.length).toBe(21)
  })

  it("renders View Code button for projects with githubLink", () => {
    render(<SWProjects />)
    const githubButtons = screen.getAllByText("View Code")
    // All 15 projects have GitHub links
    expect(githubButtons.length).toBe(15)
  })

  it("renders Visit Site button for projects with siteLink", () => {
    render(<SWProjects />)
    const siteButtons = screen.getAllByText("Visit Site")
    // 4 projects have site links (Anna M. Schneider Law, Sprint Planner, Portfolio Website, SDGE Rate Checker)
    expect(siteButtons.length).toBe(4)
  })

  it("renders all project names", () => {
    render(<SWProjects />)
    projects.forEach((project) => {
      expect(screen.getByText(project.name)).toBeInTheDocument()
    })
  })
})
