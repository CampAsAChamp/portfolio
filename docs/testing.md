# Testing

Automated tests catch regressions across components, browsers, and performance. See also the [Available Scripts](../README.md#available-scripts) section in the README for a full command list.

## Unit Tests

Unit tests verify component rendering and behavior using Vitest and React Testing Library.

```sh
yarn test              # run once
yarn test:watch        # watch mode
yarn test:ui           # interactive Vitest UI
yarn test:coverage     # coverage report
```

Unit tests live in `tests/unit/`, mirroring `src/` (components, hooks, utils).

## E2E Tests

End-to-end tests verify the application in real browsers using Playwright — desktop and mobile, with visual regression and anti-flaky waiting strategies.

```sh
yarn test:e2e          # all E2E tests
yarn test:e2e:ui       # interactive Playwright UI
yarn test:e2e:headed   # visible browser
```

For the full guide — commands, page objects, writing tests, visual baselines, debugging — see [`tests/e2e/README.md`](../tests/e2e/README.md). Feature coverage is documented in [`tests/e2e/E2E Test Requirements.md`](../tests/e2e/E2E%20Test%20Requirements.md).

## Lighthouse Performance Audits

Lighthouse CI verifies performance, accessibility, best practices, and SEO using Google's official tooling.

```sh
yarn test:lighthouse          # desktop (default)
yarn test:lighthouse:mobile   # mobile with device emulation
yarn test:lighthouse:both     # both presets
```

Each command builds the production site first, then runs audits.

**Thresholds (local configs):**

- **Performance** (85+): Core Web Vitals, bundle optimization
- **Accessibility** (90+): ARIA, keyboard nav, contrast, semantic HTML
- **Best Practices** (90+): HTTPS, console errors, security
- **SEO** (90+): Meta tags, mobile-friendliness, structured data

**Configuration:**

- [`.lighthouserc.desktop.json`](../.lighthouserc.desktop.json) — desktop preset (no throttling)
- [`.lighthouserc.mobile.json`](../.lighthouserc.mobile.json) — mobile preset (375×667, 4G throttling, 4× CPU slowdown)

Mobile performance investigation notes (CI gate, TBT/LCP root cause): [`LIGHTHOUSE_MOBILE_PERF.md`](../LIGHTHOUSE_MOBILE_PERF.md).

**GitHub integration:** Lighthouse CI posts status checks and PR comments when a GitHub token is configured. To avoid local token warnings, copy `.env.example` to `.env.local` and add your token.

## Run All Tests

```sh
yarn test:all
```

Runs unit tests, Lighthouse audits, and E2E tests in sequence (fastest to slowest).

## Continuous Integration

The CI pipeline runs on every push and pull request via [`.github/workflows/test.yml`](../.github/workflows/test.yml):

**Test job:** lint → unit tests → build → E2E → upload `build/` artifact → (on `main` push) deploy

**Lighthouse job** ([`lighthouse.yml`](../.github/workflows/lighthouse.yml), after Tests pass on `main`): desktop + mobile audits, artifact upload, GitHub status checks.

Workflow details: [`.cursor/rules/ci-workflows.mdc`](../.cursor/rules/ci-workflows.mdc).

## Test Structure

```
tests/
├── unit/           # Vitest + Testing Library
├── e2e/
│   ├── desktop/    # Desktop browser specs
│   ├── mobile/     # Mobile browser specs
│   ├── fixtures/   # Page object models
│   └── helpers/    # Shared E2E helpers
```
