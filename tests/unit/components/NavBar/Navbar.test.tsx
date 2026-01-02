import { render, screen } from "@testing-library/react"
import { Navbar } from "components/NavBar/Navbar"
import { expectElementHasAnimation } from "tests/unit/helpers/assertions"
import { beforeEach, describe, expect, it } from "vitest"

describe("Navbar", () => {
  beforeEach(() => {
    render(<Navbar />)
  })

  it("renders without crashing", () => {
    expect(screen.getByText(/About Me/i)).toBeInTheDocument()
  })

  it("displays navigation links", () => {
    expect(screen.getByText(/About Me/i)).toBeInTheDocument()
    expect(screen.getByText(/Experience/i)).toBeInTheDocument()
    expect(screen.getByText(/Skills/i)).toBeInTheDocument()
    expect(screen.getByText(/Projects/i)).toBeInTheDocument()
    expect(screen.getByText(/Art & Design/i)).toBeInTheDocument()
  })

  describe("Animation Classes", () => {
    it("logo link has fadeInDown animation", () => {
      const logoLink = document.querySelector('a[href="/"]')
      expectElementHasAnimation(logoLink as HTMLElement, "animate__fadeInDown")
    })

    it("all nav list items have nav-link-entrance class", () => {
      const navItems = document.querySelectorAll("nav ul li")
      expect(navItems.length).toBeGreaterThan(0)

      navItems.forEach((item) => {
        expect(item.classList.contains("nav-link-entrance")).toBe(true)
      })
    })

    it("all nav list items have fadeInDown animation", () => {
      const navItems = document.querySelectorAll("nav ul li")
      expect(navItems.length).toBeGreaterThan(0)

      navItems.forEach((item) => {
        expectElementHasAnimation(item as HTMLElement, "animate__fadeInDown")
      })
    })
  })
})
