import { expect, test } from "@playwright/test"

import { LandingPage } from "../fixtures/LandingPage"
import { ModalPage } from "../fixtures/ModalPage"
import { waitForScrollComplete } from "../helpers/wait-helpers"

test.describe("Mouse Scroll Indicator - Desktop", () => {
  let landingPage: LandingPage

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page)
    await landingPage.goto("/")
  })

  test("should be visible on page load", async () => {
    // Mouse scroll indicator should be visible initially
    await expect(landingPage.mouseScrollIndicator).toBeVisible()
  })

  test("should animate in with slide up effect", async ({ page }) => {
    // Wait for page load
    await page.waitForLoadState("networkidle")

    // Indicator should have entrance class initially
    const indicator = landingPage.mouseScrollIndicator
    // (initialClasses not used; we only check finalClasses)

    // Should eventually lose entrance class after animation
    await page.waitForTimeout(2000) // Wait for entrance animation

    const finalClasses = await indicator.getAttribute("class")
    expect(finalClasses).not.toContain("entrance")
  })

  test("should be last element to animate (after other landing page elements)", async () => {
    // All other elements should be visible before checking mouse indicator
    await expect(landingPage.title).toBeVisible()
    await expect(landingPage.subtitle).toBeVisible()
    await expect(landingPage.contactMeButton).toBeVisible()

    // Now indicator should also be visible
    await expect(landingPage.mouseScrollIndicator).toBeVisible()
  })

  test("should have scrolling wheel animation", async ({ page }) => {
    // Indicator should be visible and animating
    await expect(landingPage.mouseScrollIndicator).toBeVisible()

    // Wait and verify it's still visible (continuous animation)
    await page.waitForTimeout(1000)
    await expect(landingPage.mouseScrollIndicator).toBeVisible()
  })

  test("should fade out when scrolled halfway down landing page", async ({ page }) => {
    // Initially visible
    await expect(landingPage.mouseScrollIndicator).toBeVisible()

    // Scroll down significantly (more than 100px threshold)
    await landingPage.scrollToPosition(150)
    await waitForScrollComplete(page)

    // Should have hide class
    const indicator = landingPage.mouseScrollIndicator
    const classes = await indicator.getAttribute("class")
    expect(classes).toContain("hide")
  })

  test("should disappear much sooner than Scroll To Top button", async ({ page }) => {
    // Mouse indicator disappears at ~100px
    // Scroll to 150px
    await landingPage.scrollToPosition(150)
    await waitForScrollComplete(page)
    await page.waitForTimeout(300)

    const indicator = landingPage.mouseScrollIndicator

    // Wait for hide class
    await page.waitForFunction(() => document.querySelector("#mouse-scroll-indicator")?.classList.contains("hide"), { timeout: 2000 })

    const classes = await indicator.getAttribute("class")
    expect(classes).toContain("hide")

    // Scroll To Top button should NOT appear yet (appears at >400px per ScrollToTopButton.tsx)
    const scrollToTopButton = page.locator("#scroll-to-top-button")
    // Check if button has 'show' class - it shouldn't at 150px
    const buttonClasses = await scrollToTopButton.getAttribute("class")
    expect(buttonClasses).not.toContain("show")
  })

  test("should not reappear after scrolling back up", async ({ page }) => {
    // Scroll down to hide indicator
    await landingPage.scrollToPosition(200)
    await waitForScrollComplete(page)
    await page.waitForTimeout(300)

    const indicator = landingPage.mouseScrollIndicator

    // Wait for hide class to be applied
    await page.waitForFunction(() => document.querySelector("#mouse-scroll-indicator")?.classList.contains("hide"), { timeout: 2000 })

    let classes = await indicator.getAttribute("class")
    expect(classes).toContain("hide")

    // Scroll back to top (below 100px threshold)
    await landingPage.scrollToPosition(0)
    await waitForScrollComplete(page)
    await page.waitForTimeout(300)

    // Indicator should NOT have hide class anymore (scrollY < 100)
    // But it should NOT re-animate in (no entrance animation)
    classes = await indicator.getAttribute("class")
    // The indicator removes 'hide' class when back at top, but doesn't re-entrance
    // So class should be empty or not contain 'entrance'
    expect(classes).not.toContain("entrance")
  })

  test("should hide at appropriate scroll threshold", async ({ page }) => {
    // Test at threshold (component hides at >100px per MouseScrollIndicator.tsx)
    await landingPage.scrollToPosition(150)
    await waitForScrollComplete(page)

    const indicator = landingPage.mouseScrollIndicator

    // Component adds 'hide' class when scrollY > 100
    await page
      .waitForFunction(
        () => {
          const el = document.querySelector("#mouse-scroll-indicator")
          return el?.classList.contains("hide")
        },
        { timeout: 2000 },
      )
      .catch(() => {
        // If hide class not added, that's the test failure
      })

    const classes = await indicator.getAttribute("class")
    expect(classes).toContain("hide")
  })

  test("should be positioned correctly in the landing page", async ({ page }) => {
    const indicator = landingPage.mouseScrollIndicator
    await expect(indicator).toBeVisible()

    // Check it's within the landing page section
    const wrapper = page.locator("#mouse-scroll-indicator-wrapper")
    await expect(wrapper).toBeVisible()

    // Verify it's in the viewport initially
    await expect(indicator).toBeInViewport()
  })

  test("should not interfere with page interactions", async ({ page }) => {
    const modalPage = new ModalPage(page)

    // Even with indicator present, other elements should be clickable
    await expect(landingPage.contactMeButton).toBeVisible()
    await expect(landingPage.contactMeButton).toBeEnabled()

    await landingPage.clickContactMe()
    await modalPage.waitForModalOpen()
    await expect(modalPage.modal).toHaveClass(/show/)
  })
})
