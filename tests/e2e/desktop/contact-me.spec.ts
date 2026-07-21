import { expect, test } from "@playwright/test"

import { LandingPage } from "../fixtures/LandingPage"
import { ModalPage } from "../fixtures/ModalPage"
import { skipUnlessVisualBaseline } from "../helpers/visual-helpers"

test.describe("Contact Me - Desktop", () => {
  let landingPage: LandingPage
  let modalPage: ModalPage

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page)
    modalPage = new ModalPage(page)
    await landingPage.goto("/")
  })

  test.describe("Contact Me Button", () => {
    test("should display contact me button", async () => {
      await expect(landingPage.contactMeButton).toBeVisible()
      await expect(landingPage.contactMeButton).toBeEnabled()
    })

    test("should show hover effect with chevrons", async () => {
      skipUnlessVisualBaseline(test.info())
      const button = landingPage.contactMeButton
      await expect(button).toBeVisible()
      await button.hover()
      await expect(button).toHaveScreenshot("contact-me-button-hover.png", { animations: "disabled", timeout: 15000 })
    })

    test("should open modal when clicked", async () => {
      // Click contact me button
      await landingPage.clickContactMe()

      // Wait for modal to open
      await modalPage.waitForModalOpen()

      // Verify modal is visible
      expect(await modalPage.isModalOpen()).toBe(true)
    })
  })

  test.describe("Contact Me Modal", () => {
    test.beforeEach(async () => {
      // Open modal before each test
      await landingPage.clickContactMe()
      await modalPage.waitForModalOpen()
    })

    test("should display all modal content", async ({ page }) => {
      // Verify modal content elements
      const modalContent = page.locator("#contact-me-modal-content")
      await expect(modalContent).toBeVisible()

      // Check for profile pic
      const profilePic = page.locator("#contact-me-modal-profile-pic")
      await expect(profilePic).toBeVisible()

      // Check for title
      const title = page.locator("#contact-me-modal-title")
      await expect(title).toBeVisible()
      await expect(title).toHaveText(/Let's Connect/i)

      // Check for email link
      const emailLink = page.locator('a[href^="mailto:"]')
      await expect(emailLink).toBeVisible()

      // Check for social links
      const githubLink = page.locator('#contact-me-modal-socials a[href*="github"]')
      const linkedinLink = page.locator('#contact-me-modal-socials a[href*="linkedin"]')
      await expect(githubLink).toBeVisible()
      await expect(linkedinLink).toBeVisible()
    })

    test("should close when X button is clicked", async () => {
      // Modal should be open
      expect(await modalPage.isModalOpen()).toBe(true)

      // Click close button
      await modalPage.closeByButton()

      // Modal should be closed
      expect(await modalPage.isModalOpen()).toBe(false)
    })

    test("should show hover effect on X button (yellow and spin)", async () => {
      // Assert CSS hover styles instead of a screenshot — rotation anti-aliasing is flaky across runs/OS.
      await modalPage.hoverCloseButton()

      const styles = await modalPage.closeButton.evaluate((el) => {
        const computed = getComputedStyle(el)
        return { color: computed.color, transform: computed.transform }
      })

      expect(styles.color).toBe("rgb(255, 194, 97)")
      expect(styles.transform).toMatch(/matrix/)
      expect(styles.transform).not.toBe("none")
    })

    test("should close when clicking backdrop", async () => {
      expect(await modalPage.isModalOpen()).toBe(true)
      await modalPage.closeByBackdrop()
      expect(await modalPage.isModalOpen()).toBe(false)
    })

    test("should close when pressing ESC key", async () => {
      expect(await modalPage.isModalOpen()).toBe(true)
      await modalPage.closeByEscape()
      expect(await modalPage.isModalOpen()).toBe(false)
    })

    test("should not close when clicking modal content", async ({ page }) => {
      const modalContent = page.locator("#contact-me-modal-content")
      await modalContent.click()

      await expect(modalPage.modal).toHaveClass(/show/)
      expect(await modalPage.isModalOpen()).toBe(true)
    })

    test("should have correct email link", async ({ page }) => {
      const emailLink = page.locator('a[href^="mailto:"]')
      const href = await emailLink.getAttribute("href")

      expect(href).toContain("mailto:")
      expect(href).toContain("@")
    })

    test("should have correct social links", async ({ page }) => {
      const githubLink = page.locator('#contact-me-modal-socials a[href*="github"]')
      const linkedinLink = page.locator('#contact-me-modal-socials a[href*="linkedin"]')

      const githubHref = await githubLink.getAttribute("href")
      const linkedinHref = await linkedinLink.getAttribute("href")

      expect(githubHref).toContain("github.com")
      expect(linkedinHref).toContain("linkedin.com")
    })

    test("should be keyboard accessible", async ({ page }) => {
      // Prefer the focus trap's initial focus; fall back to DOM focus (Playwright .focus() is flaky on WebKit)
      const focused = await modalPage.closeButton.evaluate((el) => el === document.activeElement)
      if (!focused) {
        await modalPage.focusElement(modalPage.closeButton)
      }
      await expect(modalPage.closeButton).toBeFocused()

      await page.keyboard.press("Enter")
      await modalPage.waitForModalClose()
      expect(await modalPage.isModalOpen()).toBe(false)
    })

    test("should trap focus within modal", async ({ page }) => {
      expect(await modalPage.isModalOpen()).toBe(true)

      const closeButton = modalPage.closeButton
      const emailLink = page.locator('#contact-me-modal-background a[href^="mailto"]')
      const githubLink = page.locator("#contact-me-modal-socials a").first()
      const linkedinLink = page.locator("#contact-me-modal-socials a").nth(1)

      // Assert each control is focusable via the DOM API (Playwright locator.focus() is flaky on WebKit)
      await modalPage.focusElement(closeButton)
      await modalPage.focusElement(emailLink)
      await modalPage.focusElement(githubLink)
      await modalPage.focusElement(linkedinLink)

      // Trap: Tab from the last control wraps to the first
      await page.keyboard.press("Tab")
      await expect(closeButton).toBeFocused()

      // Trap: Shift+Tab from the first control wraps to the last
      await page.keyboard.press("Shift+Tab")
      await expect(linkedinLink).toBeFocused()
    })
  })

  test.describe("Social Links", () => {
    test("should verify LinkedIn and GitHub links", async () => {
      const githubUrl = await landingPage.getGithubUrl()
      const linkedinUrl = await landingPage.getLinkedinUrl()

      expect(githubUrl).toContain("github.com")
      expect(linkedinUrl).toContain("linkedin.com")
    })

    test("should change color on hover", async () => {
      skipUnlessVisualBaseline(test.info())
      await landingPage.githubLink.hover()
      await expect(landingPage.githubLink).toHaveScreenshot("github-icon-hover.png", {
        animations: "disabled",
        timeout: 15000,
      })

      await landingPage.linkedinLink.hover()
      await expect(landingPage.linkedinLink).toHaveScreenshot("linkedin-icon-hover.png", {
        animations: "disabled",
        timeout: 15000,
      })
    })
  })
})
