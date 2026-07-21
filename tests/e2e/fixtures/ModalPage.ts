import { expect, Locator, Page } from "@playwright/test"

import { BasePage } from "./BasePage"

/**
 * Page object for Modal interactions (Contact Me, Art Gallery)
 */
export class ModalPage extends BasePage {
  readonly modal: Locator
  readonly modalBackdrop: Locator
  readonly closeButton: Locator
  readonly modalContent: Locator

  constructor(page: Page, backgroundId: string = "contact-me-modal-background") {
    super(page)

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
    // Contact modal is lazy-loaded (Suspense); under parallel CI workers the chunk can
    // take longer than the default expect timeout before #contact-me-modal-background exists.
    await this.modal.waitFor({ state: "attached", timeout: 20000 })
    await expect(this.modal).toHaveClass(/show/, { timeout: 10000 })
    await expect(this.modalContent).toBeVisible()
    await expect(this.closeButton).toBeVisible()
  }

  /**
   * Focus an element via the DOM API — more reliable than Playwright's locator.focus() on WebKit.
   */
  async focusElement(locator: Locator): Promise<void> {
    await locator.evaluate((el: HTMLElement) => el.focus())
    await expect(locator).toBeFocused()
  }

  /**
   * Wait for modal to close with animation
   */
  async waitForModalClose(): Promise<void> {
    await expect(this.modal).not.toHaveClass(/show/, { timeout: 10000 })
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
   * Hover over close button and wait until yellow + rotated hover styles settle
   */
  async hoverCloseButton(): Promise<void> {
    await this.closeButton.hover({ force: true })
    await expect
      .poll(
        async () =>
          this.closeButton.evaluate((el) => {
            const computed = getComputedStyle(el)
            return { color: computed.color, transform: computed.transform }
          }),
        { timeout: 5000, intervals: [50, 100, 150] },
      )
      .toMatchObject({
        // #ffc261
        color: "rgb(255, 194, 97)",
      })
  }
}
