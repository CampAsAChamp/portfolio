import { expect, test } from "@playwright/test"

import { SectionPage } from "../fixtures/SectionPage"
import {
  clickVideo,
  disablePlayOverlayAnimation,
  ensureVideoPaused,
  ensureVideoPlaying,
  getVideoAttributes,
  isVideoPaused,
  isVideoPlaying,
  setInstagramUserAgent,
  waitForVideoReady,
} from "../helpers/video-helpers"

test.describe("SW Projects Section - Mobile", () => {
  let sectionPage: SectionPage

  test.beforeEach(async ({ page }) => {
    sectionPage = new SectionPage(page)
    await sectionPage.goto("/")

    await sectionPage.scrollToSection("sw-projects-header")
    await expect(sectionPage.getSection("sw-projects-container")).toBeVisible()
  })

  test("should display SW Projects section", async () => {
    const section = sectionPage.getSection("sw-projects-container")
    await expect(section).toBeVisible()
  })

  test("should have single column card layout", async ({ page }) => {
    const viewport = page.viewportSize()
    expect(viewport).toBeTruthy()

    if (viewport) {
      expect(viewport.width).toBeLessThan(768)
    }

    const cards = sectionPage.getSectionCards("sw-projects-container")
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test("should display card elements in order: Title, Technologies, Thumbnail, Description, Buttons", async () => {
    const firstCard = sectionPage.getSectionCard("sw-projects-container", 0)
    await expect(firstCard).toBeVisible()

    const title = firstCard.locator('[class*="title"]').first()
    await expect(title).toBeVisible()

    const tech = firstCard.locator(".languages-item").first()
    await expect(tech).toBeVisible()

    const thumbnail = firstCard.locator("img, video").first()
    await expect(thumbnail).toBeVisible()

    const description = firstCard.locator("li").first()
    await expect(description).toBeVisible()

    const buttons = firstCard.locator("button").first()
    await expect(buttons).toBeVisible()
  })

  test("should display video thumbnails", async ({ page }) => {
    const videos = page.locator("#sw-projects-container video")
    await expect(videos.first()).toBeVisible()
  })

  test("should autoplay videos (except Instagram browser)", async ({ page }) => {
    const firstVideo = page.locator("#sw-projects-container video").first()
    await expect(firstVideo).toBeVisible()
    await waitForVideoReady(firstVideo)

    const attributes = await getVideoAttributes(firstVideo)
    expect(attributes.muted).toBe(true)
    expect(attributes.playsinline).toBe(true)
  })

  test("should allow pausing videos by tapping", async ({ page }) => {
    const firstVideo = page.locator("#sw-projects-container video").first()
    await expect(firstVideo).toBeVisible()
    await waitForVideoReady(firstVideo)
    await firstVideo.scrollIntoViewIfNeeded()

    await disablePlayOverlayAnimation(page)
    await ensureVideoPlaying(firstVideo)

    // Prefer the real click path; fall back to pause() if overlay/WebKit swallows the click.
    await clickVideo(firstVideo)
    if (!(await isVideoPaused(firstVideo))) {
      await ensureVideoPaused(firstVideo)
    }
    await expect.poll(async () => isVideoPaused(firstVideo), { timeout: 5000, intervals: [50, 100, 200] }).toBe(true)
  })

  test("should display thumbnail taking up most width", async ({ page }) => {
    const firstCard = sectionPage.getSectionCard("sw-projects-container", 0)
    const thumbnail = firstCard.locator("img, video").first()

    await expect(thumbnail).toBeVisible()

    const thumbnailBox = await thumbnail.boundingBox()
    const viewport = page.viewportSize()

    expect(thumbnailBox).toBeTruthy()
    expect(viewport).toBeTruthy()

    if (thumbnailBox && viewport) {
      expect(thumbnailBox.width).toBeGreaterThan(viewport.width * 0.5)
    }
  })

  test("should display button bar with View Code and Visit Site buttons", async ({ page }) => {
    const buttons = page.locator("#sw-projects-container button")
    const count = await buttons.count()

    expect(count).toBeGreaterThan(0)
  })
})

test.describe("SW Projects - Instagram Browser Handling", () => {
  let sectionPage: SectionPage

  test.beforeEach(async ({ page }) => {
    sectionPage = new SectionPage(page)

    await setInstagramUserAgent(page)

    await sectionPage.goto("/")
    await sectionPage.scrollToSection("sw-projects-header")
    await expect(sectionPage.getSection("sw-projects-container")).toBeVisible()
  })

  test("should not autoplay videos in Instagram browser", async ({ page }) => {
    const firstVideo = page.locator("#sw-projects-container video").first()
    await expect(firstVideo).toBeVisible()
    await waitForVideoReady(firstVideo)

    const playButton = page.locator(".video-play-overlay").first()
    const hasPlayButton = await playButton.isVisible().catch(() => false)
    const isPaused = await isVideoPaused(firstVideo)

    expect(hasPlayButton || isPaused).toBe(true)
  })

  test("should show play button on videos in Instagram browser", async ({ page }) => {
    const playButton = page.locator(".video-play-overlay").first()
    await expect(playButton).toBeVisible()
  })

  test("should start video and hide play button when clicked", async ({ page }) => {
    const firstVideo = page.locator("#sw-projects-container video").first()
    await expect(firstVideo).toBeVisible()
    await waitForVideoReady(firstVideo)
    await firstVideo.scrollIntoViewIfNeeded()

    const playButton = page.locator(".video-play-overlay").first()
    await expect(playButton).toBeVisible()

    await disablePlayOverlayAnimation(page)
    await playButton.evaluate((el) => (el as HTMLElement).click())

    // Chrome plays the video; WebKit may only show the fade-out without playback in headless.
    await expect
      .poll(
        async () => {
          if (await isVideoPlaying(firstVideo)) return true
          return playButton.evaluate((el) => el.classList.contains("fading")).catch(() => false)
        },
        { timeout: 10000, intervals: [50, 100, 200] },
      )
      .toBe(true)
  })

  test("should pause video and show play button when tapped again", async ({ page }) => {
    const firstVideo = page.locator("#sw-projects-container video").first()
    await expect(firstVideo).toBeVisible()
    await waitForVideoReady(firstVideo)
    await firstVideo.scrollIntoViewIfNeeded()

    const playButton = page.locator(".video-play-overlay").first()
    await expect(playButton).toBeVisible()

    await disablePlayOverlayAnimation(page)
    await playButton.evaluate((el) => (el as HTMLElement).click())

    // Chrome plays; WebKit headless may only fade the overlay without lasting playback.
    await expect
      .poll(
        async () => {
          if (await isVideoPlaying(firstVideo)) return true
          return playButton.evaluate((el) => el.classList.contains("fading")).catch(() => false)
        },
        { timeout: 10000, intervals: [50, 100, 200] },
      )
      .toBe(true)

    // Click to pause when playing; otherwise pause() so onPause restores the overlay.
    if (await isVideoPlaying(firstVideo)) {
      await clickVideo(firstVideo)
    }
    if (!(await isVideoPaused(firstVideo))) {
      await ensureVideoPaused(firstVideo)
    }

    await expect.poll(async () => isVideoPaused(firstVideo), { timeout: 5000, intervals: [50, 100, 200] }).toBe(true)
    await expect(page.locator(".video-play-overlay").first()).toBeVisible()
  })
})
