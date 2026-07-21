import { test, TestInfo } from "@playwright/test"

/**
 * Projects that own visual baselines. Functional coverage still runs in all browsers;
 * screenshot diffs are Chromium-only so layout changes don't require 5× snapshot churn.
 */
const VISUAL_BASELINE_PROJECTS = new Set(["chromium", "Mobile Chrome"])

export function skipUnlessVisualBaseline(testInfo: TestInfo): void {
  test.skip(
    !VISUAL_BASELINE_PROJECTS.has(testInfo.project.name),
    `Visual baselines are maintained only for: ${[...VISUAL_BASELINE_PROJECTS].join(", ")}`,
  )
}
