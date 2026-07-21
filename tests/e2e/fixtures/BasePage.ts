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
    await this.page.evaluate((yPos) => window.scrollTo({ top: yPos, behavior: "instant" }), y)
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
