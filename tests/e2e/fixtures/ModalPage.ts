import { Locator, Page } from "@playwright/test"

import { BasePage } from "./BasePage"

/**
 * Page object for Modal interactions (Contact Me, Art Gallery)
 */
export class ModalPage extends BasePage {
  readonly modal: Locator
  readonly modalBackdrop: Locator
  readonly closeButton: Locator
  readonly modalContent: Locator

  constructor(page: Page) {
    super(page)

    // Modal elements
    this.modal = page.locator('[class*="modal"][class*="open"], [role="dialog"]').first()
    this.modalBackdrop = page.locator('[class*="backdrop"], [class*="overlay"]').first()
    this.closeButton = page.locator('[class*="modal"] button[class*="close"], [class*="modal"] [aria-label*="close" i]').first()
    this.modalContent = page.locator('[class*="modal-content"], [class*="modal-body"]').first()
  }

  /**
   * Wait for modal to open with animation
   */
  async waitForModalOpen(): Promise<void> {
    await this.modal.waitFor({ state: "visible" })
    // Wait for opening animation
    await this.page.waitForTimeout(300)
  }

  /**
   * Wait for modal to close with animation
   */
  async waitForModalClose(): Promise<void> {
    await this.modal.waitFor({ state: "hidden" })
  }

  /**
   * Check if modal is open
   */
  async isModalOpen(): Promise<boolean> {
    return await this.modal.isVisible()
  }

  /**
   * Close modal by clicking X button
   */
  async closeByButton(): Promise<void> {
    await this.closeButton.click()
    await this.waitForModalClose()
  }

  /**
   * Close modal by clicking backdrop
   */
  async closeByBackdrop(): Promise<void> {
    // Click backdrop outside modal content
    const box = await this.modal.boundingBox()
    if (box) {
      // Click outside the modal content (top-left corner of backdrop)
      await this.page.mouse.click(10, 10)
    }
    await this.waitForModalClose()
  }

  /**
   * Close modal by pressing ESC key
   */
  async closeByEscape(): Promise<void> {
    await this.page.keyboard.press("Escape")
    await this.waitForModalClose()
  }

  /**
   * Hover over close button to verify hover effect
   */
  async hoverCloseButton(): Promise<void> {
    await this.closeButton.hover()
    await this.page.waitForTimeout(200)
  }
}
