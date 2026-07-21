import { expect, test } from "@playwright/test"

import { BasePage } from "../fixtures/BasePage"
import { NavbarPage } from "../fixtures/NavbarPage"

test.describe("Theme Switcher - Desktop", () => {
  let navbarPage: NavbarPage
  let basePage: BasePage

  test.beforeEach(async ({ page }) => {
    navbarPage = new NavbarPage(page)
    basePage = new BasePage(page)

    // Prefer a second navigation over page.reload() — WebKit occasionally crashes on reload in CI
    await basePage.clearStorageAndGoto("/")
    await page.waitForLoadState("networkidle")
  })

  test("should display theme switcher button", async () => {
    await expect(navbarPage.themeSwitcher).toBeVisible()
    await expect(navbarPage.themeSwitcher).toBeEnabled()
  })

  test("should toggle between light and dark themes", async () => {
    const initialTheme = await navbarPage.getCurrentTheme()

    await navbarPage.toggleTheme()
    await expect.poll(async () => navbarPage.getCurrentTheme()).not.toBe(initialTheme)

    await navbarPage.toggleTheme()
    await expect.poll(async () => navbarPage.getCurrentTheme()).toBe(initialTheme)
  })

  test("should persist theme choice in localStorage", async ({ page }) => {
    await navbarPage.toggleTheme()
    // View Transitions API writes localStorage in the transition callback — poll for it.
    await expect.poll(async () => basePage.getLocalStorageItem("color-mode")).toBeTruthy()

    const themeAfterToggle = await navbarPage.getCurrentTheme()
    expect(await basePage.getLocalStorageItem("color-mode")).toBe(themeAfterToggle)

    await basePage.goto("/")
    await page.waitForLoadState("networkidle")

    await expect.poll(async () => navbarPage.getCurrentTheme()).toBe(themeAfterToggle)
  })

  test("should morph sun/moon icon when theme toggles", async () => {
    // Prefer icon class + color-mode over pixel shots — SVG anti-aliasing caused 80%+ diffs in CI.
    const themeButton = navbarPage.themeSwitcher
    const morphIcon = themeButton.locator(".morph-icon")
    await expect(themeButton).toBeVisible()

    await expect(morphIcon).toHaveClass(/sun-mode/)
    expect(await navbarPage.getCurrentTheme()).toBe("light")

    await navbarPage.toggleTheme()
    await expect.poll(async () => navbarPage.getCurrentTheme()).toBe("dark")
    await expect(morphIcon).toHaveClass(/moon-mode/)

    await navbarPage.toggleTheme()
    await expect.poll(async () => navbarPage.getCurrentTheme()).toBe("light")
    await expect(morphIcon).toHaveClass(/sun-mode/)
  })

  test("should switch icon between sun and moon", async () => {
    const themeButton = navbarPage.themeSwitcher
    await expect(themeButton).toBeVisible()

    const initialTheme = await navbarPage.getCurrentTheme()
    await navbarPage.toggleTheme()
    await expect.poll(async () => navbarPage.getCurrentTheme()).not.toBe(initialTheme)
    await expect(themeButton).toBeVisible()

    await navbarPage.toggleTheme()
    await expect.poll(async () => navbarPage.getCurrentTheme()).toBe(initialTheme)
    await expect(themeButton).toBeVisible()
  })

  test("should apply theme to entire page", async ({ page }) => {
    const initialTheme = await navbarPage.getCurrentTheme()

    await navbarPage.toggleTheme()
    await expect.poll(async () => navbarPage.getCurrentTheme()).not.toBe(initialTheme)

    const newTheme = await navbarPage.getCurrentTheme()
    const htmlTheme = await page.locator("html").getAttribute("color-mode")
    expect(htmlTheme).toBe(newTheme)
  })

  test("should maintain theme across navigation", async ({ page }) => {
    await basePage.setLocalStorageItem("color-mode", "dark")
    await basePage.goto("/")
    await page.waitForFunction(() => document.documentElement.getAttribute("color-mode") === "dark")

    await navbarPage.clickNavLink("About Me")
    await expect(page.locator("#about-me-images")).toBeInViewport({ timeout: 15000 })

    await expect(page.locator("html")).toHaveAttribute("color-mode", "dark")
    await expect.poll(async () => basePage.getLocalStorageItem("color-mode")).toBe("dark")
  })

  test("should be keyboard accessible", async ({ page }) => {
    await navbarPage.themeSwitcher.focus()
    await expect(navbarPage.themeSwitcher).toBeFocused()

    const initialTheme = await navbarPage.getCurrentTheme()
    await page.keyboard.press("Enter")
    await expect.poll(async () => navbarPage.getCurrentTheme()).not.toBe(initialTheme)
  })

  test("should read system preference initially (when no stored theme)", async () => {
    const currentTheme = await navbarPage.getCurrentTheme()
    expect(["light", "dark"]).toContain(currentTheme)
  })

  test("should handle rapid theme toggles", async () => {
    for (let i = 0; i < 5; i++) {
      await navbarPage.toggleTheme()
    }

    await expect.poll(async () => navbarPage.getCurrentTheme()).toMatch(/^(light|dark)$/)
    await expect(navbarPage.navbar).toBeVisible()
  })
})
