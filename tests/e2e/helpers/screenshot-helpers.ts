import { expect, Locator, Page } from "@playwright/test"

import { waitForElementStable } from "./wait-helpers"

/**
 * Helper functions for screenshot capture with stability checks
 */

export interface ScreenshotOptions {
  fullPage?: boolean
  animations?: "disabled" | "allow"
  mask?: Locator[]
  timeout?: number
}

/**
 * Take a stable screenshot of the page
 */
export async function takeStableScreenshot(page: Page, name: string, options: ScreenshotOptions = {}): Promise<void> {
  const { fullPage = false, animations = "disabled", mask = [], timeout = 15000 } = options

  await page.waitForLoadState("domcontentloaded")
  await waitForImages(page)
  await waitForFonts(page)

  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage,
    animations,
    mask,
    timeout,
  })
}

/**
 * Take a stable screenshot of a specific element
 */
export async function takeElementScreenshot(locator: Locator, name: string, options: ScreenshotOptions = {}): Promise<void> {
  const { animations = "disabled", mask = [], timeout = 10000 } = options

  await locator.waitFor({ state: "visible", timeout })
  await waitForElementStable(locator, timeout)
  await waitForImages(locator.page())
  await waitForFonts(locator.page())

  await expect(locator).toHaveScreenshot(`${name}.png`, {
    animations,
    mask,
    timeout,
  })
}

/**
 * Screenshot a page section by container id — more stable than full-viewport captures.
 */
export async function takeSectionScreenshot(page: Page, sectionId: string, name: string, options: ScreenshotOptions = {}): Promise<void> {
  const { animations = "disabled", mask = [], timeout = 15000 } = options
  const section = page.locator(`#${sectionId}`)

  await section.scrollIntoViewIfNeeded()
  await section.waitFor({ state: "visible", timeout: timeout })
  await waitForImages(page)
  await waitForFonts(page)

  await expect(section).toHaveScreenshot(`${name}.png`, {
    animations,
    mask,
    timeout,
  })
}

/**
 * Take screenshot before and after an action for comparison
 */
export async function takeBeforeAfterScreenshots(
  page: Page,
  name: string,
  action: () => Promise<void>,
  options: ScreenshotOptions = {},
): Promise<void> {
  // Take before screenshot
  await takeStableScreenshot(page, `${name}-before`, options)

  // Perform action
  await action()

  // Wait for action effects to settle
  await page.waitForTimeout(300)

  // Take after screenshot
  await takeStableScreenshot(page, `${name}-after`, options)
}

/**
 * Take hover state screenshot
 */
export async function takeHoverScreenshot(locator: Locator, name: string, options: ScreenshotOptions = {}): Promise<void> {
  // Hover over element
  await locator.hover()

  // Wait for hover effect
  await locator.page().waitForTimeout(200)

  // Take screenshot
  await takeElementScreenshot(locator, `${name}-hover`, options)
}

/**
 * Take screenshots at different scroll positions
 */
export async function takeScrollScreenshots(
  page: Page,
  name: string,
  scrollPositions: number[],
  options: ScreenshotOptions = {},
): Promise<void> {
  for (let i = 0; i < scrollPositions.length; i++) {
    const position = scrollPositions[i]!
    await page.evaluate((y) => window.scrollTo(0, y), position)
    await page.waitForTimeout(300)
    await takeStableScreenshot(page, `${name}-scroll-${i + 1}`, options)
  }
}

/**
 * Take screenshots of all viewport sizes
 */
export async function takeResponsiveScreenshots(
  page: Page,
  name: string,
  viewports: Array<{ width: number; height: number; label: string }>,
  options: ScreenshotOptions = {},
): Promise<void> {
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.waitForTimeout(300)
    await takeStableScreenshot(page, `${name}-${viewport.label}`, options)
  }
}

/**
 * Take animation sequence screenshots
 */
export async function takeAnimationSequenceScreenshots(
  page: Page,
  name: string,
  trigger: () => Promise<void>,
  frames: number = 5,
  intervalMs: number = 200,
): Promise<void> {
  // Take initial state
  await takeStableScreenshot(page, `${name}-frame-0`, { animations: "allow" })

  // Trigger animation
  await trigger()

  // Capture frames
  for (let i = 1; i <= frames; i++) {
    await page.waitForTimeout(intervalMs)
    await expect(page).toHaveScreenshot(`${name}-frame-${i}.png`, {
      animations: "allow",
    })
  }
}

/**
 * Mask dynamic content before taking screenshot
 */
export function createMask(page: Page, selectors: string[]): Locator[] {
  return selectors.map((selector) => page.locator(selector))
}

/**
 * Wait for images to load before screenshot
 */
export async function waitForImages(page: Page): Promise<void> {
  // waitForFunction(fn, arg?, options?) — options must be the 3rd argument
  await page
    .waitForFunction(
      () => {
        const images = Array.from(document.querySelectorAll("img"))
        // Only require images currently in (or near) the viewport — below-fold lazy
        // images often have layout size but never complete until scrolled into view.
        const viewportImages = images.filter((img) => {
          const rect = img.getBoundingClientRect()
          return rect.bottom > 0 && rect.top < window.innerHeight && rect.width > 0 && rect.height > 0
        })
        return viewportImages.length === 0 || viewportImages.every((img) => img.complete && img.naturalHeight > 0)
      },
      undefined,
      { timeout: 5000 },
    )
    .catch(() => {
      // If images don't load in 5s, continue anyway
    })
}

/**
 * Wait for fonts to load before screenshot
 */
export async function waitForFonts(page: Page): Promise<void> {
  await page
    .waitForFunction(() => document.fonts.status === "loaded", undefined, { timeout: 5000 })
    .catch(() => {
      // If fonts don't load in 5s, continue anyway
    })
}

/**
 * Prepare page for stable screenshot
 */
export async function prepareForScreenshot(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle")
  await waitForImages(page)
  await waitForFonts(page)
  await page.waitForTimeout(300)
}
