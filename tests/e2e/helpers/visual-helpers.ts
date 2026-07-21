import { test, TestInfo } from "@playwright/test"

/**
 * Projects that own visual baselines. Functional coverage still runs in all browsers;
 * screenshot diffs are Chromium-only so layout changes don't require 5× snapshot churn.
 *
 * Baselines are **Linux-only** (CI). Updating Darwin snapshots locally will not fix CI.
 * Regenerate with `yarn test:e2e:update-snapshots` (Docker).
 */
const VISUAL_BASELINE_PROJECTS = new Set(["chromium", "Mobile Chrome"])

export function skipUnlessVisualBaseline(testInfo: TestInfo): void {
  test.skip(
    !VISUAL_BASELINE_PROJECTS.has(testInfo.project.name),
    `Visual baselines are maintained only for: ${[...VISUAL_BASELINE_PROJECTS].join(", ")}`,
  )
  // Avoid false greens from Darwin snapshots that diverge from Linux CI.
  test.skip(
    process.platform === "darwin" && process.env.PW_UPDATE_LINUX_SNAPSHOTS !== "1",
    "Visual baselines are Linux-only (CI). Update with: yarn test:e2e:update-snapshots",
  )
}
