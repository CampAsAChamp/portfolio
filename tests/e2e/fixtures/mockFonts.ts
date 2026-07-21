import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { Page } from "@playwright/test"

/**
 * Serve Google Fonts (Nunito) from a local cache instead of the live network.
 *
 * The site loads fonts from fonts.googleapis.com/fonts.gstatic.com with no caching or
 * pinning. CI runners fetch them fresh on every run, so glyph rendering timing (and
 * sometimes the exact font format Google's CDN serves) varies run-to-run — the direct
 * cause of the recurring low-percentage visual-regression pixel diffs. Replaying a
 * byte-identical cached response removes that variance without touching production
 * font-loading behavior.
 *
 * Regenerate the cache with `yarn test:e2e:update-font-cache` if the Nunito <link> in
 * index.html changes (new weights/styles).
 */
const FONT_CACHE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "font-cache")

export async function mockGoogleFonts(page: Page): Promise<void> {
  await page.route("https://fonts.googleapis.com/**", async (route) => {
    const cssPath = path.join(FONT_CACHE_DIR, "nunito.css")
    await route.fulfill({
      status: 200,
      contentType: "text/css; charset=utf-8",
      body: fs.readFileSync(cssPath, "utf-8"),
    })
  })

  await page.route("https://fonts.gstatic.com/**", async (route) => {
    const url = new URL(route.request().url())
    const fileName = path.basename(url.pathname)
    const filePath = path.join(FONT_CACHE_DIR, fileName)

    if (!fs.existsSync(filePath)) {
      // Unknown font file (cache is stale) — fall back to the live network rather than fail the test.
      await route.continue()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: fileName.endsWith(".woff2") ? "font/woff2" : "font/woff",
      body: fs.readFileSync(filePath),
    })
  })
}
