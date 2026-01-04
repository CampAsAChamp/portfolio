import { expect, test } from "@playwright/test"

import { getAnimationProperties, isMobileViewport, verifyAnimationClasses, waitForAnimation } from "../helpers/utils"

// Configure animation tests with more retries and longer timeout
test.describe.configure({
  retries: 3,
  timeout: 30000,
})

test.describe("Animation Tests", () => {
  test.beforeEach(async ({ page, context }) => {
    // Clear cookies before navigation
    await context.clearCookies()

    // Navigate and wait for page to be ready
    await page.goto("/", { waitUntil: "networkidle" })

    // Clear localStorage after page load
    await page.evaluate(() => {
      try {
        localStorage.clear()
      } catch {
        // Ignore if localStorage is not available
      }
    })

    // Wait for fonts to be ready
    await page.evaluate(() => document.fonts.ready)
  })

  test.describe("Landing Page Animations", () => {
    test("all elements have correct animate.css classes", async ({ page }) => {
      // Verify landing blob
      await verifyAnimationClasses(page, "#landing-blob", ["animate__animated", "animate__fadeIn"])

      // Verify name heading
      await verifyAnimationClasses(page, "#name", ["animate__animated", "animate__bounceIn"])

      // Verify software engineer title
      await verifyAnimationClasses(page, "#software-engineer", ["animate__animated", "animate__bounceIn"])

      // Verify subtitle
      await verifyAnimationClasses(page, "#subtitle", ["animate__animated", "animate__fadeInUp"])

      // Verify profile picture
      await verifyAnimationClasses(page, "#profile-pic", ["animate__animated", "animate__bounceIn"])

      // Verify contact button
      await verifyAnimationClasses(page, "#contact-me-button", ["animate__animated", "animate__fadeInUp"])

      // Verify social icons
      await verifyAnimationClasses(page, "#contact-me-socials", ["animate__animated", "animate__fadeInUp"])

      // Verify mouse scroll indicator
      await verifyAnimationClasses(page, "#mouse-scroll-indicator", ["animate__animated", "animate__fadeInUp"])
    })

    test("elements have correct computed animation properties", async ({ page }) => {
      const isMobile = isMobileViewport(page)

      // Check name element animation properties
      // On mobile (<=1100px), the layout changes and animation delays are different
      const nameProps = await getAnimationProperties(page, "#name")
      expect(nameProps.duration).toMatch(/0.9s|900ms/)
      if (isMobile) {
        expect(nameProps.delay).toMatch(/0.3s|300ms/) // Mobile: name animates after profile pic
      } else {
        expect(nameProps.delay).toMatch(/0.1s|100ms/) // Desktop: name animates first
      }
      expect(nameProps.fillMode).toBe("forwards")

      // Check profile pic animation properties
      const profilePicProps = await getAnimationProperties(page, "#profile-pic")
      expect(profilePicProps.duration).toMatch(/1s|1000ms/)
      if (isMobile) {
        expect(profilePicProps.delay).toMatch(/0.1s|100ms/) // Mobile: profile pic animates first
      } else {
        expect(profilePicProps.delay).toMatch(/0.3s|300ms/) // Desktop: profile pic animates after name
      }
      expect(profilePicProps.fillMode).toBe("forwards")

      // Check contact button animation properties
      const buttonProps = await getAnimationProperties(page, "#contact-me-button")
      expect(buttonProps.duration).toMatch(/0.8s|800ms/)
      if (isMobile) {
        expect(buttonProps.delay).toMatch(/0.6s|600ms/) // Mobile: different delay
      } else {
        expect(buttonProps.delay).toMatch(/0.4s|400ms/) // Desktop: standard delay
      }
      expect(buttonProps.fillMode).toBe("forwards")
    })

    test("elements become visible after animations complete", async ({ page }) => {
      // Wait for critical animations to complete
      await waitForAnimation(page, "#name", 2000)
      await waitForAnimation(page, "#profile-pic", 2500)
      await waitForAnimation(page, "#contact-me-button", 2000)

      // Verify elements are visible
      await expect(page.locator("#name")).toBeVisible()
      await expect(page.locator("#profile-pic")).toBeVisible()
      await expect(page.locator("#contact-me-button")).toBeVisible()

      // Verify final opacity is 1
      const nameProps = await getAnimationProperties(page, "#name")
      expect(nameProps.opacity).toBe("1")

      const profilePicProps = await getAnimationProperties(page, "#profile-pic")
      expect(profilePicProps.opacity).toBe("1")
    })

    test("positioning remains correct after animations", async ({ page }) => {
      // Wait for all animations to complete
      await page.waitForTimeout(2000)

      // Verify name heading is visible and positioned correctly
      const nameElement = page.locator("#name")
      await expect(nameElement).toBeVisible()
      const nameBox = await nameElement.boundingBox()
      expect(nameBox).toBeTruthy()
      expect(nameBox!.y).toBeGreaterThan(0)

      // Check mouse scroll indicator only on desktop (it's hidden on mobile)
      const viewport = page.viewportSize()
      if (viewport && viewport.width > 1100) {
        const indicatorWrapper = page.locator("#mouse-scroll-indicator-wrapper")
        await expect(indicatorWrapper).toBeVisible()
        const wrapperBox = await indicatorWrapper.boundingBox()
        expect(wrapperBox).toBeTruthy()
      }
    })
  })

  test.describe("Navbar Animations", () => {
    test("logo has fadeInDown animation", async ({ page }) => {
      const logoLink = page.locator('nav a[href="/"]')
      await verifyAnimationClasses(page, 'nav a[href="/"]', ["animate__animated", "animate__fadeInDown"])

      // Verify it becomes visible
      await waitForAnimation(page, 'nav a[href="/"]', 1500)
      await expect(logoLink).toBeVisible()
    })

    test("nav links have staggered animations", async ({ page }) => {
      // Get all nav list items
      const navItems = page.locator("nav ul li")
      const count = await navItems.count()
      expect(count).toBeGreaterThan(0)

      // Verify all have animation classes
      for (let i = 0; i < count; i++) {
        const item = navItems.nth(i)
        const classes = await item.getAttribute("class")
        expect(classes).toContain("nav-link-entrance")
        expect(classes).toContain("animate__animated")
        expect(classes).toContain("animate__fadeInDown")
      }
    })

    test("nav links cascade from left to right with staggered delay", async ({ page }) => {
      // Check first nav item (theme switcher)
      const firstItem = page.locator("nav ul li").first()
      const firstProps = await firstItem.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return styles.animationDelay
      })
      expect(firstProps).toMatch(/0.1s|100ms/)

      // Check second nav item
      const secondItem = page.locator("nav ul li").nth(1)
      const secondProps = await secondItem.evaluate((el) => {
        const styles = window.getComputedStyle(el)
        return styles.animationDelay
      })
      expect(secondProps).toMatch(/0.2s|200ms/)
    })

    test("all nav elements are visible after animations complete", async ({ page }) => {
      // Wait for animations to complete (last item at 0.6s + 0.5s duration = 1.1s)
      await page.waitForTimeout(1500)

      // Verify logo is visible
      await expect(page.locator("#logo")).toBeVisible()

      // Verify all nav links are visible
      const navItems = page.locator("nav ul li")
      const count = await navItems.count()
      for (let i = 0; i < count; i++) {
        await expect(navItems.nth(i)).toBeVisible()
      }
    })

    test("mobile menu opens and closes with correct animations", async ({ page }) => {
      // Only run on mobile viewports
      if (!isMobileViewport(page)) {
        test.skip()
      }

      // Verify hamburger menu is visible
      const hamburger = page.locator(".hamburger-menu")
      await expect(hamburger).toBeVisible()

      // Verify nav is initially hidden (translateX(100%))
      const nav = page.locator("nav ul")
      const initialTransform = await nav.evaluate((el) => window.getComputedStyle(el).transform)
      // Transform matrix for translateX(100%) should move element off-screen
      expect(initialTransform).not.toBe("none")

      // Open the menu
      await hamburger.click()
      await page.waitForTimeout(100) // Brief wait for class to be added

      // Verify nav has nav-active class
      const hasActiveClass = await nav.evaluate((el) => el.classList.contains("nav-active"))
      expect(hasActiveClass).toBe(true)

      // Wait for opening animation
      await page.waitForTimeout(700)

      // Verify nav items are visible (opacity should be 1)
      const navItems = page.locator("nav ul li")
      const firstItemOpacity = await navItems.first().evaluate((el) => window.getComputedStyle(el).opacity)
      expect(parseFloat(firstItemOpacity)).toBeGreaterThan(0.9)

      // Close the menu by clicking hamburger again
      await hamburger.click()
      await page.waitForTimeout(100) // Brief wait for class changes

      // Verify nav has nav-closing class
      const hasClosingClass = await nav.evaluate((el) => el.classList.contains("nav-closing"))
      expect(hasClosingClass).toBe(true)

      // Verify nav no longer has nav-active class
      const stillHasActiveClass = await nav.evaluate((el) => el.classList.contains("nav-active"))
      expect(stillHasActiveClass).toBe(false)

      // Check that closing animation is applied to nav items
      // The animation should be applied via inline styles
      const firstItemAnimation = await navItems
        .first()
        .evaluate((el) => (el as HTMLElement).style.animation || window.getComputedStyle(el).animation)
      expect(firstItemAnimation).toContain("nav-link-fade-out")

      // Wait for closing animation to complete
      await page.waitForTimeout(800)

      // Verify nav is hidden again
      const finalTransform = await nav.evaluate((el) => window.getComputedStyle(el).transform)
      expect(finalTransform).not.toBe("none")

      // Verify nav-closing class is removed after animation
      const hasClosingClassAfter = await nav.evaluate((el) => el.classList.contains("nav-closing"))
      expect(hasClosingClassAfter).toBe(false)
    })

    test("mobile menu closes when nav link is clicked", async ({ page }) => {
      // Only run on mobile viewports
      if (!isMobileViewport(page)) {
        test.skip()
      }

      const hamburger = page.locator(".hamburger-menu")
      const nav = page.locator("nav ul")

      // Open the menu
      await hamburger.click()
      await page.waitForTimeout(700)

      // Get initial scroll position
      const initialScrollY = await page.evaluate(() => window.scrollY)

      // Click a nav link
      await page.locator('nav a[href="#about-me-images"]').click()
      await page.waitForTimeout(100)

      // Verify menu starts closing
      const hasClosingClass = await nav.evaluate((el) => el.classList.contains("nav-closing"))
      const hasActiveClass = await nav.evaluate((el) => el.classList.contains("nav-active"))

      // Either closing class is present or active class is removed (depends on timing)
      expect(hasClosingClass || !hasActiveClass).toBe(true)

      // Wait for animation to complete and scroll to happen (750ms + smooth scroll time)
      await page.waitForTimeout(1500)

      // Verify menu is closed
      const finalHasActiveClass = await nav.evaluate((el) => el.classList.contains("nav-active"))
      expect(finalHasActiveClass).toBe(false)

      // Verify page has scrolled to the target section
      const finalScrollY = await page.evaluate(() => window.scrollY)
      expect(finalScrollY).toBeGreaterThan(initialScrollY)

      // Verify target element is in viewport
      const targetElement = page.locator("#about-me-images")
      await expect(targetElement).toBeInViewport()
    })
  })

  test.describe("Cross-browser Animation Tests", () => {
    test("animations work correctly on different browsers", async ({ page }) => {
      // Wait for animations to complete
      await page.waitForTimeout(2000)

      // Verify key elements are visible regardless of browser
      await expect(page.locator("#name")).toBeVisible()
      await expect(page.locator("#profile-pic")).toBeVisible()
      await expect(page.locator("#contact-me-button")).toBeVisible()
      await expect(page.locator("#logo")).toBeVisible()

      // Test runs on browser: ${browserName}
    })
  })
})
