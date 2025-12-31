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

test.describe('Visual Regression Tests', () => {
  test('homepage light mode', async ({ page }) => {
    await page.goto('/')

    // Ensure we're in light mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('color-mode', 'light')
      localStorage.setItem('color-mode', 'light')
    })

    // Wait for lazy-loaded components and animations to complete
    await page.waitForTimeout(2000)

    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-light.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('homepage dark mode', async ({ page }) => {
    await page.goto('/')

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.setAttribute('color-mode', 'dark')
      localStorage.setItem('color-mode', 'dark')
    })

    // Wait for lazy-loaded components and animations to complete
    await page.waitForTimeout(2000)

    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-dark.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('landing section', async ({ page }) => {
    await page.goto('/')

    // Wait for page to fully load and animations to settle
    await page.waitForTimeout(1000)

    const landingSection = page.locator('#landing-page-container')
    await expect(landingSection).toHaveScreenshot('landing-section.png', {
      animations: 'disabled',
    })
  })

  test('about section', async ({ page }) => {
    await page.goto('/')

    // Wait for lazy-loaded components
    await page.waitForTimeout(1000)

    // Scroll to about section
    await clickNavLink(page, '#about-me-images')

    const aboutSection = page.locator('#about-me-container')
    await expect(aboutSection).toHaveScreenshot('about-section.png', {
      animations: 'disabled',
    })
  })

  test('experience section', async ({ page }) => {
    await page.goto('/')

    // Wait for lazy-loaded components
    await page.waitForTimeout(1000)

    // Scroll to experience section
    await clickNavLink(page, '#experience-header')

    const experienceSection = page.locator('#experience-container')
    await expect(experienceSection).toHaveScreenshot('experience-section.png', {
      animations: 'disabled',
    })
  })

  test('software projects section', async ({ page }) => {
    await page.goto('/')

    // Wait for lazy-loaded components
    await page.waitForTimeout(1000)

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

  test('mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Wait for lazy-loaded components and animations to complete
    await page.waitForTimeout(2000)

    // Take full page screenshot in mobile view
    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('tablet viewport', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')

    // Wait for lazy-loaded components and animations to complete
    await page.waitForTimeout(2000)

    // Take full page screenshot in tablet view
    await expect(page).toHaveScreenshot('homepage-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })
})
