# E2E Testing Guide

This directory contains end-to-end tests for the portfolio website using Playwright. These tests ensure all features work correctly across different browsers and devices, preventing regressions.

## Directory Structure

```
tests/e2e/
├── README.md                      # This file
├── E2E Test Requirements.md       # Detailed requirements for all tests
├── fixtures/                      # Page object models
│   ├── BasePage.ts               # Base page with common functionality
│   ├── LandingPage.ts            # Landing page interactions
│   ├── NavbarPage.ts             # Navbar and hamburger menu
│   ├── ModalPage.ts              # Modal interactions
│   └── SectionPage.ts            # Common section operations
├── helpers/                       # Utility functions
│   ├── animation-helpers.ts      # Animation waiting and verification
│   ├── screenshot-helpers.ts     # Visual regression helpers
│   ├── video-helpers.ts          # Video playback testing
│   ├── viewport-helpers.ts       # Responsive testing utilities
│   └── wait-helpers.ts           # Non-flaky waiting strategies
├── desktop/                       # Desktop browser tests
│   ├── landing-page.spec.ts
│   ├── theme-switcher.spec.ts
│   ├── mouse-scroll-indicator.spec.ts
│   ├── contact-me.spec.ts
│   ├── scroll-to-top.spec.ts
│   ├── about-me.spec.ts
│   ├── experience.spec.ts
│   ├── skills-technologies.spec.ts
│   ├── sw-projects.spec.ts
│   ├── art-projects.spec.ts
│   └── footer.spec.ts
└── mobile/                        # Mobile device tests
    ├── landing-page-mobile.spec.ts
    ├── about-me-mobile.spec.ts
    ├── sw-projects-mobile.spec.ts
    ├── art-projects-mobile.spec.ts
    └── general-mobile.spec.ts
```

## Running Tests

### Basic Commands

```bash
# Run all E2E tests
yarn test:e2e

# Run with interactive UI
yarn test:e2e:ui

# Run with visible browser (headed mode)
yarn test:e2e:headed

# Run specific test file
npx playwright test tests/e2e/desktop/landing-page.spec.ts

# Run only desktop tests
npx playwright test tests/e2e/desktop

# Run only mobile tests
npx playwright test tests/e2e/mobile
```

### Browser-Specific Tests

```bash
# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run on mobile devices
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### Debugging

```bash
# Debug mode with Playwright Inspector
npx playwright test --debug

# Debug specific test
npx playwright test tests/e2e/desktop/landing-page.spec.ts --debug

# Run single test in headed mode
npx playwright test tests/e2e/desktop/landing-page.spec.ts --headed

# View test report
npx playwright show-report test_results/e2e/html-report
```

## Test Configuration

Tests are configured in `playwright.config.ts` with:

- **Base URL**: `http://localhost:5173`
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries in CI, 0 locally
- **Workers**: 4 parallel workers locally, 2 in CI
- **Browsers**: Chrome, Firefox, Safari (desktop + mobile)
- **Visual Regression**: Enabled with tolerant settings for minor rendering differences

## Writing Tests

### Page Objects Pattern

Use page objects for reusable interactions:

```typescript
import { LandingPage } from '../fixtures/LandingPage'

test('should display landing page', async ({ page }) => {
  const landingPage = new LandingPage(page)
  await landingPage.goto('/')
  await landingPage.verifyAllElementsVisible()
})
```

### Anti-Flaky Practices

**DO:**
- Use Playwright's built-in waiting (`waitFor`, `toBeVisible`)
- Wait for specific conditions with `expect()` / `expect.poll()`
- Use `waitForLoadState('networkidle')` after navigation
- Use helpers (`SectionPage.scrollToSection`, Swiper/video/`ModalPage`)
- Use proper locators (`data-testid`, semantic selectors, stable IDs)

**DON'T:**
- Use `page.waitForTimeout()` in specs (banned by ESLint)
- Assert `hide`/`show`/`entrance` CSS classes repeatedly
- Make assumptions about timing
- Create tests that depend on each other
- Use hard-coded delays

### Stable assertion principles

1. **User-visible outcomes** — `toBeVisible`, `toBeInViewport`, theme attribute, dialog open/closed. Prefer one contract assertion over four class-name variants.
2. **API-first** — `scrollIntoViewIfNeeded` / `scrollToSection`, `swiperSlideNext` + `getSwiperRealIndex`, `ensureVideoPlaying`, `ModalPage` — not click/tap races with sleeps.
3. **Chromium-only for animation / pixel / exact-index** — visual baselines via `skipUnlessVisualBaseline`; delete hollow “stagger animation” tests that only sleep then assert visibility.

### Visual Regression Testing

Baselines are **Linux-only** (what CI runs). Local Darwin snapshots are skipped so a green Mac run does not hide CI diffs.

- Projects: **Chromium** + **Mobile Chrome** (`skipUnlessVisualBaseline`)
- Prefer CSS/DOM assertions for hover and icon morph — do not screenshot hover states
- After intentional UI changes, regenerate Linux baselines with Docker:

```bash
yarn test:e2e:update-snapshots
```

Do **not** commit Darwin-only `--update-snapshots` from your Mac — those files are not what CI compares.

```typescript
import { takeStableScreenshot } from '../helpers/screenshot-helpers'
import { skipUnlessVisualBaseline } from '../helpers/visual-helpers'

test('should match visual snapshot', async ({ page }, testInfo) => {
  skipUnlessVisualBaseline(testInfo)
  await page.goto('/')
  await takeStableScreenshot(page, 'landing-page', {
    fullPage: false,
  })
})
```

After intentional UI changes, update Linux snapshots via Docker:

```bash
yarn test:e2e:update-snapshots
```

### Video Testing

```typescript
import { ensureVideoPlaying, waitForVideoReady } from '../helpers/video-helpers'

test('should autoplay video', async ({ page }) => {
  const video = page.locator('video').first()
  await waitForVideoReady(video)
  await ensureVideoPlaying(video)
})
```

### Mobile Testing

```typescript
import { devices } from '@playwright/test'

test.use(devices['iPhone 12'])

test('should display mobile layout', async ({ page }) => {
  // Test will run with iPhone 12 viewport
})
```

## Test Requirements

All test requirements are documented in [`E2E Test Requirements.md`](./E2E%20Test%20Requirements.md). This file serves as:

- Living documentation of expected behaviors
- Reference for test implementation
- Regression prevention checklist
- Version-controlled source of truth

## CI/CD Integration

E2E tests run automatically in GitHub Actions on:
- Every push to `main` branch
- Every pull request

On failure, the CI workflow uploads:
- HTML test report
- Screenshots of failed tests
- Video recordings (if enabled)

Artifacts are retained for 30 days.

## Troubleshooting

### Tests Failing Locally

1. **Ensure dev server is running**: Tests expect `http://localhost:5173`
2. **Clear browser cache**: `npx playwright test --clear-cache`
3. **Update browsers**: `npx playwright install`
4. **Check Node version**: Must be 22+ (use `nvm use`)

### Visual Regression Failures

Visual regression tests may fail due to:
- Font rendering differences between OS
- Browser version updates
- Intentional UI changes

To update baselines:
```bash
# Update all screenshots
npx playwright test --update-snapshots

# Update specific test screenshots
npx playwright test landing-page.spec.ts --update-snapshots
```

### Flaky Tests

If a test is flaky:
1. Check for arbitrary `waitForTimeout()` calls
2. Verify proper waiting strategies are used
3. Ensure test isolation (no shared state)
4. Run test multiple times: `npx playwright test --repeat-each=10`

### Mobile Tests Not Running

Ensure mobile browsers are installed:
```bash
npx playwright install --with-deps
```

## Best Practices

1. **Test User Flows**: Test complete user journeys, not just individual elements
2. **Keep Tests Independent**: Each test should work in isolation
3. **Use Descriptive Names**: Test names should clearly describe what they verify
4. **Group Related Tests**: Use `test.describe()` blocks for organization
5. **Clean Up**: Reset state between tests (clear localStorage, etc.)
6. **Verify Accessibility**: Include keyboard navigation and ARIA tests
7. **Test Responsiveness**: Verify layouts work across viewports
8. **Document Complex Tests**: Add comments for non-obvious test logic

## Performance

To keep tests fast:
- Tests run in parallel (4 workers locally, 2 in CI)
- Lazy load page objects
- Use `test.beforeEach()` for common setup
- Skip unnecessary navigation
- Reuse browser contexts when possible

## Contributing

When adding new features:
1. Write E2E tests first (TDD approach)
2. Update `E2E Test Requirements.md` with new requirements
3. Follow existing patterns and anti-flaky practices
4. Run tests locally before pushing
5. Ensure tests pass in all browsers

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Visual Regression Testing](https://playwright.dev/docs/test-snapshots)
- [Debugging Tests](https://playwright.dev/docs/debug)
