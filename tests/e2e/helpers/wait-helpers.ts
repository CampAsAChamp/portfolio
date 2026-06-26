import { Locator, Page } from "@playwright/test"

/**
 * Reusable waiting utilities to avoid flaky arbitrary timeouts
 */

/**
 * Wait for element to be stable (not moving/animating)
 */
export async function waitForElementStable(locator: Locator, timeout = 5000): Promise<void> {
  let lastPosition: { x: number; y: number } | null = null
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    try {
      const box = await locator.boundingBox()
      if (!box) {
        await locator.waitFor({ state: "visible", timeout: 1000 })
        continue
      }

      if (lastPosition && lastPosition.x === box.x && lastPosition.y === box.y) {
        // Position hasn't changed, element is stable
        return
      }

      lastPosition = { x: box.x, y: box.y }
      await new Promise((resolve) => setTimeout(resolve, 50))
    } catch {
      // Element might not be ready yet
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

/**
 * Wait for all animations to complete on page
 */
export async function waitForAllAnimations(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    const elements = document.querySelectorAll("*")
    for (const element of Array.from(elements)) {
      const animations = element.getAnimations()
      const hasActiveAnimations = animations.some((anim) => anim.playState === "running")
      if (hasActiveAnimations) return false
    }
    return true
  })
}

/**
 * Wait for element to have specific class
 */
export async function waitForClass(locator: Locator, className: string, timeout = 5000): Promise<void> {
  await locator.waitFor({ state: "attached", timeout })
  await locator.evaluate((element, cls) => {
    return new Promise<void>((resolve) => {
      const checkClass = (): void => {
        if (element.classList.contains(cls)) {
          resolve()
        } else {
          setTimeout(checkClass, 50)
        }
      }
      checkClass()
    })
  }, className)
}

/**
 * Wait for element to not have specific class
 */
export async function waitForClassRemoved(locator: Locator, className: string, timeout = 5000): Promise<void> {
  await locator.waitFor({ state: "attached", timeout })
  await locator.evaluate((element, cls) => {
    return new Promise<void>((resolve) => {
      const checkClass = (): void => {
        if (!element.classList.contains(cls)) {
          resolve()
        } else {
          setTimeout(checkClass, 50)
        }
      }
      checkClass()
    })
  }, className)
}

/**
 * Wait for scroll to complete (position stable for consecutive checks)
 */
export async function waitForScrollComplete(page: Page, timeout = 8000): Promise<void> {
  let lastScrollY = -1
  let stableCount = 0
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const currentScrollY = await page.evaluate(() => window.scrollY)

    if (lastScrollY === currentScrollY) {
      stableCount++
      if (stableCount >= 3) {
        return
      }
    } else {
      stableCount = 0
    }

    lastScrollY = currentScrollY
    await page.waitForTimeout(100)
  }
}

/**
 * Wait for an element to scroll into the viewport after navigation
 */
export async function waitForSectionInViewport(page: Page, elementId: string, timeout = 15000): Promise<void> {
  await page.waitForFunction(
    (id) => {
      const element = document.getElementById(id)
      if (!element) return false

      const rect = element.getBoundingClientRect()
      return rect.top < window.innerHeight && rect.bottom > 0
    },
    elementId,
    { timeout },
  )
}

/**
 * Poll for condition with timeout
 */
export async function pollForCondition<T>(
  checkFn: () => Promise<T>,
  isValid: (result: T) => boolean,
  options: { timeout?: number; interval?: number } = {},
): Promise<T> {
  const { timeout = 5000, interval = 100 } = options
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    const result = await checkFn()
    if (isValid(result)) {
      return result
    }
    await new Promise((resolve) => setTimeout(resolve, interval))
  }

  throw new Error(`Condition not met within ${timeout}ms`)
}
