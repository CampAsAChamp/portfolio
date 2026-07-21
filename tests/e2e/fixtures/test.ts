import { test as base } from "@playwright/test"

import { mockGoogleFonts } from "./mockFonts"

/**
 * Project-wide test object. All specs should import `test`/`expect` from here
 * instead of `@playwright/test` directly, so font mocking (and any future
 * global setup) applies everywhere automatically.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await mockGoogleFonts(page)
    await use(page)
  },
})

export { expect } from "@playwright/test"
