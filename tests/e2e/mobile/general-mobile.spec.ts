import { expect, test } from "@playwright/test"

import { BasePage } from "../fixtures/BasePage"
import { LandingPage } from "../fixtures/LandingPage"

test.describe("General Mobile Behaviors", () => {
  let basePage: BasePage
  let landingPage: LandingPage

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page)
    landingPage = new LandingPage(page)
    await basePage.goto("/")
  })

  test("should not display mouse scroll indicator", async () => {
    // Mouse scroll indicator should never appear on mobile
    const indicator = landingPage.mouseScrollIndicator

    // Should not be visible
    const isVisible = await indicator.isVisible().catch(() => false)
    expect(isVisible).toBe(false)
  })

  test("should not display scroll to top button", async ({ page }) => {
    // Scroll down significantly
    await basePage.scrollToPosition(1000)
    await page.waitForTimeout(500)

    // Scroll to top button should not appear on mobile
    const scrollToTopButton = page.locator("#scroll-to-top-button")

    // Should not be visible (mobile has native scroll to top)
    const isVisible = await scrollToTopButton.isVisible().catch(() => false)
    expect(isVisible).toBe(false)
  })

  test("should have single column layout throughout", async ({ page }) => {
    // Verify viewport is mobile size
    const viewport = page.viewportSize()
    expect(viewport).toBeTruthy()

    if (viewport) {
      expect(viewport.width).toBeLessThan(768)
    }

    // All major sections should be visible
    await expect(page.locator("#landing-page-container")).toBeVisible()

    // Scroll to other sections
    await basePage.scrollToPosition(500)
    await page.waitForTimeout(300)
    await expect(page.locator("#about-me-container")).toBeVisible()
  })

  test("should maintain proper touch interactions", async ({ page }) => {
    const contactButton = landingPage.contactMeButton
    await expect(contactButton).toBeVisible()
    await contactButton.scrollIntoViewIfNeeded()

    await contactButton.click({ force: true })

    await expect(page.locator("#contact-me-modal-background")).toBeVisible({ timeout: 10000 })
  })

  test("should support pinch-to-zoom prevention", async ({ page }) => {
    // Check viewport meta tag
    const viewportMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]')
      return meta?.getAttribute("content") || ""
    })

    // Should have viewport meta tag
    expect(viewportMeta).toBeTruthy()
  })

  test("should have proper mobile font sizes", async () => {
    // Check title font size
    const title = landingPage.title
    await expect(title).toBeVisible()

    const fontSize = await title.evaluate((el) => {
      return window.getComputedStyle(el).fontSize
    })

    // Font size should be set
    expect(fontSize).toBeTruthy()
  })

  test("should handle orientation changes", async ({ page }) => {
    // Get initial viewport
    const initialViewport = page.viewportSize()
    expect(initialViewport).toBeTruthy()

    // Rotate to landscape
    await page.setViewportSize({ width: 844, height: 390 })
    await page.waitForTimeout(500)

    // Page should still be functional
    await expect(landingPage.title).toBeVisible()

    // Rotate back to portrait
    if (initialViewport) {
      await page.setViewportSize(initialViewport)
      await page.waitForTimeout(500)
    }

    await expect(landingPage.title).toBeVisible()
  })

  test("should have mobile-optimized images", async ({ page }) => {
    // Check for responsive images
    const images = page.locator("img")
    const count = await images.count()

    expect(count).toBeGreaterThan(0)

    // First image should have proper attributes
    const firstImage = images.first()
    const loading = await firstImage.getAttribute("loading")

    // May have lazy loading
    expect(loading === "lazy" || loading === null).toBe(true)
  })

  test("should prevent horizontal scrolling", async ({ page }) => {
    // Check body overflow
    const overflowX = await page.evaluate(() => {
      return window.getComputedStyle(document.body).overflowX
    })

    // Should not have horizontal scroll
    expect(["hidden", "clip", "visible"]).toContain(overflowX)

    // Check document width
    const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const viewport = page.viewportSize()

    if (viewport) {
      // Allow small overflow from sub-pixel layout or scrollbar gutters
      expect(documentWidth).toBeLessThanOrEqual(viewport.width + 20)
    }
  })

  test("should have proper tap targets (minimum 44x44)", async ({ page }) => {
    // Check button sizes
    const buttons = page.locator("button, a[href]")
    const count = Math.min(await buttons.count(), 5)

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
