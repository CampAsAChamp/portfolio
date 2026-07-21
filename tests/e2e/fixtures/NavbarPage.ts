import { expect, Locator, Page } from "@playwright/test"

import { waitForScrollComplete } from "../helpers/wait-helpers"
import { BasePage } from "./BasePage"

/**
 * Page object for Navbar and Hamburger Menu interactions
 */
export class NavbarPage extends BasePage {
  // Desktop navbar
  readonly navbar: Locator
  readonly logo: Locator
  readonly navLinks: Locator
  readonly themeSwitcher: Locator

  // Mobile hamburger menu
  readonly hamburgerButton: Locator
  readonly mobileDrawer: Locator
  readonly closeButton: Locator

  constructor(page: Page) {
    super(page)

    // Desktop navbar elements
    this.navbar = page.locator("nav").first()
    this.logo = page.locator("nav > a").first()
    this.navLinks = page.locator("nav ul li.nav-link-entrance")
    this.themeSwitcher = page.locator(".theme-toggle-button")

    // Mobile hamburger menu
    this.hamburgerButton = page.locator(".hamburger-menu")
    this.mobileDrawer = page.locator("nav ul")
    this.closeButton = page.locator(".hamburger-menu.toggle")
  }

  /**
   * Get nav link by text
   */
  getNavLink(text: string): Locator {
    return this.page.locator(`nav a:has-text("${text}")`)
  }

  /**
   * Click nav link and wait for smooth scroll
   */
  async clickNavLink(text: string): Promise<void> {
    const link = this.getNavLink(text)
    const href = await link.getAttribute("href")
    const targetId = href?.replace("#", "") ?? ""

    await link.click()

    if (targetId) {
      const target = this.page.locator(`#${targetId}`)
      // Prefer user-visible outcome over waitForFunction scroll math (Firefox smooth-scroll lag).
      try {
        await expect(target).toBeInViewport({ timeout: 10000 })
      } catch {
        await target.scrollIntoViewIfNeeded()
        await expect(target).toBeInViewport({ timeout: 5000 })
      }
      return
    }

    await waitForScrollComplete(this.page)
  }

  /**
   * Click logo to return home
   */
  async clickLogo(): Promise<void> {
    await this.logo.click()
  }

  /**
   * Toggle theme
   */
  async toggleTheme(): Promise<void> {
    await this.themeSwitcher.click()
  }

  /**
   * Get current theme from color-mode attribute
   */
  async getCurrentTheme(): Promise<string> {
    const html = this.page.locator("html")
    const colorMode = await html.getAttribute("color-mode")
    return colorMode || "light" // default
  }

  /**
   * Open hamburger menu (mobile)
   */
  async openHamburgerMenu(): Promise<void> {
    await expect(this.hamburgerButton).toBeVisible({ timeout: 15000 })
    await expect(this.mobileDrawer).toBeAttached({ timeout: 15000 })

    if (await this.isHamburgerMenuOpen()) {
      return
    }

    // Use evaluate click — more reliable on WebKit than locator.click() on div[role=button]
    await this.page.evaluate(() => {
      const btn = document.querySelector<HTMLElement>(".hamburger-menu")
      btn?.click()
    })

    await this.page.waitForFunction(() => document.querySelector("nav ul")?.classList.contains("nav-active"), undefined, { timeout: 15000 })
  }

  /**
   * Close hamburger menu (mobile)
   */
  async closeHamburgerMenu(): Promise<void> {
    if (!(await this.isHamburgerMenuOpen())) {
      return
    }

    // Same control toggles open and closed; the X state uses the .toggle class.
    await this.page.evaluate(() => {
      const btn = document.querySelector<HTMLElement>(".hamburger-menu")
      btn?.click()
    })

    await this.page.waitForFunction(() => !document.querySelector("nav ul")?.classList.contains("nav-active"), undefined, {
      timeout: 15000,
    })
  }

  /**
   * Check if hamburger menu is open
   */
  async isHamburgerMenuOpen(): Promise<boolean> {
    // Short timeout — missing drawer should mean "closed", not hang the whole test.
    try {
      const classes = await this.mobileDrawer.getAttribute("class", { timeout: 2000 })
      return classes?.includes("nav-active") ?? false
    } catch {
      return false
    }
  }

  /**
   * Check if navbar is in mobile mode
   */
  async isNavbarMobile(): Promise<boolean> {
    return await this.hamburgerButton.isVisible()
  }
}
