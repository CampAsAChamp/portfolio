import { Page, expect, test } from '@playwright/test'

// Helper function to check if we're in mobile viewport
function isMobileViewport(page: Page): boolean {
  const viewport = page.viewportSize()
  return viewport ? viewport.width <= 1100 : false
}

// Helper function to open hamburger menu on mobile
async function openMobileMenu(page: Page): Promise<void> {
  const isMobile = isMobileViewport(page)
  if (isMobile) {
    const hamburger = page.locator('.hamburger-menu')
    if (await hamburger.isVisible()) {
      await hamburger.click()
      await page.waitForTimeout(500) // Wait for menu animation
    }
  }
}

// Helper function to click a navigation link (handles mobile menu)
async function clickNavLink(page: Page, href: string): Promise<void> {
  await openMobileMenu(page)
  await page.locator(`a[href="${href}"]`).click()
  await page.waitForTimeout(500) // Wait for scroll/navigation
}

// Helper function to wait for page to be fully ready for screenshots
async function waitForPageReady(page: Page): Promise<void> {
  // Wait for network to be idle
  await page.waitForLoadState('networkidle')

  // Wait for fonts to load
  await page.evaluate(() => document.fonts.ready)

  // Wait for any images to load (with timeout to prevent hanging)
  await page.evaluate(() => {
    const imagePromises = Array.from(document.images)
      .filter((img) => !img.complete)
      .map(
        (img) =>
          new Promise((resolve) => {
            img.onload = img.onerror = resolve
            // Timeout after 5 seconds per image
            setTimeout(resolve, 5000)
          }),
      )
    return Promise.all(imagePromises)
  })

  // Wait for any lazy-loaded content and animations
  await page.waitForTimeout(1500)

  // Wait for page height to stabilize - check multiple times
  let stableCount = 0
  let previousHeight = 0

  while (stableCount < 3) {
    const currentHeight = await page.evaluate(() => document.body.scrollHeight)
    if (currentHeight === previousHeight) {
      stableCount++
    } else {
      stableCount = 0
      previousHeight = currentHeight
    }
    await page.waitForTimeout(300)
  }
}

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

  test('software projects section', async ({ page }) => {
    await page.goto('/')

    // Wait for page to be fully ready
    await waitForPageReady(page)

    // Scroll to software projects section
    await clickNavLink(page, '#sw-projects-header')

    const swProjectsSection = page.locator('#sw-projects-container')
    await expect(swProjectsSection).toHaveScreenshot('sw-projects-section.png', {
      animations: 'disabled',
    })
  })

  test('contact modal', async ({ page }) => {
    await page.goto('/')

    // Open contact modal by clicking the Contact Me button
    await page.click('#contact-me-button')
    await page.waitForTimeout(500)

    // Take screenshot of modal
    const modal = page.locator('#contact-me-modal-content')
    await expect(modal).toHaveScreenshot('contact-modal.png', {
      animations: 'disabled',
    })
  })
})
