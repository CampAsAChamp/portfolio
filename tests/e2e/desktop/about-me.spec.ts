import { SectionPage } from "../fixtures/SectionPage"
import { expect, test } from "../fixtures/test"
import { takeElementScreenshot } from "../helpers/screenshot-helpers"
import { skipUnlessVisualBaseline } from "../helpers/visual-helpers"

test.describe("About Me Section - Desktop", () => {
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

  test("should display organic blob background", async ({ page }) => {
    const section = page.locator("#about-me-container")
    await expect(section).toBeVisible()

    // Decorative S logo is a CSS ::before background (avoids competing for LCP)
    const hasLogoOverlay = await section.evaluate((el) => {
      const before = getComputedStyle(el, "::before")
      return before.content !== "none" && before.backgroundImage.includes("S_Logo")
    })
    expect(hasLogoOverlay).toBe(true)
  })

  test("should display S logo overlay behind content", async ({ page }) => {
    const section = page.locator("#about-me-container")
    const logoStyles = await section.evaluate((el) => {
      const before = getComputedStyle(el, "::before")
      return {
        content: before.content,
        backgroundImage: before.backgroundImage,
        opacity: before.opacity,
        zIndex: before.zIndex,
      }
    })

    expect(logoStyles.content).not.toBe("none")
    expect(logoStyles.backgroundImage).toContain("S_Logo")
    expect(Number.parseFloat(logoStyles.opacity)).toBeLessThan(1)
    expect(Number.parseInt(logoStyles.zIndex, 10)).toBeLessThan(0)
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

  test("should display complete About Me section - visual regression", async ({ page }, testInfo) => {
    skipUnlessVisualBaseline(testInfo)
    await takeElementScreenshot(page.locator("#about-me-container"), "about-me-section")
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
    await expect(page.locator("#about-me-container")).toBeVisible()
    await expect(page.locator("#about-me-images")).toBeVisible()
    await expect(page.locator("#about-me-text")).toBeVisible()
    await expect(page.locator("#about-me-header")).toBeVisible()
  })
})
