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
    await page.waitForLoadState("networkidle")

    const indicator = landingPage.mouseScrollIndicator
    await expect(indicator).toBeVisible()

    // Entrance class is removed after the intro animation finishes
    await expect(indicator).not.toHaveClass(/entrance/, { timeout: 5000 })
  })

  test("should be last element to animate (after other landing page elements)", async () => {
    // All other elements should be visible before checking mouse indicator
    await expect(landingPage.title).toBeVisible()
    await expect(landingPage.subtitle).toBeVisible()
    await expect(landingPage.contactMeButton).toBeVisible()

    // Now indicator should also be visible
    await expect(landingPage.mouseScrollIndicator).toBeVisible()
  })

  test("should have scrolling wheel animation", async () => {
    await expect(landingPage.mouseScrollIndicator).toBeVisible()
    await expect(landingPage.mouseScrollIndicator).toBeInViewport()
  })

  test("should fade out when scrolled halfway down landing page", async ({ page }) => {
    await expect(landingPage.mouseScrollIndicator).toBeVisible()

    await landingPage.scrollToPosition(150)
    await waitForScrollComplete(page)

    await expect(landingPage.mouseScrollIndicator).toHaveClass(/hide/)
  })

  test("should disappear much sooner than Scroll To Top button", async ({ page }) => {
    await landingPage.scrollToPosition(150)
    await waitForScrollComplete(page)

    await expect(landingPage.mouseScrollIndicator).toHaveClass(/hide/)

    // Scroll To Top button should NOT appear yet (appears at >400px per ScrollToTopButton.tsx)
    const scrollToTopButton = page.locator("#scroll-to-top-button")
    await expect(scrollToTopButton).not.toHaveClass(/show/)
  })

  test("should not reappear after scrolling back up", async ({ page }) => {
    await landingPage.scrollToPosition(200)
    await waitForScrollComplete(page)

    await expect(landingPage.mouseScrollIndicator).toHaveClass(/hide/)

    await landingPage.scrollToPosition(0)
    await waitForScrollComplete(page)

    // Indicator removes 'hide' at top but does not re-run entrance animation
    await expect(landingPage.mouseScrollIndicator).not.toHaveClass(/entrance/)
  })

  test("should hide at appropriate scroll threshold", async ({ page }) => {
    await landingPage.scrollToPosition(150)
    await waitForScrollComplete(page)

    await expect(landingPage.mouseScrollIndicator).toHaveClass(/hide/)
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
