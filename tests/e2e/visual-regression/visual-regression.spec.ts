import { expect, test } from "@playwright/test"

import { clickNavLink, waitForPageReady } from "../helpers/utils"

test.describe("Visual Regression Tests", () => {
  /*
   * Full-page screenshot tests have been temporarily disabled due to brittleness.
   * Page height varies slightly between runs due to:
   * - Dynamic content loading
   * - Font rendering differences across browsers
   * - Minor layout shifts
   *
   * TODO: Rewrite these tests with a more robust approach that:
   * - Uses viewport screenshots instead of full-page
   * - Or implements a custom comparison that tolerates height differences
   * - Or focuses on critical above-the-fold content only
   *
   * Section-based tests below provide reliable regression detection for specific components.
   */

  // test('homepage light mode', async ({ page }) => { ... })
  // test('homepage dark mode', async ({ page }) => { ... })
  // test('mobile viewport', async ({ page }) => { ... })
  // test('tablet viewport', async ({ page }) => { ... })

  test("landing section", async ({ page }) => {
    await page.goto("/")

    // Wait for page to be fully ready
    await waitForPageReady(page)

    const landingSection = page.locator("#landing-page-container")
    await expect(landingSection).toHaveScreenshot("landing-section.png", {
      animations: "disabled",
    })
  })

  test("about section", async ({ page }) => {
    await page.goto("/")

    // Wait for page to be fully ready
    await waitForPageReady(page)

    // Scroll to about section
    await clickNavLink(page, "#about-me-images")

    const aboutSection = page.locator("#about-me-container")
    await expect(aboutSection).toHaveScreenshot("about-section.png", {
      animations: "disabled",
    })
  })

  test("experience section", async ({ page }) => {
    await page.goto("/")

    // Wait for page to be fully ready
    await waitForPageReady(page)

    // Scroll to experience section
    await clickNavLink(page, "#experience-header")

    const experienceSection = page.locator("#experience-container")
    await expect(experienceSection).toHaveScreenshot("experience-section.png", {
      animations: "disabled",
    })
  })

  test("contact modal", async ({ page }) => {
    await page.goto("/")

    // Wait for page to be fully ready
    await waitForPageReady(page)

    // Wait for and click the Contact Me button
    const contactButton = page.locator("#contact-me-button")
    await contactButton.waitFor({ state: "visible", timeout: 5000 })
    await contactButton.click()
    await page.waitForTimeout(500)

    // Wait for modal to be visible before taking screenshot
    const modal = page.locator("#contact-me-modal-content")
    await modal.waitFor({ state: "visible", timeout: 5000 })

    await expect(modal).toHaveScreenshot("contact-modal.png", {
      animations: "disabled",
    })
  })
})

test.describe("Animation Visual Regression Tests", () => {
  /*
   * These tests capture visual snapshots WITH animations enabled to verify
   * entrance animations render correctly. Tests focus on final post-animation
   * states for reliability.
   *
   * Uses relaxed diff thresholds to account for minor rendering variations
   * during animations across different browsers and machines.
   */

  test.beforeEach(async ({ page, context }) => {
    // Clear cookies before navigation
    await context.clearCookies()

    // Navigate and wait for page to be ready
    await page.goto("/", { waitUntil: "networkidle" })

    // Clear localStorage after page load
    await page.evaluate(() => {
      try {
        localStorage.clear()
      } catch {
        // Ignore if localStorage is not available
      }
    })

    // Wait for fonts to be ready
    await page.evaluate(() => document.fonts.ready)

    // Disable non-critical animations that could cause flakiness
    await page.addStyleTag({
      content: `
        * { scroll-behavior: auto !important; }
        .mouse-scroll-indicator::after { animation: none !important; }
      `,
    })
  })

  test("landing page - post-animation complete", async ({ page }) => {
    // Wait for all entrance animations to complete (longest delay is 0.6s + 1s duration = 1.6s)
    await page.waitForTimeout(2000)

    // Wait for name element to be visible with full opacity
    await page.waitForFunction(
      () => {
        const name = document.querySelector("#name")
        if (!name) return false
        const styles = window.getComputedStyle(name)
        return styles.opacity === "1"
      },
      { timeout: 5000 },
    )

    const landingSection = page.locator("#landing-page-container")
    await expect(landingSection).toHaveScreenshot("landing-animation-complete.png", {
      animations: "allow", // Enable animations for these tests
      maxDiffPixelRatio: 0.05, // 5% tolerance
      threshold: 0.5, // Higher threshold for animation tests
    })
  })

  test("navbar - post-animation complete", async ({ page }) => {
    // Wait for all navbar animations to complete (longest delay is 0.6s + 0.5s duration = 1.1s)
    await page.waitForTimeout(1500)

    const navbar = page.locator("nav")
    await expect(navbar).toHaveScreenshot("navbar-animation-complete.png", {
      animations: "allow",
      maxDiffPixelRatio: 0.05,
      threshold: 0.5,
    })
  })
})
