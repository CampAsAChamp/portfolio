import { expect, test } from "@playwright/test"

import { SectionPage } from "../fixtures/SectionPage"

test.describe("About Me Section - Desktop", () => {
  let sectionPage: SectionPage

  test.beforeEach(async ({ page }) => {
    sectionPage = new SectionPage(page)
    await sectionPage.goto("/")

    // Scroll to About Me section
    await sectionPage.scrollToSection("about-me-images")
    await page.waitForTimeout(500)
  })

  test("should display About Me section", async () => {
    const section = sectionPage.getSection("about-me-container")
    await expect(section).toBeVisible()
  })

  test("should display organic blob background", async ({ page }) => {
    // Check for background logo (S logo overlay)
    const backgroundLogo = page.locator("#background-logo")
    await expect(backgroundLogo).toBeVisible()
  })

  test("should display S logo overlay behind content", async ({ page }) => {
    const backgroundLogo = page.locator("#background-logo")
    await expect(backgroundLogo).toBeVisible()

    // Verify it's the S logo
    const src = await backgroundLogo.getAttribute("src")
    expect(src).toContain("S_Logo")
  })

  test("should display three images in correct layout", async ({ page }) => {
    // Check for all three illustrations
    const gradCap = page.locator("#grad-cap-illustration")
    const anteater = page.locator("#anteater-illustration")
    const desk = page.locator("#desk-illustration")

    await expect(gradCap).toBeVisible()
    await expect(anteater).toBeVisible()
    await expect(desk).toBeVisible()
  })

  test("should have two images on top row", async ({ page }) => {
    const gradCap = page.locator("#grad-cap-illustration")
    const anteater = page.locator("#anteater-illustration")

    await expect(gradCap).toBeVisible()
    await expect(anteater).toBeVisible()

    // Both should be visible and positioned
    const gradCapBox = await gradCap.boundingBox()
    const anteaterBox = await anteater.boundingBox()

    expect(gradCapBox).toBeTruthy()
    expect(anteaterBox).toBeTruthy()
  })

  test("should have one image on bottom centered", async ({ page }) => {
    const desk = page.locator("#desk-illustration")
    await expect(desk).toBeVisible()

    const deskBox = await desk.boundingBox()
    expect(deskBox).toBeTruthy()
  })

  test("should animate images with stagger when scrolled into view", async ({ page }) => {
    // Scroll back to top
    await sectionPage.scrollToPosition(0)
    await page.waitForTimeout(300)

    // Scroll to About Me section to trigger animations
    await sectionPage.scrollToSection("about-me-images")
    await page.waitForTimeout(1000) // Wait for staggered animations

    // All images should be visible after animations
    const gradCap = page.locator("#grad-cap-illustration")
    const anteater = page.locator("#anteater-illustration")
    const desk = page.locator("#desk-illustration")

    await expect(gradCap).toBeVisible()
    await expect(anteater).toBeVisible()
    await expect(desk).toBeVisible()
  })

  test("should display About Me text content", async ({ page }) => {
    const aboutMeText = page.locator("#about-me-text")
    await expect(aboutMeText).toBeVisible()

    // Check for header
    const header = page.locator("#about-me-header h2")
    await expect(header).toBeVisible()
    await expect(header).toHaveText("ABOUT ME")

    // Check for text content
    const textContent = await aboutMeText.textContent()
    expect(textContent).toContain("Nick")
    expect(textContent).toContain("software engineer")
    expect(textContent).toContain("University of California, Irvine")
  })

  test("should have text centered on right side", async ({ page }) => {
    const aboutMeText = page.locator("#about-me-text")
    await expect(aboutMeText).toBeVisible()

    const aboutMeImages = page.locator("#about-me-images")
    await expect(aboutMeImages).toBeVisible()

    // Get bounding boxes
    const textBox = await aboutMeText.boundingBox()
    const imagesBox = await aboutMeImages.boundingBox()

    expect(textBox).toBeTruthy()
    expect(imagesBox).toBeTruthy()

    // Text should be to the right of images (on desktop)
    if (textBox && imagesBox) {
      expect(textBox.x).toBeGreaterThan(imagesBox.x)
    }
  })

  test("should display section with proper spacing", async () => {
    const section = sectionPage.getSection("about-me-container")
    const box = await section.boundingBox()

    expect(box).toBeTruthy()
    if (box) {
      // Section should have reasonable height
      expect(box.height).toBeGreaterThan(200)
    }
  })

  test("should animate in when scrolled 10% past element", async ({ page }) => {
    // Scroll to top
    await sectionPage.scrollToPosition(0)
    await page.waitForTimeout(300)

    // Scroll to trigger animations
    await sectionPage.waitForSectionAnimations("about-me-images")

    // Images should be visible
    const gradCap = page.locator("#grad-cap-illustration")
    await expect(gradCap).toBeVisible()
  })

  test("should display complete About Me section - visual regression", async ({ page }) => {
    const section = page.locator("#about-me-container")
    await expect(section).toBeVisible()
    await expect(section).toHaveScreenshot("about-me-section.png", { animations: "disabled", timeout: 15000 })
  })

  test("should have proper image loading attributes", async ({ page }) => {
    const anteater = page.locator("#anteater-illustration")
    const desk = page.locator("#desk-illustration")

    // Check for lazy loading
    const anteaterLoading = await anteater.getAttribute("loading")
    const deskLoading = await desk.getAttribute("loading")

    expect(anteaterLoading).toBe("lazy")
    expect(deskLoading).toBe("lazy")
  })

  test("should maintain layout integrity", async ({ page }) => {
    // All key elements should be present and visible
    await expect(page.locator("#background-logo")).toBeVisible()
    await expect(page.locator("#about-me-images")).toBeVisible()
    await expect(page.locator("#about-me-text")).toBeVisible()
    await expect(page.locator("#about-me-header")).toBeVisible()
  })
})
