import { test as base } from "@playwright/test"

import { mockGoogleFonts } from "./mockFonts"

// Fixed instant for all e2e runs. formatRoleDuration() (src/utils/durationUtils.ts) renders
// tenure text ("2 yrs 3 mos") from the real current date by default, so the rendered string's
// length — and therefore section layout height — silently drifts as real time passes,
// producing visual-regression diffs unrelated to any code change. Freezing only `Date` (not
// timers/rAF, which Swiper's ResizeObserver-driven settle logic and CSS transitions rely on)
// keeps every run deterministic without touching animation timing.
const FROZEN_NOW = "2026-01-01T12:00:00.000Z"

/**
 * Project-wide test object. All specs should import `test`/`expect` from here
 * instead of `@playwright/test` directly, so font mocking (and any future
 * global setup) applies everywhere automatically.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await mockGoogleFonts(page)
    await page.addInitScript((frozenNow) => {
      const RealDate = Date
      class FrozenDate extends RealDate {
        constructor() {
          super(frozenNow)
        }
        static override now(): number {
          return new RealDate(frozenNow).getTime()
        }
      }
      window.Date = FrozenDate as unknown as DateConstructor
    }, FROZEN_NOW)
    await use(page)
  },
})

export { expect } from "@playwright/test"
