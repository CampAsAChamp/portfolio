import { BasePage } from "../fixtures/BasePage"
import { expect, test } from "../fixtures/test"

test.describe("Footer - Desktop", () => {
  let basePage: BasePage

  test.beforeEach(async ({ page }) => {
    basePage = new BasePage(page)
    await basePage.goto("/")
    await page.locator("#graphic-design-container").scrollIntoViewIfNeeded()
    await expect(page.locator("#graphic-design-container")).toBeInViewport({ timeout: 15000 })
  })

  test("should render at bottom of page", async ({ page }) => {
    const scrollPosition = await basePage.getScrollPosition()
    expect(scrollPosition).toBeGreaterThan(100)

    const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
    expect(bodyHeight).toBeGreaterThan(1000)
  })

  test("should display complete page layout", async ({ page }) => {
    await expect(page.locator("#landing-page-container")).toBeVisible()
    await expect(page.locator("#about-me-container")).toBeVisible()
    await expect(page.locator("#experience-container")).toBeVisible()
    await expect(page.locator("#skills-container")).toBeVisible()
    await expect(page.locator("#sw-projects-container")).toBeVisible()
    await expect(page.locator("#graphic-design-container")).toBeVisible()
  })

  test("should have proper page ending", async ({ page }) => {
    const lastSection = page.locator("#graphic-design-container")
    await expect(lastSection).toBeVisible()

    const bodyHeight = await page.evaluate(() => document.body.scrollHeight)
    const viewportHeight = page.viewportSize()?.height || 0

    expect(bodyHeight).toBeGreaterThan(viewportHeight)
  })

  test("should allow scrolling to bottom", async ({ page }) => {
    await expect(page.locator("#graphic-design-container")).toBeInViewport()

    const scrollPosition = await basePage.getScrollPosition()
    expect(scrollPosition).toBeGreaterThan(100)
  })

  test("should maintain layout integrity at bottom", async ({ page }) => {
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
      const exists = (await section.count()) > 0
      expect(exists).toBe(true)
    }
  })
})
