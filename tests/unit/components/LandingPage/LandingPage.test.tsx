import { render, screen } from "@testing-library/react"
import { LandingPage } from "components/LandingPage/LandingPage"
import { expectElementHasAnimation } from "tests/unit/helpers/assertions"
import { beforeEach, describe, expect, it } from "vitest"

describe("LandingPage", () => {
  beforeEach(() => {
    render(<LandingPage />)
  })

  it("renders without crashing", () => {
    expect(screen.getByRole("heading", { name: /NICK/i })).toBeInTheDocument()
  })

  it("displays the name", () => {
    expect(screen.getByRole("heading", { name: /NICK/i })).toBeInTheDocument()
  })

  it("displays the contact me button", () => {
    expect(screen.getByRole("button", { name: /Contact Me/i })).toBeInTheDocument()
  })

  describe("Animation Classes", () => {
    it("landing blob has fadeIn animation", () => {
      const blob = document.getElementById("landing-blob")
      expectElementHasAnimation(blob, "animate__fadeIn")
    })

    it("name heading has bounceIn animation", () => {
      const name = document.getElementById("name")
      expectElementHasAnimation(name, "animate__bounceIn")
    })

    it("software engineer title has bounceIn animation", () => {
      const title = document.getElementById("software-engineer")
      expectElementHasAnimation(title, "animate__bounceIn")
    })

    it("subtitle has bounceIn animation", () => {
      const subtitle = document.getElementById("subtitle")
      expectElementHasAnimation(subtitle, "animate__bounceIn")
    })

    it("profile picture has bounceIn animation", () => {
      const profilePic = document.getElementById("profile-pic")
      expectElementHasAnimation(profilePic, "animate__bounceIn")
    })

    it("contact me button has fadeInUp animation", () => {
      const button = document.getElementById("contact-me-button")
      expectElementHasAnimation(button, "animate__fadeInUp")
    })

    it("individual social icons have fadeInUp animation", () => {
      const githubLogo = document.getElementById("github-logo")
      const linkedinLogo = document.getElementById("linkedin-logo")
      expectElementHasAnimation(githubLogo, "animate__fadeInUp")
      expectElementHasAnimation(linkedinLogo, "animate__fadeInUp")
    })

    it("mouse scroll indicator has proper structure", () => {
      const wrapper = document.getElementById("mouse-scroll-indicator-wrapper")
      expect(wrapper).toBeTruthy()
      const indicator = document.getElementById("mouse-scroll-indicator")
      expect(indicator).toBeTruthy()
    })
  })
})
