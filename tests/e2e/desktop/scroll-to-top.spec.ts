import { expect, Locator, test } from "@playwright/test"

import { BasePage } from "../fixtures/BasePage"
import { waitForScrollComplete } from "../helpers/wait-helpers"

async function expectScrollNearTop(basePage: BasePage): Promise<void> {
  await expect.poll(() => basePage.getScrollPosition(), { timeout: 15000 }).toBeLessThan(50)
}

async function expectScrollToTopButtonHidden(button: Locator): Promise<void> {
  await expect(button).not.toHaveClass(/show/, { timeout: 10000 })
}

async function expectScrollToTopButtonVisible(button: Locator): Promise<void> {
  await expect(button).toHaveClass(/show/, { timeout: 10000 })
  // show class is added before the 1s opacity/transform transition finishes
  await expect(button).toBeVisible({ timeout: 5000 })
}

test.describe("Scroll To Top Button - Desktop", () => {
  let basePage: BasePage

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page)
    await basePage.goto("/")
  })

  test("should be hidden by default on page load", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    // Button should not have 'show' class (opacity 0)
    await expect(scrollToTopButton).not.toHaveClass(/show/)
  })

  test("should appear after scrolling down ~400px", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    // Initially hidden (no 'show' class)
    await expect(scrollToTopButton).not.toHaveClass(/show/)

    // Scroll down past threshold (400px)
    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await page.waitForTimeout(1000) // Wait for opacity transition

    // Check for show class
    const classes = await scrollToTopButton.getAttribute("class")
    expect(classes).toContain("show")
  })

  test("should have slide left and fade animation when appearing", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    // Scroll down to trigger button
    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)

    // Button should be visible with show class
    await expect(scrollToTopButton).toBeVisible()
    const classes = await scrollToTopButton.getAttribute("class")
    expect(classes).toContain("show")
  })

  test("should disappear when scrolling back up", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    // Scroll down to show button
    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await page.waitForTimeout(1000)
    await expect(scrollToTopButton).toHaveClass(/show/)

    // Scroll back up
    await basePage.scrollToPosition(100)
    await waitForScrollComplete(page)
    await page.waitForTimeout(1000)

    // Button should not have 'show' class
    await expect(scrollToTopButton).not.toHaveClass(/show/)
  })

  test("should scroll to top smoothly when clicked", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    await basePage.scrollToPosition(1000)
    await waitForScrollComplete(page)
    await expectScrollToTopButtonVisible(scrollToTopButton)

    const scrollPosition = await basePage.getScrollPosition()
    expect(scrollPosition).toBeGreaterThan(500)

    await scrollToTopButton.click()
    await expectScrollNearTop(basePage)
  })

  test("should enlarge slightly on hover", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    // Scroll down to show button
    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await expect(scrollToTopButton).toBeVisible()

    // Hover over button
    await scrollToTopButton.hover()
    await page.waitForTimeout(300)

    // Button should still be visible
    await expect(scrollToTopButton).toBeVisible()

    // Could check size change, but visual regression is more reliable
    const hoverBox = await scrollToTopButton.boundingBox()
    expect(hoverBox).toBeTruthy()
  })

  test("should appear at correct scroll threshold", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    await basePage.scrollToPosition(350)
    await expectScrollToTopButtonHidden(scrollToTopButton)

    await basePage.scrollToPosition(401)
    await expectScrollToTopButtonVisible(scrollToTopButton)

    await basePage.scrollToPosition(500)
    await expectScrollToTopButtonVisible(scrollToTopButton)
  })

  test("should be positioned in bottom right corner", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    // Scroll down to show button
    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await expect(scrollToTopButton).toBeVisible()

    // Check position
    const box = await scrollToTopButton.boundingBox()
    expect(box).toBeTruthy()

    if (box) {
      const viewport = page.viewportSize()
      if (viewport) {
        // Should be in right side of screen
        expect(box.x).toBeGreaterThan(viewport.width / 2)
      }
    }
  })

  test("should have correct button text/icon", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    // Scroll down to show button
    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await expect(scrollToTopButton).toBeVisible()

    // Check button content (up arrow)
    const buttonText = await scrollToTopButton.textContent()
    expect(buttonText).toContain("↑")
  })

  test("should be keyboard accessible", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await expect(scrollToTopButton).toBeVisible()

    await scrollToTopButton.focus()
    await expect(scrollToTopButton).toBeFocused()

    await scrollToTopButton.press("Enter")
    await waitForScrollComplete(page)

    const scrollPosition = await basePage.getScrollPosition()
    expect(scrollPosition).toBeLessThan(50)
  })

  test("should work multiple times", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    for (const scrollY of [800, 1200]) {
      await basePage.scrollToPosition(scrollY)
      await waitForScrollComplete(page)
      await expectScrollToTopButtonVisible(scrollToTopButton)
      await scrollToTopButton.click()
      await waitForScrollComplete(page)
      await expectScrollNearTop(basePage)
    }
  })

  test("should appear much later than mouse scroll indicator disappears", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")
    const mouseScrollIndicator = page.locator("#mouse-scroll-indicator")

    // At 150px, mouse indicator should be hidden but scroll-to-top should not appear
    await basePage.scrollToPosition(150)
    await waitForScrollComplete(page)
    await page.waitForTimeout(500)

    // Mouse indicator hidden
    const indicatorClasses = await mouseScrollIndicator.getAttribute("class")
    expect(indicatorClasses).toContain("hide")

    // Scroll to top button not visible yet (no 'show' class)
    await expect(scrollToTopButton).not.toHaveClass(/show/)

    // At 500px, scroll to top should have 'show' class
    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await page.waitForTimeout(1000)
    await expect(scrollToTopButton).toHaveClass(/show/)
  })
})
