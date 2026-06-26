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
  private readonly backgroundId: string

  constructor(page: Page, backgroundId: string = "contact-me-modal-background") {
    super(page)
    this.backgroundId = backgroundId

    // Modal elements — use stable IDs from the actual component markup
    this.modal = page.locator(`#${backgroundId}`)
    this.modalBackdrop = page.locator(`#${backgroundId}`)
    this.closeButton = page.locator(`#${backgroundId} button.modal-close`)
    this.modalContent = page.locator("#contact-me-modal-content")
  }

  /**
   * Wait for modal to open with animation
   */
  async waitForModalOpen(): Promise<void> {
    // Modal is always in the DOM; open state is indicated by the "show" class
    const id = this.backgroundId
    await this.page.waitForFunction((bgId) => document.getElementById(bgId)?.classList.contains("show"), id, { timeout: 10000 })
    // Wait for opening animation
    await this.page.waitForTimeout(300)
  }

  /**
   * Wait for modal to close with animation
   */
  async waitForModalClose(): Promise<void> {
    const id = this.backgroundId
    await this.page.waitForFunction((bgId) => !document.getElementById(bgId)?.classList.contains("show"), id, { timeout: 10000 })
  }

  /**
   * Check if modal is open
   */
  async isModalOpen(): Promise<boolean> {
    const classes = await this.modal.getAttribute("class")
    return classes?.includes("show") ?? false
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
