import { Locator, Page } from "@playwright/test"

import { waitForElementStable } from "../helpers/wait-helpers"

/**
 * Base page object with common functionality for all pages
 */
export class BasePage {
  readonly page: Page
  private scrollStorageCleared = false

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string = "/"): Promise<void> {
    // Clear before any page script runs so restore cannot fight programmatic scrolls in e2e.
    if (!this.scrollStorageCleared) {
      await this.page.addInitScript(() => {
        try {
          sessionStorage.removeItem("portfolio-scroll-y")
        } catch {
          // Ignore private-mode / disabled storage
        }
      })
      this.scrollStorageCleared = true
    }
    await this.page.goto(url, { waitUntil: "domcontentloaded" })
  }

  /**
   * Scroll to a specific element
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded()
  }

  /**
   * Scroll to a specific Y position
   */
  async scrollToPosition(y: number): Promise<void> {
    const target = await this.resolveScrollTarget(y)
    const reached = await this.tryDirectScrollTo(target)
    if (reached) return

    await this.scrollViaWheel(target)
  }

  /**
   * Scroll back to the top of the page (user-input fallback for WebKit).
   */
  async scrollToTop(): Promise<void> {
    const current = await this.getScrollPosition()
    if (current < 50) return

    try {
      await this.page.keyboard.press("Home")
      await this.page.waitForFunction(() => window.scrollY < 50, undefined, { timeout: 3000 }).catch(() => undefined)
    } catch {
      // Home key may not move scroll in headless WebKit — fall back to wheel.
    }

    const afterHome = await this.getScrollPosition()
    if (afterHome < 50) return

    await this.scrollViaWheel(0)
  }

  private async resolveScrollTarget(y: number): Promise<number> {
    return await this.page.evaluate((yPos) => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
      return Math.min(Math.max(0, yPos), maxScroll)
    }, y)
  }

  private async tryDirectScrollTo(target: number): Promise<boolean> {
    // Prefer direct scrollTop writes — window.scrollTo({ behavior: "auto" }) can no-op on WebKit.
    // Hard-timeout the evaluate so a wedged WebKit page cannot burn the full test budget.
    try {
      await Promise.race([
        this.page.evaluate((yPos) => {
          document.documentElement.scrollTop = yPos
          document.body.scrollTop = yPos
          window.scrollTo(0, yPos)
          window.dispatchEvent(new Event("scroll"))
        }, target),
        new Promise((_, reject) => setTimeout(() => reject(new Error("scrollToPosition evaluate timed out")), 4000)),
      ])
    } catch {
      return false
    }

    try {
      await this.page.waitForFunction(
        (yPos) => {
          const current = window.scrollY || document.documentElement.scrollTop || 0
          return Math.abs(current - yPos) < 5
        },
        target,
        { timeout: 3000 },
      )
      return true
    } catch {
      return false
    }
  }

  private async scrollViaWheel(target: number): Promise<void> {
    const tolerance = 5
    const maxSteps = 80
    const wheelDelta = 400

    await this.page.mouse.move(400, 400)

    for (let step = 0; step < maxSteps; step++) {
      const current = await this.getScrollPosition()
      if (Math.abs(current - target) < tolerance) return

      const delta = target > current ? wheelDelta : -wheelDelta
      await this.page.mouse.wheel(0, delta)
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }

  /**
   * Get current scroll position
   */
  async getScrollPosition(): Promise<number> {
    return await this.page.evaluate(() => window.scrollY)
  }

  /**
   * Wait for element to be visible and stable
   */
  async waitForStableElement(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible" })
    await waitForElementStable(locator)
  }

  /**
   * Clear localStorage
   */
  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear())
  }

  /**
   * Clear client storage and reload via navigation (avoids WebKit `page.reload` crashes).
   */
  async clearStorageAndGoto(url: string = "/"): Promise<void> {
    await this.goto(url)
    await this.clearLocalStorage()
    await this.goto(url)
  }

  /**
   * Get localStorage item
   */
  async getLocalStorageItem(key: string): Promise<string | null> {
    return await this.page.evaluate((storageKey) => localStorage.getItem(storageKey), key)
  }

  /**
   * Set localStorage item
   */
  async setLocalStorageItem(key: string, value: string): Promise<void> {
    await this.page.evaluate(({ storageKey, storageValue }) => localStorage.setItem(storageKey, storageValue), {
      storageKey: key,
      storageValue: value,
    })
  }

  /**
   * Wait for animations to complete on an element
   */
  async waitForAnimationsComplete(locator: Locator): Promise<void> {
    await this.page.waitForFunction(
      (element) => {
        if (!element) return true
        const animations = element.getAnimations()
        return animations.length === 0 || animations.every((anim) => anim.playState === "finished")
      },
      await locator.elementHandle(),
    )
  }

  /**
   * Check if element has specific class
   */
  async hasClass(locator: Locator, className: string): Promise<boolean> {
    const classes = await locator.getAttribute("class")
    return classes ? classes.split(" ").includes(className) : false
  }
}
