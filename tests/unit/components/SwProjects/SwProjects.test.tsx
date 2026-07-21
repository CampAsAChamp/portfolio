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
    // Should have 13 project action buttons (10 "View Code" + 3 "Visit Site")
    // Plus 2 theme switcher buttons = 15 total
    expect(projectCards.length).toBe(15)
  })

  it("renders View Code button for projects with githubLink", () => {
    render(<SWProjects />)
    const githubButtons = screen.getAllByText("View Code")
    // All 10 projects have GitHub links
    expect(githubButtons.length).toBe(10)
  })

  it("renders Visit Site button for projects with siteLink", () => {
    render(<SWProjects />)
    const siteButtons = screen.getAllByText("Visit Site")
    // 3 projects have site links (Anna M. Schneider Law, Sprint Planner, and Portfolio Website)
    expect(siteButtons.length).toBe(3)
  })

  it("renders all project names", () => {
    render(<SWProjects />)
    projects.forEach((project) => {
      expect(screen.getByText(project.name)).toBeInTheDocument()
    })
  })
})
