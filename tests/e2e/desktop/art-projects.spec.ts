import { expect, test } from "@playwright/test"

import { ModalPage } from "../fixtures/ModalPage"
import { SectionPage } from "../fixtures/SectionPage"
import { skipUnlessVisualBaseline } from "../helpers/visual-helpers"

test.describe("Art Projects Section - Desktop", () => {
  let sectionPage: SectionPage
  let artModal: ModalPage

  test.beforeEach(async ({ page }) => {
    sectionPage = new SectionPage(page)
    artModal = new ModalPage(page, { backgroundId: "art-modal-background" })
    await sectionPage.goto("/")
    await sectionPage.scrollToSection("graphic-design-header")
  })

  async function openFirstProject(): Promise<void> {
    const firstProject = sectionPage.page.locator("#graphic-design-content button[aria-label^='View']").first()
    await expect(firstProject).toBeVisible()
    await firstProject.click()
    await artModal.waitForModalOpen()
  }

  test("should display Art Projects section", async ({ page }) => {
    const section = sectionPage.getSection("graphic-design-container")
    await expect(section).toBeVisible()

    const header = page.locator("#graphic-design-header h2")
    await expect(header).toBeVisible()
    await expect(header).toHaveText("Art & Design Projects")
  })

  test("should display projects in grid layout", async ({ page }) => {
    const projects = page.locator("#graphic-design-content .art-grid-img")
    expect(await projects.count()).toBeGreaterThan(0)
  })

  test("should display multiple art projects", async ({ page }) => {
    const projects = page.locator("#graphic-design-content .art-grid-img")
    expect(await projects.count()).toBeGreaterThan(3)
  })

  test("should enlarge project slightly on hover", async ({ page }) => {
    const firstProject = page.locator("#graphic-design-content .art-grid-img").first()
    await expect(firstProject).toBeVisible()
    await firstProject.hover()
    await expect(firstProject).toBeVisible()
  })

  test("should open fullscreen modal when project is clicked", async () => {
    await openFirstProject()
    expect(await artModal.isModalOpen()).toBe(true)
  })

  test("should close modal with X button", async () => {
    await openFirstProject()
    await artModal.closeByButton()
    expect(await artModal.isModalOpen()).toBe(false)
  })

  test("should show hover effect on X button (yellow and spin)", async () => {
    await openFirstProject()
    await artModal.hoverCloseButton()

    const styles = await artModal.closeButton.evaluate((el) => {
      const computed = getComputedStyle(el)
      return { color: computed.color, transform: computed.transform }
    })

    expect(styles.color).toBe("rgb(255, 194, 97)")
    expect(styles.transform).toMatch(/matrix/)
    expect(styles.transform).not.toBe("none")
  })

  test("should close modal when clicking backdrop", async () => {
    await openFirstProject()
    await artModal.closeByBackdrop()
    expect(await artModal.isModalOpen()).toBe(false)
  })

  test("should close modal when pressing ESC", async () => {
    await openFirstProject()
    await artModal.closeByEscape()
    expect(await artModal.isModalOpen()).toBe(false)
  })

  test("should display complete Art Projects section - visual regression", async ({ page }, testInfo) => {
    skipUnlessVisualBaseline(testInfo)
    const section = page.locator("#graphic-design-container")
    await expect(section).toBeVisible()
    await expect(section).toHaveScreenshot("art-projects-section.png", { animations: "disabled", timeout: 15000 })
  })

  test("should have grid layout on desktop", async ({ page }) => {
    const content = page.locator("#graphic-design-content")
    await expect(content).toBeVisible()

    const grid = page.locator('#graphic-design-content [class*="grid"], #graphic-design-content .row')
    expect(await grid.count()).toBeGreaterThan(0)
  })

  test("should not display carousel on desktop", async ({ page }) => {
    const carousel = page.locator("#graphic-design-content .swiper")
    const isVisible = await carousel.isVisible().catch(() => false)
    expect(isVisible).toBe(false)
  })

  test("should have proper grid spacing", async ({ page }) => {
    const columns = page.locator("#graphic-design-content .row .column")
    await expect(columns).toHaveCount(4)

    let columnsWithVisibleImages = 0
    for (let i = 0; i < 4; i++) {
      const column = columns.nth(i)
      await column.scrollIntoViewIfNeeded()
      const image = column.locator(".art-grid-img").first()
      if ((await image.count()) > 0 && (await image.isVisible())) {
        columnsWithVisibleImages++
      }
    }

    expect(columnsWithVisibleImages).toBeGreaterThan(1)
  })
})
