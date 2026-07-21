import { SectionPage } from "../fixtures/SectionPage"
import { expect, test } from "../fixtures/test"

test.describe("About Me Section - Mobile", () => {
  let sectionPage: SectionPage

  test.beforeEach(async ({ page }) => {
    sectionPage = new SectionPage(page)
    await sectionPage.goto("/")
    await sectionPage.scrollToSection("about-me-images")
  })

  test("should display About Me section", async () => {
    const section = sectionPage.getSection("about-me-container")
    await expect(section).toBeVisible()
  })

  test("should have single column layout", async ({ page }) => {
    // Verify mobile viewport
    const viewport = page.viewportSize()
    expect(viewport).toBeTruthy()

    if (viewport) {
      expect(viewport.width).toBeLessThan(768)
    }

    // Elements should be stacked vertically
    const images = page.locator("#about-me-images")
    const text = page.locator("#about-me-text")

    await expect(images).toBeVisible()
    await expect(text).toBeVisible()
  })

  test("should display elements in order: Images, Title, Description", async ({ page }) => {
    const images = page.locator("#about-me-images")
    const header = page.locator("#about-me-header h2")
    const description = page.locator("#about-me-text p").first()

    const imagesBox = await images.boundingBox()
    const headerBox = await header.boundingBox()
    const descriptionBox = await description.boundingBox()

    expect(imagesBox).toBeTruthy()
    expect(headerBox).toBeTruthy()
    expect(descriptionBox).toBeTruthy()

    if (imagesBox && headerBox && descriptionBox) {
      // Images should be before title
      expect(imagesBox.y).toBeLessThan(headerBox.y)

      // Title should be before description paragraph
      expect(headerBox.y).toBeLessThan(descriptionBox.y)
    }
  })

  test("should display all three images", async ({ page }) => {
    const gradCap = page.locator("#grad-cap-illustration")
    const anteater = page.locator("#anteater-illustration")
    const desk = page.locator("#desk-illustration")

    await expect(gradCap).toBeVisible()
    await expect(anteater).toBeVisible()
    await expect(desk).toBeVisible()
  })

  test("should display About Me text content", async ({ page }) => {
    const header = page.locator("#about-me-header h2")
    await expect(header).toBeVisible()
    await expect(header).toHaveText("ABOUT ME")

    const text = page.locator("#about-me-text")
    const textContent = await text.textContent()
    expect(textContent).toContain("Nick")
  })

  test("should maintain proper spacing in mobile layout", async () => {
    const section = sectionPage.getSection("about-me-container")
    const box = await section.boundingBox()

    expect(box).toBeTruthy()
    if (box) {
      expect(box.height).toBeGreaterThan(200)
    }
  })
})
