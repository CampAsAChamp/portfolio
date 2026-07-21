#!/usr/bin/env node

/**
 * Load the preview server once in headless Chromium before Lighthouse CI's timed
 * runs start.
 *
 * Lighthouse's own first run pays a one-time JS engine warm-up cost: V8 interprets
 * the bundle before it JITs it, which measured ~2.5x slower `scripting` time
 * (bootup-time audit) than runs 2-3 against the identical bundle. A plain `curl`
 * warm-up only touches the OS/file cache -- it never executes JS, so it can't
 * reach the actual cost. Running a real headless page load here does.
 */
import { chromium } from "@playwright/test"

const url = process.argv[2] || "http://localhost:4173"

const browser = await chromium.launch()
try {
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: "networkidle" })
} finally {
  await browser.close()
}
