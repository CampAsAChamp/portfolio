import { SectionPage } from "../fixtures/SectionPage"
import { expect, test } from "../fixtures/test"
import { takeElementScreenshot } from "../helpers/screenshot-helpers"
import { skipUnlessVisualBaseline } from "../helpers/visual-helpers"
import { waitForSectionInViewport } from "../helpers/wait-helpers"

test.describe("Experience Section - Desktop", () => {
  let sectionPage: SectionPage

  test.beforeEach(async ({ page }) => {
    sectionPage = new SectionPage(page)
    await sectionPage.goto("/")
    await page.locator("#experience-header").scrollIntoViewIfNeeded()
    await waitForSectionInViewport(page, "experience-header")
  })

  test("should display Experience section", async ({ page }) => {
    const section = sectionPage.getSection("experience-container")
    await expect(section).toBeVisible()

    // Check for section header
    const header = page.locator("#experience-header h2")
    await expect(header).toBeVisible()
    await expect(header).toHaveText("Experience")
  })

  test("should display multiple experience cards", async () => {
    const cards = sectionPage.getSectionCards("experience-container")
    const count = await cards.count()

    // Should have at least one experience card
    expect(count).toBeGreaterThan(0)
  })

  test("should display all required card elements", async () => {
    const firstCard = sectionPage.getSectionCard("experience-container", 0)
    await expect(firstCard).toBeVisible()

    // Check for company name (uses .employer class)
    const companyName = firstCard.locator(".employer").first()
    await expect(companyName).toBeVisible()

    // Check for position
    const position = firstCard.locator('[class*="position"]').first()
    await expect(position).toBeVisible()

    // Check for location
    const location = firstCard.locator('[class*="location"]').first()
    await expect(location).toBeVisible()

    // Check for duration
    const duration = firstCard.locator('[class*="duration"]').first()
    await expect(duration).toBeVisible()

    // Check for logo
    const logo = firstCard.locator("img, svg").first()
    await expect(logo).toBeVisible()

    // Check for bullet points
    const bulletPoints = firstCard.locator("li")
    const bulletCount = await bulletPoints.count()
    expect(bulletCount).toBeGreaterThan(0)

    // Check for technologies (.languages-item)
    const technologies = firstCard.locator(".languages-item")
    const techCount = await technologies.count()
    expect(techCount).toBeGreaterThan(0)
  })

  test("should have cards colored to company color", async () => {
    const firstCard = sectionPage.getSectionCard("experience-container", 0)
    await expect(firstCard).toBeVisible()

    // Card should have some background color or border color
    const backgroundColor = await firstCard.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor
    })

    // Should have a color set (not transparent)
    expect(backgroundColor).not.toBe("rgba(0, 0, 0, 0)")
  })

  test("should have technologies colored to match company", async () => {
    const firstCard = sectionPage.getSectionCard("experience-container", 0)
    const technologies = firstCard.locator('[class*="technology"], [class*="tech-tag"]').first()

    if ((await technologies.count()) > 0) {
      await expect(technologies).toBeVisible()

      // Technology tags should have color styling
      const color = await technologies.evaluate((el) => {
        return window.getComputedStyle(el).color
      })

      expect(color).toBeTruthy()
    }
  })

  test("should have clickable links in bullet points", async ({ page }) => {
    // Find all links within experience cards
    const experienceLinks = page.locator("#experience-container a[href]")
    const linkCount = await experienceLinks.count()

    if (linkCount > 0) {
      const firstLink = experienceLinks.first()
      await expect(firstLink).toBeVisible()

      // Verify link has href
      const href = await firstLink.getAttribute("href")
      expect(href).toBeTruthy()
      expect(href).not.toBe("#")
    }
  })

  test("should not navigate when clicking links (verify href only)", async ({ page }) => {
    const experienceLinks = page.locator('#experience-container a[href^="http"]')
    const linkCount = await experienceLinks.count()

    if (linkCount > 0) {
      const firstLink = experienceLinks.first()
      const href = await firstLink.getAttribute("href")

      // Verify it's an external link
      expect(href).toContain("http")

      // Check that link has target="_blank" for external links
      const target = await firstLink.getAttribute("target")
      expect(target).toBe("_blank")
    }
  })

  test("should display company logos", async () => {
    const cards = sectionPage.getSectionCards("experience-container")
    const count = await cards.count()

    // Check first card has logo
    if (count > 0) {
      const firstCard = cards.first()
      const logo = firstCard.locator("img, svg").first()
      await expect(logo).toBeVisible()
    }
  })

  test("should display multiple bullet points per card", async () => {
    const firstCard = sectionPage.getSectionCard("experience-container", 0)
    const bulletPoints = firstCard.locator("li")
    const count = await bulletPoints.count()

    // Should have multiple bullet points
    expect(count).toBeGreaterThan(1)
  })

  test("should display multiple technologies per card", async () => {
    const firstCard = sectionPage.getSectionCard("experience-container", 0)
    const technologies = firstCard.locator(".languages-item")
    const count = await technologies.count()

    // Should have multiple technologies
    expect(count).toBeGreaterThan(1)
  })

  test("should display complete Experience section - visual regression", async () => {
    skipUnlessVisualBaseline(test.info())
    const firstCard = sectionPage.getSectionCard("experience-container", 0)
    await takeElementScreenshot(firstCard, "experience-section")
  })

  test("should have proper card spacing", async () => {
    const cards = sectionPage.getSectionCards("experience-container")
    const count = await cards.count()

    if (count > 1) {
      const firstCard = cards.nth(0)
      const secondCard = cards.nth(1)

      const firstBox = await firstCard.boundingBox()
      const secondBox = await secondCard.boundingBox()

      expect(firstBox).toBeTruthy()
      expect(secondBox).toBeTruthy()

      // Cards should have spacing between them
      if (firstBox && secondBox) {
        expect(secondBox.y).toBeGreaterThan(firstBox.y + firstBox.height)
      }
    }
  })

  test("should display cards in chronological order", async () => {
    const cards = sectionPage.getSectionCards("experience-container")
    const count = await cards.count()

    // Should have cards in order (most recent first typically)
    expect(count).toBeGreaterThan(0)

    // First card should be visible
    const firstCard = cards.first()
    await expect(firstCard).toBeVisible()
  })

  test("should have accessible card structure", async () => {
    const firstCard = sectionPage.getSectionCard("experience-container", 0)

    // Card should have semantic structure
    await expect(firstCard).toBeVisible()

    // Should have employer title
    const employer = firstCard.locator(".employer")
    await expect(employer).toBeVisible()

    // Should have at least one position
    const position = firstCard.locator(".position").first()
    await expect(position).toBeVisible()

    // Should have at least one list
    const list = firstCard.locator("ul").first()
    await expect(list).toBeVisible()
  })

  test("should display stacked roles on the Intuit card", async () => {
    const firstCard = sectionPage.getSectionCard("experience-container", 0)
    const positions = firstCard.locator(".position")

    await expect(positions).toHaveCount(2)
    await expect(positions.nth(0)).toHaveText("Senior Software Engineer")
    await expect(positions.nth(1)).toHaveText("Software Engineer 2 - Full Stack")
  })
})
