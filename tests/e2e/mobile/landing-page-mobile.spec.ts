import { expect, test } from "@playwright/test"

import { LandingPage } from "../fixtures/LandingPage"
import { NavbarPage } from "../fixtures/NavbarPage"
import { skipUnlessVisualBaseline } from "../helpers/visual-helpers"

test.describe("Landing Page - Mobile", () => {
  let landingPage: LandingPage
  let navbarPage: NavbarPage

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page)
    navbarPage = new NavbarPage(page)

    // Prefer a second navigation over page.reload() — WebKit occasionally crashes on reload in CI
    await landingPage.clearStorageAndGoto("/")
    // Mobile Safari CI can paint a blank frame before React mounts — wait for chrome to exist.
    await expect(navbarPage.hamburgerButton).toBeVisible({ timeout: 15000 })
  })

  test("should transform navbar to hamburger menu", async () => {
    await expect(navbarPage.hamburgerButton).toBeVisible()

    const isNavbarMobile = await navbarPage.isNavbarMobile()
    expect(isNavbarMobile).toBe(true)
  })

  test("should open drawer when hamburger is clicked", async () => {
    // Click hamburger
    await navbarPage.openHamburgerMenu()

    // Drawer should be visible
    expect(await navbarPage.isHamburgerMenuOpen()).toBe(true)
  })

  test("should slide drawer from right side", async () => {
    // Open hamburger menu
    await navbarPage.openHamburgerMenu()

    // Drawer should be visible
    await expect(navbarPage.mobileDrawer).toBeVisible()
  })

  test("should morph hamburger to X when opened", async ({ page }) => {
    await navbarPage.openHamburgerMenu()

    await expect
      .poll(
        async () => {
          const classes = await page.locator(".hamburger-menu").getAttribute("class")
          return classes?.includes("toggle") ?? false
        },
        { timeout: 5000 },
      )
      .toBe(true)
  })

  test("should show nav links when menu is open", async ({ page }) => {
    await navbarPage.openHamburgerMenu()

    const navLinks = page.locator("nav ul li")
    expect(await navLinks.count()).toBeGreaterThan(0)
    await expect(navLinks.first()).toBeVisible()
  })

  test("should close drawer when X is clicked", async () => {
    // Open menu
    await navbarPage.openHamburgerMenu()
    expect(await navbarPage.isHamburgerMenuOpen()).toBe(true)

    // Close menu
    await navbarPage.closeHamburgerMenu()
    expect(await navbarPage.isHamburgerMenuOpen()).toBe(false)
  })

  test("should close drawer and scroll when nav link is clicked", async ({ page }) => {
    await navbarPage.openHamburgerMenu()
    expect(await navbarPage.isHamburgerMenuOpen()).toBe(true)

    await navbarPage.clickNavLink("About Me")

    await page.waitForFunction(() => {
      const nav = document.querySelector("nav ul")
      return !nav?.classList.contains("nav-active")
    })

    expect(await navbarPage.isHamburgerMenuOpen()).toBe(false)
    await expect(page.locator("#about-me-images")).toBeInViewport()
  })

  test("should keep theme switcher functional", async () => {
    await navbarPage.openHamburgerMenu()
    await expect(navbarPage.themeSwitcher).toBeVisible()

    const initialTheme = await navbarPage.getCurrentTheme()
    await navbarPage.toggleTheme()

    await expect.poll(async () => navbarPage.getCurrentTheme(), { timeout: 5000, intervals: [50, 100, 200] }).not.toBe(initialTheme)
  })

  test("should have profile pic as center element", async ({ page }) => {
    // Profile pic should be visible
    await expect(landingPage.profilePic).toBeVisible()

    // Get profile pic position
    const profileBox = await landingPage.profilePic.boundingBox()
    expect(profileBox).toBeTruthy()

    if (profileBox) {
      const viewport = page.viewportSize()
      if (viewport) {
        // Profile pic should be reasonably centered horizontally
        const centerX = profileBox.x + profileBox.width / 2
        const viewportCenterX = viewport.width / 2

        // Allow some tolerance
        expect(Math.abs(centerX - viewportCenterX)).toBeLessThan(viewport.width * 0.3)
      }
    }
  })

  test("should display elements in correct order: Navbar, Text, Contact Me Bar", async ({ page }) => {
    // Get positions of elements
    const navbarBox = await navbarPage.navbar.boundingBox()
    const titleBox = await landingPage.title.boundingBox()
    const contactBarBox = await page.locator("#contact-me-bar").boundingBox()

    expect(navbarBox).toBeTruthy()
    expect(titleBox).toBeTruthy()
    expect(contactBarBox).toBeTruthy()

    if (navbarBox && titleBox && contactBarBox) {
      // Navbar should be at top
      expect(navbarBox.y).toBeLessThan(titleBox.y)

      // Contact bar should be below title
      expect(contactBarBox.y).toBeGreaterThan(titleBox.y)
    }
  })

  test("should not display mouse scroll indicator", async () => {
    // Mouse scroll indicator should not be visible on mobile
    const indicator = landingPage.mouseScrollIndicator
    const isVisible = await indicator.isVisible().catch(() => false)

    // Should be hidden or not rendered
    expect(isVisible).toBe(false)
  })

  test("should display all landing page content", async () => {
    await expect(landingPage.title).toBeVisible()
    await expect(landingPage.subtitle).toBeVisible()
    await expect(landingPage.profilePic).toBeVisible()
    await expect(landingPage.contactMeButton).toBeVisible()
    await expect(landingPage.githubLink).toBeVisible()
    await expect(landingPage.linkedinLink).toBeVisible()
  })

  test("should display mobile landing page - visual regression", async ({ page }, testInfo) => {
    skipUnlessVisualBaseline(testInfo)
    const landing = page.locator("#landing-page-container")
    await expect(landing).toHaveScreenshot("landing-page-mobile.png", { animations: "disabled", timeout: 15000 })
  })

  test("should have proper mobile layout", ({ page }) => {
    // Verify viewport is mobile size
    const viewport = page.viewportSize()
    expect(viewport).toBeTruthy()

    if (viewport) {
      expect(viewport.width).toBeLessThan(768)
    }
  })

  test("should display hamburger menu - visual regression", async ({ page }, testInfo) => {
    skipUnlessVisualBaseline(testInfo)
    await navbarPage.openHamburgerMenu()
    const navMenu = page.locator("nav ul")
    await expect(navMenu).toHaveScreenshot("hamburger-menu-open-mobile.png", { animations: "disabled", timeout: 15000 })
  })

  test("should handle rapid menu toggles", async () => {
    for (let i = 0; i < 3; i++) {
      await navbarPage.openHamburgerMenu()
      await navbarPage.closeHamburgerMenu()
    }

    expect(await navbarPage.isHamburgerMenuOpen()).toBe(false)
  })
})
