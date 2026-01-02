import { Page } from "@playwright/test"

/**
 * Checks if the current page is in a mobile viewport.
 *
 * @param page - The Playwright Page object
 * @returns True if viewport width is <= 1100px, false otherwise
 */
export function isMobileViewport(page: Page): boolean {
  const viewport = page.viewportSize()
  return viewport ? viewport.width <= 1100 : false
}

/**
 * Opens the hamburger menu on mobile viewports.
 * Does nothing if not in mobile viewport or if menu is not visible.
 *
 * @param page - The Playwright Page object
 */
export async function openMobileMenu(page: Page): Promise<void> {
  const isMobile = isMobileViewport(page)
  if (isMobile) {
    const hamburger = page.locator(".hamburger-menu")
    if (await hamburger.isVisible()) {
      await hamburger.click()
      await page.waitForTimeout(500) // Wait for menu animation
    }
  }
}

/**
 * Clicks a navigation link, handling mobile menu opening if needed.
 *
 * @param page - The Playwright Page object
 * @param href - The href attribute of the link to click (e.g., '#about-me-images')
 */
export async function clickNavLink(page: Page, href: string): Promise<void> {
  await openMobileMenu(page)
  await page.locator(`a[href="${href}"]`).click()
  await page.waitForTimeout(500) // Wait for scroll/navigation
}

/**
 * Waits for the page to be fully ready for screenshots.
 * This includes waiting for network idle, fonts, images, and page height stabilization.
 *
 * @param page - The Playwright Page object
 */
export async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle")
  await page.evaluate(() => document.fonts.ready)
  await waitForImagesToLoad(page)
  await page.waitForTimeout(1500) // Wait for lazy-loaded content and animations
  await waitForPageHeightStable(page)
}

/**
 * Waits for all images to load with a timeout to prevent hanging.
 *
 * @param page - The Playwright Page object
 */
async function waitForImagesToLoad(page: Page): Promise<void> {
  await page.evaluate(() => {
    const imagePromises = Array.from(document.images)
      .filter((img) => !img.complete)
      .map(
        (img) =>
          new Promise((resolve) => {
            img.onload = img.onerror = resolve
            setTimeout(resolve, 5000) // Timeout after 5 seconds per image
          }),
      )
    return Promise.all(imagePromises)
  })
}

/**
 * Waits for page height to stabilize by checking multiple times.
 * Prevents flaky screenshots from content still loading.
 *
 * @param page - The Playwright Page object
 * @param maxIterations - Maximum number of iterations to check (default: 20, max ~6 seconds)
 */
async function waitForPageHeightStable(page: Page, maxIterations = 20): Promise<void> {
  let stableCount = 0
  let previousHeight = 0
  let iterations = 0

  while (stableCount < 3 && iterations < maxIterations) {
    const currentHeight = await page.evaluate(() => document.body.scrollHeight)
    if (currentHeight === previousHeight) {
      stableCount++
    } else {
      stableCount = 0
      previousHeight = currentHeight
    }
    await page.waitForTimeout(300)
    iterations++
  }
}

/**
 * Waits for an element's animation to complete.
 * Uses animation completion detection instead of fixed timeouts.
 *
 * @param page - The Playwright Page object
 * @param selector - CSS selector of the animated element
 * @param maxTimeout - Maximum time to wait in milliseconds (default: 5000)
 */
export async function waitForAnimation(page: Page, selector: string, maxTimeout = 5000): Promise<void> {
  try {
    await page.waitForFunction(
      (sel) => {
        const element = document.querySelector(sel)
        if (!element) return false
        const styles = window.getComputedStyle(element)
        // Check if animation has finished (opacity = 1, no running animations)
        return styles.opacity === "1" && styles.animationPlayState !== "running"
      },
      selector,
      { timeout: maxTimeout },
    )
  } catch {
    // Fallback: if animation detection fails, wait for generous timeout
    await page.waitForTimeout(maxTimeout / 2)
  }
}

/**
 * Gets computed animation CSS properties for an element.
 *
 * @param page - The Playwright Page object
 * @param selector - CSS selector of the element
 * @returns Object containing animation properties
 */
export async function getAnimationProperties(
  page: Page,
  selector: string,
): Promise<{
  duration: string
  delay: string
  fillMode: string
  playState: string
  opacity: string
}> {
  return await page.locator(selector).evaluate((el) => {
    const styles = window.getComputedStyle(el)
    return {
      duration: styles.animationDuration,
      delay: styles.animationDelay,
      fillMode: styles.animationFillMode,
      playState: styles.animationPlayState,
      opacity: styles.opacity,
    }
  })
}

/**
 * Verifies that an element has the expected animation classes.
 *
 * @param page - The Playwright Page object
 * @param selector - CSS selector of the element
 * @param expectedClasses - Array of class names that should be present
 */
export async function verifyAnimationClasses(page: Page, selector: string, expectedClasses: string[]): Promise<void> {
  const element = page.locator(selector)
  for (const className of expectedClasses) {
    await element.waitFor({ state: "attached" })
    const hasClass = await element.evaluate((el, cls) => el.classList.contains(cls), className)
    if (!hasClass) {
      throw new Error(`Element ${selector} does not have class ${className}`)
    }
  }
}
