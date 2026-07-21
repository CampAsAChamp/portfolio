import { LandingPage } from "../fixtures/LandingPage"
import { ModalPage } from "../fixtures/ModalPage"
import { expect, test } from "../fixtures/test"
import { waitForScrollComplete } from "../helpers/wait-helpers"

test.describe("Mouse Scroll Indicator - Desktop", () => {
  let landingPage: LandingPage

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page)
    await landingPage.goto("/")
  })

  test("should be visible on page load", async () => {
    await expect(landingPage.mouseScrollIndicator).toBeVisible()
    await expect(landingPage.mouseScrollIndicator).toBeInViewport()
  })

  test("should be visible after other landing page elements", async () => {
    await expect(landingPage.title).toBeVisible()
    await expect(landingPage.subtitle).toBeVisible()
    await expect(landingPage.contactMeButton).toBeVisible()
    await expect(landingPage.mouseScrollIndicator).toBeVisible()
  })

  test("should hide after scrolling and stay without re-entrance when returning to top", async ({ page }) => {
    await expect(landingPage.mouseScrollIndicator).toBeVisible()

    await landingPage.scrollToPosition(150)
    await waitForScrollComplete(page)

    await expect
      .poll(async () => landingPage.mouseScrollIndicator.getAttribute("class"), {
        timeout: 5000,
        intervals: [50, 100, 200],
      })
      .toMatch(/hide/)

    // Hidden well before scroll-to-top appears (~400px)
    const scrollToTopButton = page.locator("#scroll-to-top-button")
    await expect(scrollToTopButton).not.toHaveClass(/show/)

    await landingPage.scrollToPosition(0)
    await waitForScrollComplete(page)
    await expect(landingPage.mouseScrollIndicator).not.toHaveClass(/entrance/)
  })

  test("should be positioned correctly in the landing page", async ({ page }) => {
    const indicator = landingPage.mouseScrollIndicator
    await expect(indicator).toBeVisible()

    const wrapper = page.locator("#mouse-scroll-indicator-wrapper")
    await expect(wrapper).toBeVisible()
    await expect(indicator).toBeInViewport()
  })

  test("should not interfere with page interactions", async ({ page }) => {
    const modalPage = new ModalPage(page)

    await expect(landingPage.contactMeButton).toBeVisible()
    await expect(landingPage.contactMeButton).toBeEnabled()

    await landingPage.clickContactMe()
    await modalPage.waitForModalOpen()
    expect(await modalPage.isModalOpen()).toBe(true)
  })
})
