import { test, TestInfo } from "@playwright/test"

/**
 * Visual baselines are **Linux-only** (CI). Updating Darwin snapshots locally will not fix CI.
 * Regenerate with `yarn test:e2e:update-snapshots` (Docker).
 *
 * Which projects run `@visual` tests is controlled in `config/playwright.config.ts`
 * (chromium + Mobile Chrome only). This helper guards against false greens on macOS.
 */
export function skipUnlessVisualBaseline(_testInfo: TestInfo): void {
  test.skip(
    process.platform === "darwin" && process.env.PW_UPDATE_LINUX_SNAPSHOTS !== "1",
    "Visual baselines are Linux-only (CI). Update with: yarn test:e2e:update-snapshots",
  )
}
