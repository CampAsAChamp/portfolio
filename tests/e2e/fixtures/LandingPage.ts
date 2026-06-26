import { Locator, Page } from "@playwright/test"

import { BasePage } from "./BasePage"

/**
 * Page object for Landing Page interactions
 */
export class LandingPage extends BasePage {
  // Main elements
  readonly title: Locator
  readonly subtitle: Locator
  readonly description: Locator
  readonly profilePic: Locator
  readonly contactMeButton: Locator
  readonly githubLink: Locator
  readonly linkedinLink: Locator
  readonly mouseScrollIndicator: Locator

  constructor(page: Page) {
    super(page)

    // Landing page elements with correct IDs and selectors
    this.title = page.locator("#name")
    this.subtitle = page.locator("#software-engineer")
    this.description = page.locator("#subtitle")
    this.profilePic = page.locator("#profile-pic")
    this.contactMeButton = page.locator("#contact-me-button")
    this.githubLink = page.locator('#contact-me-socials a[href*="github.com"]')
    this.linkedinLink = page.locator('#contact-me-socials a[href*="linkedin.com"]')
    this.mouseScrollIndicator = page.locator("#mouse-scroll-indicator")
  }

  /**
   * Check if all landing page elements are visible
   */
  async verifyAllElementsVisible(): Promise<void> {
    await this.title.waitFor({ state: "visible" })
    await this.subtitle.waitFor({ state: "visible" })
    await this.profilePic.waitFor({ state: "visible" })
    await this.contactMeButton.waitFor({ state: "visible" })
  }

  /**
   * Click contact me button
   */
  async clickContactMe(): Promise<void> {
    await this.contactMeButton.click()
  }

  /**
   * Get social link URLs
   */
  async getGithubUrl(): Promise<string | null> {
    return await this.githubLink.getAttribute("href")
  }

  async getLinkedinUrl(): Promise<string | null> {
    return await this.linkedinLink.getAttribute("href")
  }

  /**
   * Check if mouse scroll indicator is visible
   */
  async isMouseScrollIndicatorVisible(): Promise<boolean> {
    return await this.mouseScrollIndicator.isVisible()
  }

  /**
   * Wait for landing page animations to complete
   */
  async waitForLandingAnimations(): Promise<void> {
    // Wait for elements to animate in
    await this.page.waitForTimeout(2000) // Allow time for staggered animations
  }
}
