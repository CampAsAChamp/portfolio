import { Page } from "@playwright/test"

/**
 * Helper functions for viewport and responsive testing
 */

export const VIEWPORTS = {
  DESKTOP_HD: { width: 1920, height: 1080 },
  DESKTOP: { width: 1440, height: 900 },
  LAPTOP: { width: 1280, height: 800 },
  TABLET_LANDSCAPE: { width: 1024, height: 768 },
  TABLET_PORTRAIT: { width: 768, height: 1024 },
  MOBILE_LANDSCAPE: { width: 667, height: 375 },
  MOBILE_PORTRAIT: { width: 375, height: 667 },
  IPHONE_12: { width: 390, height: 844 },
  PIXEL_5: { width: 393, height: 851 },
}

/**
 * Set viewport to specific dimensions
 */
export async function setViewport(page: Page, width: number, height: number): Promise<void> {
  await page.setViewportSize({ width, height })
  // Wait for any responsive layout changes
  await page.waitForTimeout(200)
}

/**
 * Set viewport to predefined size
 */
export async function setViewportPreset(page: Page, preset: keyof typeof VIEWPORTS): Promise<void> {
  const viewport = VIEWPORTS[preset]
  await setViewport(page, viewport.width, viewport.height)
}

/**
 * Check if current viewport is mobile size
 */
export function isMobileViewport(page: Page): boolean {
  const viewport = page.viewportSize()
  return viewport ? viewport.width < 768 : false
}

/**
 * Check if current viewport is tablet size
 */
export function isTabletViewport(page: Page): boolean {
  const viewport = page.viewportSize()
  return viewport ? viewport.width >= 768 && viewport.width < 1024 : false
}

/**
 * Check if current viewport is desktop size
 */
export function isDesktopViewport(page: Page): boolean {
  const viewport = page.viewportSize()
  return viewport ? viewport.width >= 1024 : false
}

/**
 * Get current viewport dimensions
 */
export function getViewport(page: Page): { width: number; height: number } | null {
  return page.viewportSize()
}

/**
 * Check if element is in viewport
 */
export async function isElementInViewport(page: Page, selector: string): Promise<boolean> {
  return await page.evaluate((sel) => {
    const element = document.querySelector(sel)
    if (!element) return false

    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }, selector)
}

/**
 * Get viewport scroll percentage
 */
export async function getScrollPercentage(page: Page): Promise<number> {
  return await page.evaluate(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
  })
}

/**
 * Check if viewport supports hover (not touch-only device)
 */
export async function supportsHover(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return window.matchMedia("(hover: hover)").matches
  })
}

/**
 * Check if user prefers reduced motion
 */
export async function prefersReducedMotion(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })
}
