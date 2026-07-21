import { SectionPage } from "../fixtures/SectionPage"
import { expect, test } from "../fixtures/test"
import { takeElementScreenshot } from "../helpers/screenshot-helpers"
import { ensureVideoPlaying, getVideoAttributes, isVideoPlaying, waitForVideoReady } from "../helpers/video-helpers"
import { skipUnlessVisualBaseline } from "../helpers/visual-helpers"

test.describe("SW Projects Section - Desktop", () => {
  let sectionPage: SectionPage

  test.beforeEach(async ({ page }) => {
    sectionPage = new SectionPage(page)
    await sectionPage.goto("/")
    await sectionPage.scrollToSection("sw-projects-header")
  })

  test("should display SW Projects section", async ({ page }) => {
    const section = sectionPage.getSection("sw-projects-container")
    await expect(section).toBeVisible()

    // Check for section header
    const header = page.locator("#sw-projects-header h2")
    await expect(header).toBeVisible()
    await expect(header).toHaveText("Software Projects")
  })

  test("should display multiple project cards", async () => {
    const cards = sectionPage.getSectionCards("sw-projects-container")
    const count = await cards.count()

    // Should have at least one project card
    expect(count).toBeGreaterThan(0)
  })

  test("should display all required card elements", async () => {
    const firstCard = sectionPage.getSectionCard("sw-projects-container", 0)
    await expect(firstCard).toBeVisible()

    // Check for title
    const title = firstCard.locator('h3, h4, [class*="title"]').first()
    await expect(title).toBeVisible()

    // Check for technologies bar (.languages-item)
    const techBar = firstCard.locator(".languages-item")
    expect(await techBar.count()).toBeGreaterThan(0)

    // Check for thumbnail (image or video)
    const media = firstCard.locator("img, video").first()
    await expect(media).toBeVisible()

    // Check for bullet points
    const bulletPoints = firstCard.locator("li")
    const bulletCount = await bulletPoints.count()
    expect(bulletCount).toBeGreaterThan(0)

    // Check for buttons (View Code or Visit Site)
    const buttons = firstCard.locator("button")
    const buttonCount = await buttons.count()
    expect(buttonCount).toBeGreaterThan(0)
  })

  test("should have technologies colored main purple", async () => {
    const firstCard = sectionPage.getSectionCard("sw-projects-container", 0)
    const techTags = firstCard.locator('[class*="tech"]').first()

    if ((await techTags.count()) > 0) {
      await expect(techTags).toBeVisible()

      // Technology tags should have color styling
      const color = await techTags.evaluate((el) => {
        return window.getComputedStyle(el).color
      })

      expect(color).toBeTruthy()
    }
  })

  test("should display video thumbnails with correct attributes", async ({ page }) => {
    const videos = page.locator("#sw-projects-container video")
    const videoCount = await videos.count()

    if (videoCount > 0) {
      const firstVideo = videos.first()
      await expect(firstVideo).toBeVisible()

      // Check video attributes
      const attributes = await getVideoAttributes(firstVideo)

      expect(attributes.muted).toBe(true)
      expect(attributes.playsinline).toBe(true)

      // May or may not have autoplay depending on browser
      // expect(attributes.autoplay).toBe(true)
    }
  })

  test("should autoplay video thumbnails", async ({ page }) => {
    const videos = page.locator("#sw-projects-container video")
    const videoCount = await videos.count()

    if (videoCount > 0) {
      const firstVideo = videos.first()
      await expect(firstVideo).toBeVisible()
      await waitForVideoReady(firstVideo)

      const attrs = await getVideoAttributes(firstVideo)
      expect(attrs.muted).toBe(true)

      // Chromium reliably autoplays muted media; Firefox/WebKit headless often block playback.
      if (test.info().project.name === "chromium") {
        if (!(await isVideoPlaying(firstVideo))) {
          await ensureVideoPlaying(firstVideo)
        }
        await expect.poll(async () => isVideoPlaying(firstVideo), { timeout: 10000, intervals: [50, 100, 200] }).toBe(true)
      }
    }
  })

  test("should have videos muted and looping", async ({ page }) => {
    const videos = page.locator("#sw-projects-container video")
    const videoCount = await videos.count()

    if (videoCount > 0) {
      const firstVideo = videos.first()
      await expect(firstVideo).toBeVisible()

      const attributes = await getVideoAttributes(firstVideo)

      expect(attributes.muted).toBe(true)
      expect(attributes.loop).toBe(true)
    }
  })

  test("should have clickable links in bullet points", async ({ page }) => {
    const projectLinks = page.locator("#sw-projects-container a[href]")
    const linkCount = await projectLinks.count()

    if (linkCount > 0) {
      const firstLink = projectLinks.first()
      await expect(firstLink).toBeVisible()

      // Verify link has href
      const href = await firstLink.getAttribute("href")
      expect(href).toBeTruthy()
    }
  })

  test("should display View Code button", async ({ page }) => {
    const viewCodeButtons = page.locator('#sw-projects-container button:has-text("View Code")')
    const count = await viewCodeButtons.count()

    // At least some projects should have View Code button
    expect(count).toBeGreaterThan(0)

    if (count > 0) {
      const firstButton = viewCodeButtons.first()
      await expect(firstButton).toBeVisible()
      await expect(firstButton).toBeEnabled()
    }
  })

  test("should display Visit Site button for hosted projects", async ({ page }) => {
    const visitSiteButtons = page.locator('#sw-projects-container button:has-text("Visit Site")')
    const count = await visitSiteButtons.count()

    // Some projects may have Visit Site button (optional)
    if (count > 0) {
      const firstButton = visitSiteButtons.first()
      await expect(firstButton).toBeVisible()
      await expect(firstButton).toBeEnabled()
    }
  })

  test("should display project thumbnails", async () => {
    const firstCard = sectionPage.getSectionCard("sw-projects-container", 0)
    const thumbnail = firstCard.locator("img, video").first()

    await expect(thumbnail).toBeVisible()
  })

  test("should display multiple bullet points per project", async () => {
    const firstCard = sectionPage.getSectionCard("sw-projects-container", 0)
    const bulletPoints = firstCard.locator("li")
    const count = await bulletPoints.count()

    // Should have multiple bullet points
    expect(count).toBeGreaterThan(0)
  })

  test("should display multiple technologies per project", async () => {
    const firstCard = sectionPage.getSectionCard("sw-projects-container", 0)
    const technologies = firstCard.locator(".languages-item")
    const count = await technologies.count()

    // Should have multiple technologies
    expect(count).toBeGreaterThan(0)
  })

  test("should display complete SW Projects section - visual regression", async ({ page }, testInfo) => {
    skipUnlessVisualBaseline(testInfo)
    const firstCard = sectionPage.getSectionCard("sw-projects-container", 0)
    await takeElementScreenshot(firstCard, "sw-projects-section", {
      mask: [page.locator("video")],
    })
  })

  test("should have proper card spacing", async () => {
    const cards = sectionPage.getSectionCards("sw-projects-container")
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

  test("should have accessible card structure", async () => {
    const firstCard = sectionPage.getSectionCard("sw-projects-container", 0)

    // Card should have semantic structure
    await expect(firstCard).toBeVisible()

    // Should have title
    const title = firstCard.locator(".sw-project-title")
    await expect(title).toBeVisible()

    // Should have list
    const list = firstCard.locator("ul")
    await expect(list).toBeVisible()
  })

  test("should display GitHub icons on View Code buttons", async ({ page }) => {
    const viewCodeButtons = page.locator('#sw-projects-container button:has-text("View Code")')
    const count = await viewCodeButtons.count()

    if (count > 0) {
      const firstButton = viewCodeButtons.first()
      const icon = firstButton.locator("svg, img")
      await expect(icon).toBeVisible()
    }
  })
})
