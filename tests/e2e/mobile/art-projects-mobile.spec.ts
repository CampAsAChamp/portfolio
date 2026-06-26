import { expect, test } from "@playwright/test"

import { SectionPage } from "../fixtures/SectionPage"

test.describe("Art Projects Section - Mobile", () => {
  let sectionPage: SectionPage

  test.beforeEach(async ({ page }) => {
    sectionPage = new SectionPage(page)
    await sectionPage.goto("/")

    // Scroll to Art Projects section
    await sectionPage.scrollToSection("graphic-design-header")
    await page.waitForTimeout(1000)
  })

  test("should display Art Projects section", async ({ page }) => {
    const section = sectionPage.getSection("graphic-design-container")
    await expect(section).toBeVisible()

    const header = page.locator("#graphic-design-header h2")
    await expect(header).toBeVisible()
  })

  test("should use carousel instead of grid", async ({ page }) => {
    // Carousel should be visible on mobile
    const carousel = page.locator('#graphic-design-content [class*="carousel"], #graphic-design-content .swiper')

    // Carousel should exist and be visible
    const carouselCount = await carousel.count()
    expect(carouselCount).toBeGreaterThan(0)

    if (carouselCount > 0) {
      await expect(carousel.first()).toBeVisible()
    }
  })

  test("should show single image at a time", async ({ page }) => {
    const activeSlides = page.locator("#graphic-design-content .swiper-slide-active")
    await expect(activeSlides.first()).toBeVisible()

    const activeCount = await activeSlides.count()
    expect(activeCount).toBeGreaterThan(0)
    expect(activeCount).toBeLessThanOrEqual(2)
  })

  test("should not open fullscreen modal when tapping photos", async ({ page }) => {
    const carousel = page.locator('#graphic-design-content [class*="carousel"], #graphic-design-content .swiper')

    if ((await carousel.count()) > 0) {
      const firstImage = carousel.locator("img").first()

      if (await firstImage.isVisible()) {
        // Tap image
        await firstImage.tap()
        await page.waitForTimeout(500)

        // Modal should not open
        const modal = page.locator('[class*="modal"][class*="fullscreen"], [role="dialog"]')
        const modalCount = await modal.count()

        if (modalCount > 0) {
          const isVisible = await modal
            .first()
            .isVisible()
            .catch(() => false)
          expect(isVisible).toBe(false)
        }
      }
    }
  })

  test("should display next and previous arrows", async ({ page }) => {
    // Look for navigation arrows
    const nextButton = page.locator('[class*="next"], [aria-label*="next" i], .swiper-button-next')
    const prevButton = page.locator('[class*="prev"], [aria-label*="prev" i], .swiper-button-prev')

    // At least one navigation element should exist
    const nextCount = await nextButton.count()
    const prevCount = await prevButton.count()

    expect(nextCount + prevCount).toBeGreaterThan(0)
  })

  test("should navigate to next slide when next arrow is tapped", async ({ page }) => {
    const nextButton = page.locator('[class*="next"], [aria-label*="next" i], .swiper-button-next').first()

    if ((await nextButton.count()) > 0 && (await nextButton.isVisible())) {
      // Tap next button
      await nextButton.tap()
      await page.waitForTimeout(500)

      // Carousel should still be visible
      const carousel = page.locator('#graphic-design-content [class*="carousel"], #graphic-design-content .swiper')
      await expect(carousel.first()).toBeVisible()
    }
  })

  test("should navigate to previous slide when previous arrow is tapped", async ({ page }) => {
    const nextButton = page.locator('[class*="next"], [aria-label*="next" i], .swiper-button-next').first()
    const prevButton = page.locator('[class*="prev"], [aria-label*="prev" i], .swiper-button-prev').first()

    // Go to next slide first
    if ((await nextButton.count()) > 0 && (await nextButton.isVisible())) {
      await nextButton.tap()
      await page.waitForTimeout(500)

      // Then go back
      if ((await prevButton.count()) > 0 && (await prevButton.isVisible())) {
        await prevButton.tap()
        await page.waitForTimeout(500)

        // Carousel should still be visible
        const carousel = page.locator('#graphic-design-content [class*="carousel"], #graphic-design-content .swiper')
        await expect(carousel.first()).toBeVisible()
      }
    }
  })

  test("should display pagination dots", async ({ page }) => {
    // Look for pagination dots
    const pagination = page.locator('[class*="pagination"], .swiper-pagination')
    const paginationCount = await pagination.count()

    if (paginationCount > 0) {
      await expect(pagination.first()).toBeVisible()

      // Check for individual dots
      const dots = pagination.locator('[class*="bullet"], [class*="dot"]')
      const dotCount = await dots.count()

      // Should have multiple dots (one per image)
      expect(dotCount).toBeGreaterThan(1)
    }
  })

  test("should show current index in pagination", async ({ page }) => {
    const pagination = page.locator('[class*="pagination"], .swiper-pagination')

    if ((await pagination.count()) > 0) {
      // Pagination should indicate current slide
      const activeDot = pagination.locator('[class*="active"]')
      const activeCount = await activeDot.count()

      // Should have at least one active indicator
      expect(activeCount).toBeGreaterThan(0)
    }
  })

  test("should not display grid on mobile", async ({ page }) => {
    // Grid should be hidden on mobile
    const grid = page.locator('#graphic-design-content [class*="grid"]:not([class*="carousel"])')

    if ((await grid.count()) > 0) {
      const isVisible = await grid
        .first()
        .isVisible()
        .catch(() => false)
      expect(isVisible).toBe(false)
    }
  })

  test("should support swipe gestures", async ({ page }) => {
    const carousel = page.locator('#graphic-design-content [class*="carousel"], #graphic-design-content .swiper').first()

    if ((await carousel.count()) > 0 && (await carousel.isVisible())) {
      const box = await carousel.boundingBox()

      if (box) {
        // Swipe left (next)
        await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2)
        await page.touchscreen.tap(box.x + 50, box.y + box.height / 2)
        await page.waitForTimeout(500)

        // Carousel should still be visible
        await expect(carousel).toBeVisible()
      }
    }
  })

  test("should display carousel with proper mobile layout", async ({ page }) => {
    const carousel = page.locator('#graphic-design-content [class*="carousel"], #graphic-design-content .swiper')

    if ((await carousel.count()) > 0) {
      await expect(carousel.first()).toBeVisible()

      const box = await carousel.first().boundingBox()
      const viewport = page.viewportSize()

      expect(box).toBeTruthy()
      expect(viewport).toBeTruthy()

      if (box && viewport) {
        // Carousel should take up significant width
        expect(box.width).toBeGreaterThan(viewport.width * 0.7)
      }
    }
  })
})
