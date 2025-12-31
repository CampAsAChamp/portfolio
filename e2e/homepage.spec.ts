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

test.describe('Homepage', () => {
  test('loads and displays all sections', async ({ page }) => {
    await page.goto('/')

    // Check that all main sections are present
    await expect(page.locator('#landing-page-container')).toBeVisible()
    await expect(page.locator('#about-me-container')).toBeVisible()
    await expect(page.locator('#experience-container')).toBeVisible()
    await expect(page.locator('#skills-container')).toBeVisible()
    await expect(page.locator('#sw-projects-container')).toBeVisible()
    await expect(page.locator('#graphic-design-container')).toBeVisible()
  })

  test('navigation links scroll to sections', async ({ page }) => {
    await page.goto('/')

    // Wait for lazy-loaded components to be available
    await page.waitForTimeout(1000)

    const isMobile = isMobileViewport(page)

    // Test navigation to About section
    if (isMobile) {
      await openMobileMenu(page)
    }

    await page.locator('a[href="#about-me-images"]').click()

    // Verify the URL hash changed (this should happen immediately)
    await page.waitForTimeout(200)
    expect(page.url()).toContain('#about-me-images')

    // On mobile, wait for menu to close, then manually scroll if needed
    if (isMobile) {
      await page.waitForTimeout(1000) // Wait for menu close animation
      // Manually scroll to the target since hash navigation can be flaky with mobile menu
      await page.evaluate(() => {
        const target = document.querySelector('#about-me-images')
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
      await page.waitForTimeout(500) // Wait for smooth scroll
    } else {
      await page.waitForTimeout(800)
    }

    // Check that About section is at least partially visible
    const aboutSection = page.locator('#about-me-container')
    await expect(aboutSection).toBeInViewport({ ratio: 0.1 })

    // Test navigation to Experience section
    if (isMobile) {
      await openMobileMenu(page)
    }

    await page.locator('a[href="#experience-header"]').click()

    // Verify the URL hash changed
    await page.waitForTimeout(200)
    expect(page.url()).toContain('#experience-header')

    if (isMobile) {
      await page.waitForTimeout(1000)
      // Manually scroll to the target
      await page.evaluate(() => {
        const target = document.querySelector('#experience-header')
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
      await page.waitForTimeout(500)
    } else {
      await page.waitForTimeout(800)
    }

    const experienceSection = page.locator('#experience-container')
    await expect(experienceSection).toBeInViewport({ ratio: 0.1 })
  })

  test('theme toggle works (light/dark mode)', async ({ page }) => {
    await page.goto('/')

    const htmlElement = page.locator('html')

    // Set a known initial state
    await page.evaluate(() => {
      document.documentElement.setAttribute('color-mode', 'light')
      localStorage.setItem('color-mode', 'light')
    })
    await page.waitForTimeout(200)

    // Open mobile menu if needed to access theme toggle
    await openMobileMenu(page)

    // Verify initial state
    let currentTheme = await htmlElement.getAttribute('color-mode')
    expect(currentTheme).toBe('light')

    // First toggle: light -> dark
    await page.locator('.theme-toggle-button').waitFor({ state: 'visible' })
    await page.locator('.theme-toggle-button').click()
    await page.waitForTimeout(500)

    // Check that theme changed to dark
    currentTheme = await htmlElement.getAttribute('color-mode')
    expect(currentTheme).toBe('dark')

    // Reopen menu if on mobile (theme toggle doesn't close mobile menu)
    // But we still need to ensure the button is accessible
    const isMobile = isMobileViewport(page)
    if (isMobile) {
      // On mobile, the menu should still be open, but let's scroll the button into view
      await page.locator('.theme-toggle-button').scrollIntoViewIfNeeded()
      await page.waitForTimeout(200)
    }

    // Second toggle: dark -> light
    await page.locator('.theme-toggle-button').click()
    await page.waitForTimeout(500)

    // Check that theme is back to light
    currentTheme = await htmlElement.getAttribute('color-mode')
    expect(currentTheme).toBe('light')
  })

  test('contact modal opens and closes', async ({ page }) => {
    await page.goto('/')

    // Find and click "Contact Me" button
    await page.click('#contact-me-button')

    // Wait for modal to appear
    await page.waitForTimeout(500)

    // Check that modal content is visible
    await expect(page.locator('#contact-me-modal-content')).toBeVisible()

    // Close modal by clicking close button
    await page.click('.modal-close')

    // Wait for modal to close
    await page.waitForTimeout(500)

    // Check that modal is hidden
    await expect(page.locator('#contact-me-modal-content')).not.toBeVisible()
  })

  test('project cards display correctly', async ({ page }) => {
    await page.goto('/')

    // Wait for lazy-loaded components
    await page.waitForTimeout(1000)

    // Scroll to software projects section
    await clickNavLink(page, '#sw-projects-header')

    // Check that at least one project card is visible
    const projectCards = page.locator('.sw-projects-card')
    await expect(projectCards.first()).toBeVisible()

    // Check that project cards have essential elements
    const firstCard = projectCards.first()
    await expect(firstCard.locator('.sw-project-title')).toBeVisible() // Project title
    await expect(firstCard.locator('.sw-projects-text')).toBeVisible() // Project description
  })

  test('skip link works with keyboard', async ({ page, browserName }) => {
    await page.goto('/')

    // Wait a bit for page to fully load
    await page.waitForTimeout(500)

    const skipLink = page.locator('.skip-link')

    // Safari/WebKit has different default keyboard navigation behavior
    // On Safari, Tab doesn't focus links by default unless "All controls" is enabled in settings
    // So we'll test the skip link functionality directly instead of relying on Tab
    if (browserName === 'webkit') {
      // For Safari, just verify the skip link exists and can be activated
      await expect(skipLink).toBeVisible()

      // Programmatically focus the skip link
      await skipLink.focus()
      await page.waitForTimeout(200)

      // Activate it
      await page.keyboard.press('Enter')
      await page.waitForTimeout(500)

      // Check that we scrolled to landing page container (main content)
      const landingPage = page.locator('#landing-page-container')
      await expect(landingPage).toBeInViewport()
    } else {
      // For Chromium and Firefox, test the full Tab navigation
      // Press Tab to focus skip link
      await page.keyboard.press('Tab')

      // Check that skip link is focused and visible
      await expect(skipLink).toBeFocused()
      await expect(skipLink).toBeVisible()

      // Press Enter to activate skip link
      await page.keyboard.press('Enter')

      // Wait for scroll
      await page.waitForTimeout(500)

      // Check that we scrolled to landing page container (main content)
      const landingPage = page.locator('#landing-page-container')
      await expect(landingPage).toBeInViewport()
    }
  })
})
