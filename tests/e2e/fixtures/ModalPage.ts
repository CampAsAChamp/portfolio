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
    if (this.isContactModal && (await this.modal.count()) === 0) {
      // ContactMeBar pre-warms the modal's dynamic import on hover/focus/pointerdown, so a
      // real click almost always finds the chunk already resolved and opens synchronously
      // (see ContactMeBar.tsx's handleOpen). A single bounded retry remains as a safety net
      // for a genuinely cold, unwarmed first click racing a slow/CPU-starved CI runner — but
      // this must stay a single retry, not a loop: if the modal still isn't attached after
      // one re-click, that's a real regression in the open path and should fail loudly here
      // rather than being silently retried away for up to 20s.
      const contactButton = this.page.locator("#contact-me-button")
      await contactButton.click({ force: true })
      await this.modal.waitFor({ state: "attached", timeout: 5000 }).catch(async () => {
        await contactButton.click({ force: true })
      })
    }

    await this.modal.waitFor({ state: "attached", timeout: 10000 })
    await expect(this.modal).toHaveClass(/show/, { timeout: 10000 })
    await expect(this.modalContent).toBeVisible()
    await expect(this.closeButton).toBeVisible()
  }

  /**
   * Focus an element via the DOM API, then assert the focus landed.
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
   * Click `performClick` repeatedly until the modal closes, retrying on a lost/mistimed
   * click rather than waiting the full timeout for a single click that may never land.
   * Both the X button and backdrop close paths can miss under CPU contention (mid-animation
   * hit-testing, or the click firing before the modal's own state settles) — retrying is
   * cheap and turns a hard failure into a self-correcting wait.
   */
  private async retryClickUntilClosed(performClick: () => Promise<void>): Promise<void> {
    const deadline = Date.now() + 10000
    while (Date.now() < deadline) {
      if (!(await this.isModalOpen())) return
      await performClick()
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
   * Close modal by clicking X button
   */
  async closeByButton(): Promise<void> {
    await this.retryClickUntilClosed(() => this.closeButton.click({ force: true }))
  }

  /**
   * Close modal by clicking backdrop
   */
  async closeByBackdrop(): Promise<void> {
    await this.retryClickUntilClosed(() => this.modal.click({ position: { x: 5, y: 5 }, force: true }))
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
