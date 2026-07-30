import { render, screen } from "@testing-library/react"
import { SWProjects } from "components/SwProjects/SwProjects"
import { projects } from "data/swProjects"
import { describe, expect, it } from "vitest"

describe("SWProjects", () => {
  const projectsWithGithub = projects.filter((project) => project.githubLink)
  const projectsWithSite = projects.filter((project) => project.siteLink)

  it("renders without crashing", () => {
    render(<SWProjects />)
  })

  it("renders the correct number of project cards", () => {
    render(<SWProjects />)
    const projectCards = screen.getAllByRole("button")
    expect(projectCards.length).toBe(projectsWithGithub.length + projectsWithSite.length)
  })

  it("renders View Code button for projects with githubLink", () => {
    render(<SWProjects />)
    const githubButtons = screen.getAllByText("View Code")
    expect(githubButtons.length).toBe(projectsWithGithub.length)
  })

  it("renders Visit Site button for projects with siteLink", () => {
    render(<SWProjects />)
    const siteButtons = screen.getAllByText("Visit Site")
    expect(siteButtons.length).toBe(projectsWithSite.length)
  })

  it("renders all project names", () => {
    render(<SWProjects />)
    projects.forEach((project) => {
      expect(screen.getByText(project.name)).toBeInTheDocument()
    })
  })
})
