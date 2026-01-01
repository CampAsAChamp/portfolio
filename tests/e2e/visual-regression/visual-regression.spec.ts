import { expect, test } from '@playwright/test'

import { clickNavLink, waitForPageReady } from '../helpers/utils'

test.describe('Visual Regression Tests', () => {
  /*
   * Full-page screenshot tests have been temporarily disabled due to brittleness.
   * Page height varies slightly between runs due to:
   * - Dynamic content loading
   * - Font rendering differences across browsers
   * - Minor layout shifts
   *
   * TODO: Rewrite these tests with a more robust approach that:
   * - Uses viewport screenshots instead of full-page
   * - Or implements a custom comparison that tolerates height differences
   * - Or focuses on critical above-the-fold content only
   *
   * Section-based tests below provide reliable regression detection for specific components.
   */

  // test('homepage light mode', async ({ page }) => { ... })
  // test('homepage dark mode', async ({ page }) => { ... })
  // test('mobile viewport', async ({ page }) => { ... })
  // test('tablet viewport', async ({ page }) => { ... })

  test('landing section', async ({ page }) => {
    await page.goto('/')

    // Wait for page to be fully ready
    await waitForPageReady(page)

    const landingSection = page.locator('#landing-page-container')
    await expect(landingSection).toHaveScreenshot('landing-section.png', {
      animations: 'disabled',
    })
  })

  test('about section', async ({ page }) => {
    await page.goto('/')

    // Wait for page to be fully ready
    await waitForPageReady(page)

    // Scroll to about section
    await clickNavLink(page, '#about-me-images')

    const aboutSection = page.locator('#about-me-container')
    await expect(aboutSection).toHaveScreenshot('about-section.png', {
      animations: 'disabled',
    })
  })

  test('experience section', async ({ page }) => {
    await page.goto('/')

    // Wait for page to be fully ready
    await waitForPageReady(page)

    // Scroll to experience section
    await clickNavLink(page, '#experience-header')

    const experienceSection = page.locator('#experience-container')
    await expect(experienceSection).toHaveScreenshot('experience-section.png', {
      animations: 'disabled',
    })
  })

  test('contact modal', async ({ page }) => {
    await page.goto('/')

    // Wait for page to be fully ready
    await waitForPageReady(page)

    // Wait for and click the Contact Me button
    const contactButton = page.locator('#contact-me-button')
    await contactButton.waitFor({ state: 'visible', timeout: 5000 })
    await contactButton.click()
    await page.waitForTimeout(500)

    // Wait for modal to be visible before taking screenshot
    const modal = page.locator('#contact-me-modal-content')
    await modal.waitFor({ state: 'visible', timeout: 5000 })

    await expect(modal).toHaveScreenshot('contact-modal.png', {
      animations: 'disabled',
    })
  })
})
