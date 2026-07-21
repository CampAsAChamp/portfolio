import { expect, Locator, Page } from "@playwright/test"

/**
 * Helpers for Swiper carousels — wait on slide state instead of fixed timeouts.
 */

interface SwiperHost extends HTMLElement {
  swiper?: {
    slideNext: (speed?: number) => void
    slidePrev: (speed?: number) => void
    activeIndex: number
    realIndex: number
  }
}

export function getActiveSlide(page: Page, rootSelector: string): Locator {
  return page.locator(`${rootSelector} .swiper-slide-active`).first()
}

export async function getActiveSlideIndex(page: Page, rootSelector: string): Promise<string | null> {
  return getActiveSlide(page, rootSelector).getAttribute("data-swiper-slide-index")
}

export async function getSwiperRealIndex(page: Page, rootSelector: string): Promise<number> {
  return page.locator(`${rootSelector} .swiper`).evaluate((el: SwiperHost) => el.swiper?.realIndex ?? -1)
}

/**
 * Wait until the active slide index differs from `fromIndex`.
 */
export async function waitForSlideIndexChange(
  page: Page,
  rootSelector: string,
  fromIndex: string | null,
  timeout = 10000,
): Promise<string | null> {
  await expect.poll(async () => getActiveSlideIndex(page, rootSelector), { timeout, intervals: [50, 100, 200] }).not.toBe(fromIndex)

  return getActiveSlideIndex(page, rootSelector)
}

/**
 * Wait until the active slide index equals `expectedIndex`.
 */
export async function waitForSlideIndex(page: Page, rootSelector: string, expectedIndex: string | null, timeout = 10000): Promise<void> {
  await expect.poll(async () => getActiveSlideIndex(page, rootSelector), { timeout, intervals: [50, 100, 200] }).toBe(expectedIndex)
}

/**
 * Navigate via Swiper's public API (avoids flaky hit-targets / mid-transition taps).
 * speed=0 skips the slide animation so assertions can run immediately.
 */
export async function swiperSlideNext(page: Page, rootSelector: string): Promise<void> {
  await page.locator(`${rootSelector} .swiper`).evaluate((el: SwiperHost) => {
    el.swiper?.slideNext(0)
  })
}

export async function swiperSlidePrev(page: Page, rootSelector: string): Promise<void> {
  await page.locator(`${rootSelector} .swiper`).evaluate((el: SwiperHost) => {
    el.swiper?.slidePrev(0)
  })
}

/**
 * Tap a Swiper nav control via DOM click to avoid hit-target / overlay flakiness.
 */
export async function clickSwiperNav(button: Locator): Promise<void> {
  await expect(button).toBeVisible()
  await button.evaluate((el) => (el as HTMLElement).click())
}
