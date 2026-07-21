import { Locator } from "@playwright/test"

import { BasePage } from "../fixtures/BasePage"
import { expect, test } from "../fixtures/test"
import { waitForScrollComplete } from "../helpers/wait-helpers"

async function expectScrollNearTop(basePage: BasePage): Promise<void> {
  await expect.poll(() => basePage.getScrollPosition(), { timeout: 15000 }).toBeLessThan(50)
}

async function expectScrollToTopButtonHidden(button: Locator): Promise<void> {
  await expect(button).not.toHaveClass(/show/, { timeout: 10000 })
}

async function expectScrollToTopButtonVisible(button: Locator): Promise<void> {
  await expect(button).toHaveClass(/show/, { timeout: 10000 })
  await expect(button).toBeVisible({ timeout: 5000 })
}

test.describe("Scroll To Top Button - Desktop", () => {
  let basePage: BasePage

  test.beforeEach(async ({ page }, testInfo) => {
    // WebKit headless frequently wedges on programmatic scroll with a tall page under
    // parallel load; Chromium + Firefox still cover scroll-to-top behavior.
    test.skip(testInfo.project.name === "webkit", "WebKit headless stalls on programmatic scroll")
    basePage = new BasePage(page)
    await basePage.goto("/")
  })

  test("should be hidden by default on page load", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")
    await expectScrollToTopButtonHidden(scrollToTopButton)
  })

  test("should appear after scrolling past threshold and scroll to top when clicked", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    await expectScrollToTopButtonHidden(scrollToTopButton)

    // Below threshold (~400px) stays hidden; above becomes visible
    await basePage.scrollToPosition(350)
    await waitForScrollComplete(page)
    await expectScrollToTopButtonHidden(scrollToTopButton)

    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await expectScrollToTopButtonVisible(scrollToTopButton)

    await scrollToTopButton.click()
    await expectScrollNearTop(basePage)
  })

  test("should disappear when scrolling back up", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await expectScrollToTopButtonVisible(scrollToTopButton)

    await basePage.scrollToPosition(100)
    await waitForScrollComplete(page)
    await expectScrollToTopButtonHidden(scrollToTopButton)
  })

  test("should enlarge slightly on hover", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await expectScrollToTopButtonVisible(scrollToTopButton)

    await scrollToTopButton.hover()
    await expect(scrollToTopButton).toBeVisible()
    expect(await scrollToTopButton.boundingBox()).toBeTruthy()
  })

  test("should be positioned in bottom right corner", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await expectScrollToTopButtonVisible(scrollToTopButton)

    const box = await scrollToTopButton.boundingBox()
    expect(box).toBeTruthy()

    if (box) {
      const viewport = page.viewportSize()
      if (viewport) {
        expect(box.x).toBeGreaterThan(viewport.width / 2)
      }
    }
  })

  test("should have correct button text/icon", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await expectScrollToTopButtonVisible(scrollToTopButton)

    const buttonText = await scrollToTopButton.textContent()
    expect(buttonText).toContain("↑")
  })

  test("should be keyboard accessible", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await expectScrollToTopButtonVisible(scrollToTopButton)

    await scrollToTopButton.focus()
    await expect(scrollToTopButton).toBeFocused()

    await scrollToTopButton.press("Enter")
    await expectScrollNearTop(basePage)
  })

  test("should work multiple times", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    for (const scrollY of [800, 1200]) {
      await basePage.scrollToPosition(scrollY)
      await waitForScrollComplete(page)
      await expectScrollToTopButtonVisible(scrollToTopButton)
      await scrollToTopButton.click()
      await expectScrollNearTop(basePage)
    }
  })

  test("should appear much later than mouse scroll indicator disappears", async ({ page }) => {
    const scrollToTopButton = page.locator("#scroll-to-top-button")
    const mouseScrollIndicator = page.locator("#mouse-scroll-indicator")

    await basePage.scrollToPosition(150)
    await waitForScrollComplete(page)

    await expect.poll(async () => mouseScrollIndicator.getAttribute("class"), { timeout: 5000, intervals: [50, 100, 200] }).toMatch(/hide/)
    await expectScrollToTopButtonHidden(scrollToTopButton)

    await basePage.scrollToPosition(500)
    await waitForScrollComplete(page)
    await expectScrollToTopButtonVisible(scrollToTopButton)
  })
})
