import { expect, Locator, Page } from "@playwright/test"

import { BasePage } from "./BasePage"

export interface ModalPageOptions {
  backgroundId?: string
  contentId?: string
}

/**
 * Page object for Modal interactions (Contact Me, Art Gallery)
 */
export class ModalPage extends BasePage {
  readonly backgroundId: string
  readonly modal: Locator
  readonly modalBackdrop: Locator
  readonly closeButton: Locator
  readonly modalContent: Locator

  constructor(page: Page, options: ModalPageOptions | string = {}) {
    super(page)

    const opts: ModalPageOptions = typeof options === "string" ? { backgroundId: options } : options
    this.backgroundId = opts.backgroundId ?? "contact-me-modal-background"
    const contentId = opts.contentId ?? (this.backgroundId === "art-modal-background" ? "art-modal-img" : "contact-me-modal-content")

    this.modal = page.locator(`#${this.backgroundId}`)
    this.modalBackdrop = page.locator(`#${this.backgroundId}`)
    this.closeButton = page.locator(`#${this.backgroundId} button.modal-close`)
    this.modalContent = page.locator(`#${contentId}`)
  }

  private get isContactModal(): boolean {
    return this.backgroundId === "contact-me-modal-background"
  }

  /**
   * Wait for modal to open with animation
   */
  async waitForModalOpen(): Promise<void> {
    if (this.isContactModal) {
      // Contact modal is lazy-loaded; retry open if the first click focused the button without mounting.
      const contactButton = this.page.locator("#contact-me-button")
      const deadline = Date.now() + 20000

      while (Date.now() < deadline) {
        if (await this.modal.count()) break
        await contactButton.click({ force: true })
        try {
          await this.modal.waitFor({ state: "attached", timeout: 3000 })
          break
        } catch {
          // Chunk / click race — try again until deadline
        }
      }
    }

    await this.modal.waitFor({ state: "attached", timeout: 10000 })
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
   * Wait for modal to close (contact drops "show"; art lightbox unmounts after animation).
   */
  async waitForModalClose(): Promise<void> {
    await expect
      .poll(
        async () => {
          if ((await this.modal.count()) === 0) return true
          const classes = await this.modal.getAttribute("class")
          return !classes?.includes("show")
        },
        { timeout: 10000, intervals: [50, 100, 200] },
      )
      .toBe(true)
  }

  /**
   * Check if modal is open
   */
  async isModalOpen(): Promise<boolean> {
    if ((await this.modal.count()) === 0) return false
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
    // Retry: first click can miss under parallel load / mid-animation hit-testing.
    const deadline = Date.now() + 10000
    while (Date.now() < deadline) {
      if (!(await this.isModalOpen())) return
      await this.modal.click({ position: { x: 5, y: 5 }, force: true })
      try {
        await expect
          .poll(
            async () => {
              if ((await this.modal.count()) === 0) return true
              const classes = await this.modal.getAttribute("class")
              return !classes?.includes("show")
            },
            { timeout: 2000, intervals: [50, 100] },
          )
          .toBe(true)
        return
      } catch {
        // Click didn't close — try again until deadline
      }
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
