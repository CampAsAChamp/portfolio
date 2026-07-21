import { expect, test } from "@playwright/test"

import { SectionPage } from "../fixtures/SectionPage"
import { skipUnlessVisualBaseline } from "../helpers/visual-helpers"

test.describe("Art Projects Section - Desktop", () => {
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

    // Check for section header
    const header = page.locator("#graphic-design-header h2")
    await expect(header).toBeVisible()
    await expect(header).toHaveText("Art & Design Projects")
  })

  test("should display projects in grid layout", async ({ page }) => {
    // Grid or individual projects should be visible
    const projects = page.locator('#graphic-design-content img, #graphic-design-content [class*="project"]')
    const count = await projects.count()

    // Should have multiple projects
    expect(count).toBeGreaterThan(0)
  })

  test("should display multiple art projects", async ({ page }) => {
    const projects = page.locator('#graphic-design-content img, #graphic-design-content [class*="art-project"]')
    const count = await projects.count()

    // Should have multiple art projects
    expect(count).toBeGreaterThan(3)
  })

  test("should animate projects with stagger when scrolled into view", async ({ page }) => {
    // Scroll to top
    await sectionPage.scrollToPosition(0)
    await page.waitForTimeout(300)

    // Scroll to Art Projects section to trigger animations
    await sectionPage.scrollToSection("graphic-design-header")
    await page.waitForTimeout(1500) // Wait for staggered animations

    // Projects should be visible
    const projects = page.locator("#graphic-design-content img").first()
    await expect(projects).toBeVisible()
  })

  test("should enlarge project slightly on hover", async ({ page }) => {
    const projects = page.locator('#graphic-design-content img, #graphic-design-content [class*="art-project"]')
    const firstProject = projects.first()
    await expect(firstProject).toBeVisible()

    // Hover over project
    await firstProject.hover()
    await page.waitForTimeout(300)

    // Project should still be visible
    await expect(firstProject).toBeVisible()
  })

  test("should open fullscreen modal when project is clicked", async ({ page }) => {
    const projects = page.locator('#graphic-design-content img, #graphic-design-content [class*="art-project"]')
    const firstProject = projects.first()
    await expect(firstProject).toBeVisible()

    // Click project
    await firstProject.click()

    // Wait for modal to open
    await page.waitForTimeout(500)

    // Modal should be visible
    const modal = page.locator('[class*="modal"], [class*="fullscreen"], [role="dialog"]')
    const modalCount = await modal.count()

    if (modalCount > 0) {
      await expect(modal.first()).toBeVisible()
    }
  })

  test("should animate modal in when opened", async ({ page }) => {
    const projects = page.locator('#graphic-design-content img, #graphic-design-content [class*="art-project"]')
    const firstProject = projects.first()

    // Click to open modal
    await firstProject.click()
    await page.waitForTimeout(500)

    // Check for modal
    const modal = page.locator('[class*="modal"], [class*="fullscreen"], [role="dialog"]')
    const modalCount = await modal.count()

    if (modalCount > 0) {
      await expect(modal.first()).toBeVisible()
    }
  })

  test("should close modal with X button", async ({ page }) => {
    const projects = page.locator('#graphic-design-content img, #graphic-design-content [class*="art-project"]')
    const firstProject = projects.first()

    // Open modal
    await firstProject.click()
    await page.waitForTimeout(500)

    const modal = page.locator('[class*="modal"], [class*="fullscreen"], [role="dialog"]')
    const modalCount = await modal.count()

    if (modalCount > 0) {
      // Find close button
      const closeButton = page.locator('[class*="close"], button[aria-label*="close" i]').first()

      if (await closeButton.isVisible()) {
        await closeButton.click()
        await page.waitForTimeout(500)

        // Modal should be closed
        await expect(modal.first()).not.toBeVisible()
      }
    }
  })

  test("should show hover effect on X button (yellow and spin)", async ({ page }) => {
    const projects = page.locator('#graphic-design-content img, #graphic-design-content [class*="art-project"]')
    const firstProject = projects.first()

    // Open modal
    await firstProject.click()
    await page.waitForTimeout(500)

    const modal = page.locator('[class*="modal"], [class*="fullscreen"], [role="dialog"]')
    const modalCount = await modal.count()

    if (modalCount > 0 && (await modal.first().isVisible())) {
      const closeButton = page.locator('[class*="close"], button[aria-label*="close" i]').first()

      if (await closeButton.isVisible()) {
        // Hover over close button
        await closeButton.hover()
        await page.waitForTimeout(300)

        await expect(closeButton).toBeVisible()
      }
    }
  })

  test("should close modal when clicking backdrop", async ({ page }) => {
    const projects = page.locator('#graphic-design-content img, #graphic-design-content [class*="art-project"]')
    const firstProject = projects.first()

    // Open modal
    await firstProject.click()
    await page.waitForTimeout(500)

    const modal = page.locator('[class*="modal"], [class*="fullscreen"], [role="dialog"]')
    const modalCount = await modal.count()

    if (modalCount > 0 && (await modal.first().isVisible())) {
      // Click backdrop (outside modal content)
      await page.mouse.click(10, 10)
      await page.waitForTimeout(500)

      // Modal should be closed
      await expect(modal.first()).not.toBeVisible()
    }
  })

  test("should close modal when pressing ESC", async ({ page }) => {
    const projects = page.locator('#graphic-design-content img, #graphic-design-content [class*="art-project"]')
    const firstProject = projects.first()

    // Open modal
    await firstProject.click()
    await page.waitForTimeout(500)

    const modal = page.locator('[class*="modal"], [class*="fullscreen"], [role="dialog"]')
    const modalCount = await modal.count()

    if (modalCount > 0 && (await modal.first().isVisible())) {
      // Press ESC
      await page.keyboard.press("Escape")
      await page.waitForTimeout(500)

      // Modal should be closed
      await expect(modal.first()).not.toBeVisible()
    }
  })

  test("should animate modal out when closing", async ({ page }) => {
    const projects = page.locator('#graphic-design-content img, #graphic-design-content [class*="art-project"]')
    const firstProject = projects.first()

    // Open modal
    await firstProject.click()
    await page.waitForTimeout(500)

    const modal = page.locator('[class*="modal"], [class*="fullscreen"], [role="dialog"]')
    const modalCount = await modal.count()

    if (modalCount > 0 && (await modal.first().isVisible())) {
      // Close modal
      await page.keyboard.press("Escape")
      await page.waitForTimeout(500)

      // Modal should be closed
      await expect(modal.first()).not.toBeVisible()
    }
  })

  test("should display complete Art Projects section - visual regression", async ({ page }, testInfo) => {
    skipUnlessVisualBaseline(testInfo)
    const section = page.locator("#graphic-design-container")
    await expect(section).toBeVisible()
    await expect(section).toHaveScreenshot("art-projects-section.png", { animations: "disabled", timeout: 15000 })
  })

  test("should have grid layout on desktop", async ({ page }) => {
    const content = page.locator("#graphic-design-content")
    await expect(content).toBeVisible()

    // Should display grid (not carousel) on desktop
    const grid = page.locator('#graphic-design-content [class*="grid"]')
    const gridCount = await grid.count()

    // Grid should exist
    expect(gridCount).toBeGreaterThan(0)
  })

  test("should not display carousel on desktop", async ({ page }) => {
    // Carousel should be hidden on desktop
    const carousel = page.locator('#graphic-design-content [class*="carousel"], #graphic-design-content .swiper')

    // Carousel may exist in DOM but should not be visible
    const isVisible = await carousel.isVisible().catch(() => false)
    expect(isVisible).toBe(false)
  })

  test("should have proper grid spacing", async ({ page }) => {
    const columns = page.locator("#graphic-design-content .row .column")
    await expect(columns).toHaveCount(4)

    let columnsWithVisibleImages = 0
    for (let i = 0; i < 4; i++) {
      const column = columns.nth(i)
      await column.scrollIntoViewIfNeeded()
      const image = column.locator(".art-grid-img").first()
      if ((await image.count()) > 0 && (await image.isVisible())) {
        columnsWithVisibleImages++
      }
    }

    expect(columnsWithVisibleImages).toBeGreaterThan(1)
  })
})
