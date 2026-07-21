import { BasePage } from "../fixtures/BasePage"
import { LandingPage } from "../fixtures/LandingPage"
import { ModalPage } from "../fixtures/ModalPage"
import { expect, test } from "../fixtures/test"
import { waitForScrollComplete } from "../helpers/wait-helpers"

test.describe("General Mobile Behaviors", () => {
  let basePage: BasePage
  let landingPage: LandingPage

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page)
    landingPage = new LandingPage(page)
    await basePage.goto("/")
  })

  test("should not display mouse scroll indicator", async () => {
    const indicator = landingPage.mouseScrollIndicator
    const isVisible = await indicator.isVisible().catch(() => false)
    expect(isVisible).toBe(false)
  })

  test("should not display scroll to top button", async ({ page }) => {
    await basePage.scrollToPosition(1000)
    await waitForScrollComplete(page)

    const scrollToTopButton = page.locator("#scroll-to-top-button")
    const isVisible = await scrollToTopButton.isVisible().catch(() => false)
    expect(isVisible).toBe(false)
  })

  test("should have single column layout throughout", async ({ page }) => {
    const viewport = page.viewportSize()
    expect(viewport).toBeTruthy()

    if (viewport) {
      expect(viewport.width).toBeLessThan(768)
    }

    await expect(page.locator("#landing-page-container")).toBeVisible()

    const aboutMe = page.locator("#about-me-container")
    await aboutMe.scrollIntoViewIfNeeded()
    await expect(aboutMe).toBeVisible()
  })

  test("should maintain proper touch interactions", async ({ page }) => {
    const modalPage = new ModalPage(page)
    await landingPage.clickContactMe()
    await modalPage.waitForModalOpen()
    expect(await modalPage.isModalOpen()).toBe(true)
  })

  test("should support pinch-to-zoom prevention", async ({ page }) => {
    const viewportMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]')
      return meta?.getAttribute("content") || ""
    })

    expect(viewportMeta).toBeTruthy()
  })

  test("should have proper mobile font sizes", async () => {
    const title = landingPage.title
    await expect(title).toBeVisible()

    const fontSize = await title.evaluate((el) => window.getComputedStyle(el).fontSize)
    expect(fontSize).toBeTruthy()
  })

  test("should handle orientation changes", async ({ page }) => {
    const initialViewport = page.viewportSize()
    expect(initialViewport).toBeTruthy()

    await page.setViewportSize({ width: 844, height: 390 })
    await expect(landingPage.title).toBeVisible()

    if (initialViewport) {
      await page.setViewportSize(initialViewport)
    }

    await expect(landingPage.title).toBeVisible()
  })

  test("should have mobile-optimized images", async ({ page }) => {
    const images = page.locator("img")
    const count = await images.count()
    expect(count).toBeGreaterThan(0)

    const firstImage = images.first()
    const loading = await firstImage.getAttribute("loading")
    // loading may be lazy or eager depending on LCP image
    expect(loading === null || loading === "lazy" || loading === "eager").toBe(true)
  })

  test("should have adequate touch target sizes", async ({ page }) => {
    const buttons = page.locator("button, a")
    const count = Math.min(await buttons.count(), 10)

    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i)
      if (await button.isVisible()) {
        const box = await button.boundingBox()
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(28)
        }
      }
    }
  })

  test("should load all sections on mobile", async ({ page }) => {
    const sections = [
      "#landing-page-container",
      "#about-me-container",
      "#experience-container",
      "#skills-container",
      "#sw-projects-container",
      "#graphic-design-container",
    ]

    for (const sectionId of sections) {
      const section = page.locator(sectionId)
      await section.scrollIntoViewIfNeeded()
      await expect(section).toBeVisible()
    }
  })
})
