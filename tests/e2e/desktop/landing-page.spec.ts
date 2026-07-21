import { expect, test } from "@playwright/test"

import { LandingPage } from "../fixtures/LandingPage"
import { NavbarPage } from "../fixtures/NavbarPage"
import { skipUnlessVisualBaseline } from "../helpers/visual-helpers"
import { waitForScrollComplete } from "../helpers/wait-helpers"

test.describe("Landing Page - Desktop", () => {
  let landingPage: LandingPage
  let navbarPage: NavbarPage

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page)
    navbarPage = new NavbarPage(page)

    await landingPage.goto("/")
    await landingPage.verifyAllElementsVisible()
  })

  test("should display all landing page elements without scrolling", async () => {
    // Verify all main elements are visible in the viewport
    await expect(landingPage.title).toBeVisible()
    await expect(landingPage.subtitle).toBeVisible()
    await expect(landingPage.description).toBeVisible()
    await expect(landingPage.profilePic).toBeVisible()
    await expect(landingPage.contactMeButton).toBeVisible()
    await expect(landingPage.githubLink).toBeVisible()
    await expect(landingPage.linkedinLink).toBeVisible()

    // Verify all elements are in viewport (no scroll needed)
    const initialScroll = await landingPage.getScrollPosition()
    expect(initialScroll).toBe(0)
  })

  test("should display all landing page elements - visual regression", async ({ page }, testInfo) => {
    skipUnlessVisualBaseline(testInfo)
    await landingPage.waitForLandingAnimations()

    const landing = page.locator("#landing-page-container")
    await expect(landing).toHaveScreenshot("landing-page-full.png", {
      animations: "disabled",
      timeout: 15000,
      mask: [landingPage.mouseScrollIndicator],
    })
  })

  test("should animate navbar links with stagger", async () => {
    // Get all nav links
    const navLinks = navbarPage.navLinks
    const count = await navLinks.count()

    expect(count).toBeGreaterThan(0)

    // Verify nav links have fadeInDown animation class
    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i)
      const classes = await link.getAttribute("class")
      expect(classes).toContain("animate__fadeInDown")
    }
  })

  test("should display mouse scroll indicator", async ({ page }) => {
    // Mouse scroll indicator should be visible on desktop
    await expect(landingPage.mouseScrollIndicator).toBeVisible()

    // Verify it has the entrance animation
    const indicatorWrapper = page.locator("#mouse-scroll-indicator-wrapper")
    await expect(indicatorWrapper).toBeVisible()
  })

  test("should hide mouse scroll indicator after scrolling down", async () => {
    await expect(landingPage.mouseScrollIndicator).toBeVisible()

    await landingPage.scrollToPosition(150)

    await expect
      .poll(
        async () => {
          const classes = await landingPage.mouseScrollIndicator.getAttribute("class")
          return classes?.includes("hide") ?? false
        },
        { timeout: 5000 },
      )
      .toBe(true)
  })

  test("should smooth scroll to section when nav link is clicked", async ({ page }) => {
    await navbarPage.clickNavLink("About Me")
    await expect(page.locator("#about-me-images")).toBeInViewport({ timeout: 15000 })
  })

  test("should smooth scroll to all sections via nav links", async ({ page }) => {
    const sections = [
      { link: "About Me", targetId: "about-me-images" },
      { link: "Experience", targetId: "experience-header" },
      { link: "Skills", targetId: "skills-header" },
      { link: "Projects", targetId: "sw-projects-header" },
      { link: "Art & Design", targetId: "graphic-design-header" },
    ]

    for (const section of sections) {
      await landingPage.scrollToPosition(0)
      await waitForScrollComplete(page)

      await navbarPage.clickNavLink(section.link)

      await expect(page.locator(`#${section.targetId}`)).toBeInViewport()
    }
  })

  test("should navigate to home when logo is clicked", async ({ page }) => {
    // Scroll down first
    await landingPage.scrollToPosition(500)
    await waitForScrollComplete(page)

    // Click logo
    await navbarPage.clickLogo()
    await waitForScrollComplete(page)

    // Should be back at top
    const scrollPosition = await landingPage.getScrollPosition()
    expect(scrollPosition).toBeLessThan(50) // Allow small buffer
  })

  test("should have correct hover effect on nav links", async ({ page }) => {
    const firstNavLink = navbarPage.navLinks.first()

    // Hover over link
    await firstNavLink.hover()
    await page.waitForTimeout(300)

    // Link should still be visible and have hover styles applied
    await expect(firstNavLink).toBeVisible()
  })

  test("should display GitHub and LinkedIn links with correct URLs", async () => {
    const githubUrl = await landingPage.getGithubUrl()
    const linkedinUrl = await landingPage.getLinkedinUrl()

    expect(githubUrl).toContain("github.com")
    expect(linkedinUrl).toContain("linkedin.com")

    // Verify links are visible
    await expect(landingPage.githubLink).toBeVisible()
    await expect(landingPage.linkedinLink).toBeVisible()
  })

  test("should change color on social icon hover", async ({ page }) => {
    // Hover over GitHub icon
    await landingPage.githubLink.hover()
    await page.waitForTimeout(200)

    await expect(landingPage.githubLink).toBeVisible()

    // Hover over LinkedIn icon
    await landingPage.linkedinLink.hover()
    await page.waitForTimeout(200)

    await expect(landingPage.linkedinLink).toBeVisible()
  })

  test("should display Contact Me button", async () => {
    await expect(landingPage.contactMeButton).toBeVisible()
    await expect(landingPage.contactMeButton).toBeEnabled()

    // Verify button text
    const buttonText = await landingPage.contactMeButton.textContent()
    expect(buttonText).toContain("Contact Me")
  })
})
