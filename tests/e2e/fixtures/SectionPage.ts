import { Locator, Page } from "@playwright/test"

import { waitForElementStable, waitForSectionInViewport } from "../helpers/wait-helpers"
import { BasePage } from "./BasePage"

/**
 * Page object for common section operations
 */
export class SectionPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  /**
   * Get section by ID
   */
  getSection(id: string): Locator {
    return this.page.locator(`#${id}, section[id="${id}"]`)
  }

  /**
   * Get section by heading text
   */
  getSectionByHeading(headingText: string): Locator {
    return this.page.locator(`section:has(h2:has-text("${headingText}")), section:has(h3:has-text("${headingText}"))`)
  }

  /**
   * Scroll to section by ID and wait until it is in view / layout-stable
   */
  async scrollToSection(id: string): Promise<void> {
    const section = this.getSection(id)
    await this.scrollToElement(section)
    await waitForSectionInViewport(this.page, id)
    await waitForElementStable(section)
  }

  /**
   * Check if section is in viewport
   */
  async isSectionInViewport(id: string): Promise<boolean> {
    const section = this.getSection(id)
    const box = await section.boundingBox()
    if (!box) return false
    return await this.page.evaluate((rect) => {
      return rect.y < window.innerHeight && rect.y + rect.height > 0
    }, box)
  }

  /**
   * Get all animated elements in a section
   */
  getSectionAnimatedElements(sectionId: string): Locator {
    return this.page.locator(`#${sectionId} [class*="animate"], #${sectionId} [data-animate]`)
  }

  /**
   * Wait for section animations to trigger
   */
  async waitForSectionAnimations(sectionId: string): Promise<void> {
    await this.scrollToSection(sectionId)
    const animated = this.getSectionAnimatedElements(sectionId).first()
    if ((await animated.count()) > 0) {
      await waitForElementStable(animated)
    }
  }

  /**
   * Get all cards in a section
   */
  getSectionCards(sectionId: string): Locator {
    return this.page.locator(`#${sectionId} .card`)
  }

  /**
   * Get specific card by index
   */
  getSectionCard(sectionId: string, index: number): Locator {
    return this.getSectionCards(sectionId).nth(index)
  }

  /**
   * Hover over element and wait for hover effect to apply
   */
  async hoverElement(locator: Locator): Promise<void> {
    await locator.hover()
    await waitForElementStable(locator)
  }

  /**
   * Get section background element
   */
  getSectionBackground(sectionId: string): Locator {
    return this.page.locator(`#${sectionId} [class*="background"], #${sectionId} [class*="blob"]`).first()
  }
}
