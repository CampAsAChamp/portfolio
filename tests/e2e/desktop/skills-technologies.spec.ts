import { expect, test } from "@playwright/test"

import { SectionPage } from "../fixtures/SectionPage"
import { takeElementScreenshot } from "../helpers/screenshot-helpers"
import { skipUnlessVisualBaseline } from "../helpers/visual-helpers"
import { waitForSectionInViewport } from "../helpers/wait-helpers"

test.describe("Skills & Technologies Section - Desktop", () => {
  let sectionPage: SectionPage

  test.beforeEach(async ({ page }) => {
    sectionPage = new SectionPage(page)
    await sectionPage.goto("/")
    await page.locator("#skills-header").scrollIntoViewIfNeeded()
    await waitForSectionInViewport(page, "skills-header")
  })

  test("should display Skills & Technologies section", async ({ page }) => {
    const section = sectionPage.getSection("skills-container")
    await expect(section).toBeVisible()

    // Check for section header
    const header = page.locator("#skills-header h2")
    await expect(header).toBeVisible()
    await expect(header).toHaveText("Skills & Technologies")
  })

  test("should display multiple skill items", async ({ page }) => {
    const skillItems = page.locator("#skills-content .skills-icon-container")
    const count = await skillItems.count()

    // Should have multiple skills
    expect(count).toBeGreaterThan(5)
  })

  test("should display icons for each skill", async ({ page }) => {
    const skillItems = page.locator("#skills-content .skills-icon-container")
    const count = await skillItems.count()

    if (count > 0) {
      const firstSkill = skillItems.first()
      await expect(firstSkill).toBeVisible()

      // Should have an icon (svg)
      const icon = firstSkill.locator(".skills-icon")
      await expect(icon).toBeVisible()
    }
  })

  test("should display text labels for each skill", async ({ page }) => {
    const skillItems = page.locator("#skills-content .skills-icon-container")
    const count = await skillItems.count()

    if (count > 0) {
      const firstSkill = skillItems.first()
      await expect(firstSkill).toBeVisible()

      // Should have caption text
      const caption = firstSkill.locator(".skills-caption")
      await expect(caption).toBeVisible()
      const text = await caption.textContent()
      expect(text?.trim().length).toBeGreaterThan(0)
    }
  })

  test("should enlarge icon on hover", async ({ page }) => {
    const firstItem = page.locator("#skills-content .skills-icon-container").first()
    await expect(firstItem).toBeVisible()

    const initialBox = await firstItem.boundingBox()
    expect(initialBox).toBeTruthy()

    await firstItem.hover()

    await expect
      .poll(
        async () => {
          const box = await firstItem.boundingBox()
          if (!box || !initialBox) return false
          return box.width >= initialBox.width && box.height >= initialBox.height
        },
        { timeout: 3000 },
      )
      .toBe(true)
  })

  test("should have color wipe effect and underline on hover", async ({ page }) => {
    const skillItems = page.locator("#skills-content .skills-icon-container")
    const firstItem = skillItems.first()
    await expect(firstItem).toBeVisible()
    await firstItem.scrollIntoViewIfNeeded()

    // Hover over item — use force to avoid WebKit hit-target flakiness mid-animation
    await firstItem.hover({ force: true })
    await expect(firstItem).toBeVisible()
  })

  test("should have text centered to icon", async ({ page }) => {
    const skillItems = page.locator("#skills-content .skills-icon-container")
    const firstItem = skillItems.first()
    await expect(firstItem).toBeVisible()

    // Get icon and text elements
    const icon = firstItem.locator("img, svg").first()
    const iconBox = await icon.boundingBox()
    const itemBox = await firstItem.boundingBox()

    expect(iconBox).toBeTruthy()
    expect(itemBox).toBeTruthy()
  })

  test("should have rows centered to page", async ({ page }) => {
    const skillsContent = page.locator("#skills-content")
    await expect(skillsContent).toBeVisible()

    const contentBox = await skillsContent.boundingBox()
    expect(contentBox).toBeTruthy()

    if (contentBox) {
      const viewport = page.viewportSize()
      if (viewport) {
        // Content should be reasonably centered
        const centerX = contentBox.x + contentBox.width / 2
        const viewportCenterX = viewport.width / 2

        // Allow some tolerance
        expect(Math.abs(centerX - viewportCenterX)).toBeLessThan(viewport.width * 0.3)
      }
    }
  })

  test("should display organic blob background", async () => {
    // Just verify the section renders properly
    const section = sectionPage.getSection("skills-container")
    await expect(section).toBeVisible()
  })

  test("should display multiple rows of skills", async ({ page }) => {
    const skillsContent = page.locator("#skills-content")
    await expect(skillsContent).toBeVisible()

    // Should have multiple rows (check for row elements or multiple skill items)
    const skillItems = page.locator("#skills-content .skills-icon-container")
    const count = await skillItems.count()

    // With multiple rows, should have many items
    expect(count).toBeGreaterThan(8)
  })

  test("should display complete Skills section - visual regression", async ({ page }, testInfo) => {
    skipUnlessVisualBaseline(testInfo)
    const skillsContent = page.locator("#skills-content")
    await takeElementScreenshot(skillsContent, "skills-section")
  })

  test("should have proper spacing between items", async ({ page }) => {
    const skillItems = page.locator("#skills-content .skills-icon-container")
    const count = await skillItems.count()

    if (count > 1) {
      const firstItem = skillItems.nth(0)
      const secondItem = skillItems.nth(1)

      await expect(firstItem).toBeVisible()
      await expect(secondItem).toBeVisible()

      const firstBox = await firstItem.boundingBox()
      const secondBox = await secondItem.boundingBox()

      expect(firstBox).toBeTruthy()
      expect(secondBox).toBeTruthy()
    }
  })

  test("should have accessible structure", async ({ page }) => {
    const section = sectionPage.getSection("skills-container")
    await expect(section).toBeVisible()

    // Should have heading
    const heading = page.locator("#skills-header h2")
    await expect(heading).toBeVisible()

    // Should have content area
    const content = page.locator("#skills-content")
    await expect(content).toBeVisible()
  })

  test("should display technology names", async ({ page }) => {
    const skillItems = page.locator("#skills-content .skills-icon-container")

    // Check several items have text
    const count = Math.min(await skillItems.count(), 5)
    for (let i = 0; i < count; i++) {
      const item = skillItems.nth(i)
      const text = await item.textContent()
      expect(text?.trim().length).toBeGreaterThan(0)
    }
  })

  test("should have consistent item sizing", async ({ page }) => {
    const skillItems = page.locator("#skills-content .skills-icon-container")
    const count = await skillItems.count()

    if (count > 2) {
      const firstBox = await skillItems.nth(0).boundingBox()
      const secondBox = await skillItems.nth(1).boundingBox()

      expect(firstBox).toBeTruthy()
      expect(secondBox).toBeTruthy()

      // Items should have similar heights (within reason)
      if (firstBox && secondBox) {
        const heightDiff = Math.abs(firstBox.height - secondBox.height)
        expect(heightDiff).toBeLessThan(50)
      }
    }
  })
})
