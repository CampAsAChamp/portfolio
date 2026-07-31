import path from "path"
import { fileURLToPath } from "url"
import { defineConfig, devices } from "@playwright/test"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, "..")

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: path.resolve(rootDir, "./tests/e2e"),
  timeout: 60_000,
  /* Output directory for test artifacts */
  outputDir: path.resolve(rootDir, "./tests/test_results/e2e/results"),
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* No retries by default: the modal-open race and WebKit-specific flakiness that used to
   * require retries are now fixed at the source (see ContactMeBar/ContactMeModal and the
   * dropped desktop webkit project). Keeping retries at 0 means a real regression fails CI
   * on the first run instead of being silently absorbed. The Mobile Safari project overrides
   * this below — WebKit itself occasionally crashes mid-navigation under CI load (a real
   * engine bug, not our code — see BasePage.clearStorageAndGoto), so it keeps 1 retry to
   * absorb that without masking genuine regressions on the other (retries: 0) projects. */
  retries: 0,
  /* Two workers on CI — faster than serial, still conservative on 2-vCPU runners. */
  workers: process.env.CI ? 2 : 4,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { outputFolder: path.resolve(rootDir, "./tests/test_results/e2e/html-report"), open: "never" }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:5173",
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    /* Screenshot on failure */
    screenshot: "only-on-failure",
    /* Match site prefers-reduced-motion styles — disables smooth scroll / entrance motion flakiness */
    contextOptions: {
      reducedMotion: "reduce",
    },
  },

  /* Visual regression testing configuration */
  expect: {
    /* Maximum time expect() should wait for the condition to be met. */
    timeout: 10000,
    /* Screenshot comparison settings */
    toHaveScreenshot: {
      /*
       * Tolerant settings to account for minor rendering differences across browsers
       * and dynamic content loading. This catches major visual regressions while
       * avoiding false positives from minor layout shifts.
       */
      maxDiffPixelRatio: 0.02,
      /* Threshold for pixel color difference (0-1, higher = more tolerant) */
      threshold: 0.4,
      /* Scale images to compare their structure regardless of minor size differences */
      scale: "css",
      /* Disable animations for consistent screenshots */
      animations: "disabled",
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      testMatch: "**/desktop/**/*.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      testMatch: "**/desktop/**/*.spec.ts",
      grepInvert: /@visual/,
      use: { ...devices["Desktop Firefox"] },
    },

    /* Desktop WebKit intentionally dropped: negligible desktop Safari traffic for this site,
     * and headless WebKit-in-Docker-on-CI is a persistent source of environment-only flakiness
     * (focus-event timing, compositor differences) unrelated to real user risk. Mobile Safari
     * coverage below (real iOS traffic) is kept. */

    /* Test against mobile viewports. */
    {
      name: "Mobile Chrome",
      testMatch: "**/mobile/**/*.spec.ts",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      testMatch: "**/mobile/**/*.spec.ts",
      grepInvert: /@visual/,
      // 1 retry: WebKit occasionally throws "encountered an internal error" on page.goto
      // under CI's 2-worker load — a genuine engine crash, not app or test flakiness. See
      // the retries comment above for why other projects stay at 0.
      retries: 1,
      use: { ...devices["iPhone 12"] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "yarn start",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
})
