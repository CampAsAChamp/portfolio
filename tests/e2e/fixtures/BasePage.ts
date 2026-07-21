import { Locator, Page } from "@playwright/test"

import { waitForElementStable } from "../helpers/wait-helpers"

/**
 * Base page object with common functionality for all pages
 */
export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Navigate to a specific URL
   */
  async goto(url: string = "/"): Promise<void> {
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
    // Prefer direct scrollTop writes — window.scrollTo({ behavior: "auto" }) can no-op on WebKit.
    // Clamp to max scrollable offset (callers often overshoot). Hard-timeout the evaluate so a
    // wedged WebKit page cannot burn the full test budget.
    try {
      await Promise.race([
        this.page.evaluate((yPos) => {
          const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
          const target = Math.min(Math.max(0, yPos), maxScroll)
          document.documentElement.scrollTop = target
          document.body.scrollTop = target
          window.scrollTo(0, target)
          window.dispatchEvent(new Event("scroll"))
        }, y),
        new Promise((_, reject) => setTimeout(() => reject(new Error("scrollToPosition evaluate timed out")), 4000)),
      ])
    } catch {
      return
    }

    await this.page
      .waitForFunction(
        (yPos) => {
          const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
          const target = Math.min(Math.max(0, yPos), maxScroll)
          const current = window.scrollY || document.documentElement.scrollTop || 0
          return Math.abs(current - target) < 5
        },
        y,
        { timeout: 3000 },
      )
      .catch(() => {
        // Soft-fail: some engines report scrollY with sub-pixel lag; callers assert UI outcomes.
      })
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
