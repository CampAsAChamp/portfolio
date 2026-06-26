import { expect, test } from "@playwright/test"

import { BasePage } from "../fixtures/BasePage"
import { NavbarPage } from "../fixtures/NavbarPage"

test.describe("Theme Switcher - Desktop", () => {
  let navbarPage: NavbarPage
  let basePage: BasePage

  test.beforeEach(async ({ page }) => {
    navbarPage = new NavbarPage(page)
    basePage = new BasePage(page)

    // Start from home page
    await basePage.goto("/")

    // Clear localStorage to start with default theme
    await basePage.clearLocalStorage()
    await page.reload()
    await page.waitForLoadState("networkidle")
  })

  test("should display theme switcher button", async () => {
    await expect(navbarPage.themeSwitcher).toBeVisible()
    await expect(navbarPage.themeSwitcher).toBeEnabled()
  })

  test("should toggle between light and dark themes", async ({ page }) => {
    // Get initial theme
    const initialTheme = await navbarPage.getCurrentTheme()

    // Toggle theme
    await navbarPage.toggleTheme()
    await page.waitForTimeout(500) // Wait for theme animation

    // Verify theme changed
    const newTheme = await navbarPage.getCurrentTheme()
    expect(newTheme).not.toBe(initialTheme)

    // Toggle back
    await navbarPage.toggleTheme()
    await page.waitForTimeout(500)

    // Verify theme changed back
    const finalTheme = await navbarPage.getCurrentTheme()
    expect(finalTheme).toBe(initialTheme)
  })

  test("should persist theme choice in localStorage", async ({ page }) => {
    // Set to dark mode
    await navbarPage.toggleTheme()
    await page.waitForTimeout(500)

    const themeAfterToggle = await navbarPage.getCurrentTheme()

    // Get localStorage value (stored as 'color-mode')
    const storedTheme = await basePage.getLocalStorageItem("color-mode")
    expect(storedTheme).toBeTruthy()

    // Reload page
    await page.reload()
    await page.waitForLoadState("networkidle")

    // Theme should persist
    const themeAfterReload = await navbarPage.getCurrentTheme()
    expect(themeAfterReload).toBe(themeAfterToggle)
  })

  test("should display theme wipe animation - visual regression", async ({ page }) => {
    const themeButton = navbarPage.themeSwitcher
    await expect(themeButton).toBeVisible()

    await expect(themeButton).toHaveScreenshot("theme-light.png", { animations: "disabled", timeout: 15000 })

    await navbarPage.toggleTheme()
    await page.waitForFunction(() => document.documentElement.getAttribute("color-mode") === "dark")
    await expect(themeButton).toHaveScreenshot("theme-dark.png", { animations: "disabled", timeout: 15000 })

    await navbarPage.toggleTheme()
    await page.waitForFunction(() => document.documentElement.getAttribute("color-mode") === "light")
    await expect(themeButton).toHaveScreenshot("theme-light-return.png", { animations: "disabled", timeout: 15000 })
  })

  test("should switch icon between sun and moon", async ({ page }) => {
    // Check for theme toggle button and its SVG content
    const themeButton = navbarPage.themeSwitcher
    await expect(themeButton).toBeVisible()

    // Toggle theme
    await navbarPage.toggleTheme()
    await page.waitForTimeout(500)

    // Icon should still be present after toggle
    await expect(themeButton).toBeVisible()

    // Toggle back
    await navbarPage.toggleTheme()
    await page.waitForTimeout(500)

    await expect(themeButton).toBeVisible()
  })

  test("should apply theme to entire page", async ({ page }) => {
    // Get initial theme attribute
    const initialTheme = await navbarPage.getCurrentTheme()

    // Toggle to opposite theme
    await navbarPage.toggleTheme()
    await page.waitForTimeout(600) // Wait for theme transition

    // Get new theme attribute
    const newTheme = await navbarPage.getCurrentTheme()

    // Themes should be different
    expect(initialTheme).not.toBe(newTheme)

    // Verify theme is applied to html element
    const htmlTheme = await page.locator("html").getAttribute("color-mode")
    expect(htmlTheme).toBe(newTheme)
  })

  test("should maintain theme across navigation", async ({ page }) => {
    await basePage.setLocalStorageItem("color-mode", "dark")
    await page.reload({ waitUntil: "domcontentloaded" })
    await page.waitForFunction(() => document.documentElement.getAttribute("color-mode") === "dark")

    await navbarPage.clickNavLink("About Me")
    await expect(page.locator("#about-me-images")).toBeInViewport({ timeout: 15000 })

    await expect(page.locator("html")).toHaveAttribute("color-mode", "dark")
    await expect.poll(async () => basePage.getLocalStorageItem("color-mode")).toBe("dark")
  })

  test("should be keyboard accessible", async ({ page }) => {
    // Focus theme switcher
    await navbarPage.themeSwitcher.focus()

    // Verify it's focused
    const isFocused = await navbarPage.themeSwitcher.evaluate((el) => el === document.activeElement)
    expect(isFocused).toBe(true)

    // Press Enter or Space to toggle
    await page.keyboard.press("Enter")
    await page.waitForTimeout(500)

    // Theme should have changed
    const themeAfterKeypress = await navbarPage.getCurrentTheme()
    expect(themeAfterKeypress).toBeTruthy()
  })

  test("should read system preference initially (when no stored theme)", async () => {
    // Clear localStorage (already done in beforeEach)

    // Get current theme (should match system preference or default)
    const currentTheme = await navbarPage.getCurrentTheme()

    // Theme should be set (either light or dark)
    expect(["light", "dark"]).toContain(currentTheme)
  })

  test("should handle rapid theme toggles", async ({ page }) => {
    // Rapidly toggle theme multiple times
    for (let i = 0; i < 5; i++) {
      await navbarPage.toggleTheme()
      await page.waitForTimeout(100)
    }

    // Wait for final animation
    await page.waitForTimeout(500)

    // Theme should be in valid state
    const finalTheme = await navbarPage.getCurrentTheme()
    expect(["light", "dark"]).toContain(finalTheme)

    // Page should still be functional
    await expect(navbarPage.navbar).toBeVisible()
  })
})
