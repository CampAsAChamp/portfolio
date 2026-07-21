<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/CampAsAChamp/portfolio">
    <img src="src/assets/S_Logo_Purple.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Portfolio</h3>

  <p align="center">
    Portfolio Website to visually show off my work in my career and free time.
    <br />
    <a href="https://nickhs.dev/">https://nickhs.dev/</a>
    <br />
    <br />
    <a href="https://nickhs.dev/">View Website</a>
    ·
    <a href="https://github.com/CampAsAChamp/portfolio/issues">Report Bug</a>
    ·
    <a href="https://github.com/CampAsAChamp/portfolio/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

## Table of Contents

<ol>
  <li>
    <a href="#about-the-project">About The Project</a>
    <ul>
      <li><a href="#built-with">Built With</a></li>
    </ul>
  </li>
  <li>
    <a href="#getting-started">Getting Started</a>
    <ul>
      <li><a href="#installation">Installation</a></li>
    </ul>
  </li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#career-content-editor">Career Content Editor</a></li>
  <li><a href="#available-scripts">Available Scripts</a></li>
  <li><a href="#testing">Testing</a></li>
  <li><a href="#project-maintenance">Project Maintenance</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#releases">Releases</a></li>
  <li><a href="#deployment">Deployment</a></li>
  <li><a href="#license">License</a></li>
</ol>

<!-- ABOUT THE PROJECT -->

## About The Project

![product-screenshot]

### Built With

[![My Skills](https://skills.syvixor.com/api/icons?perline=7&i=reactjs,typescript,nodejs,yarn,vite,vitest,playwright,eslint,prettier,commitlint,git,github,cloudflare)](https://builder.syvixor.com/)

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- Node.js version 22 or higher
- Yarn package manager (version 4 or higher)
- (Optional) [nvm](https://github.com/nvm-sh/nvm) for Node version management

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/CampAsAChamp/portfolio.git
   ```
2. Navigate into the repo
   ```sh
   cd portfolio
   ```
3. (Optional) If using nvm, install and use the correct Node version
   ```sh
   nvm install
   nvm use
   ```
   This will automatically use the Node version specified in `.nvmrc`
4. Install dependencies
   ```sh
   yarn install
   ```
   Or simply:
   ```sh
   yarn
   ```
5. Start the development server
   ```sh
   yarn start
   ```
6. Open your web browser to `localhost:5173`

## Usage

1. View the site live at https://nickhs.dev/

## Career Content Editor

Local tooling keeps experience content in sync across the portfolio, LinkedIn, and resume from a YAML source of truth (`career/content/experiences.yaml`).

```sh
yarn career:ui       # local editor at http://127.0.0.1:4700
yarn career:sync     # generate portfolio data + LinkedIn/resume exports
yarn career:check    # fail if src/data/experiences.ts is stale vs YAML
```

The editor UI is localhost-only and is **not** part of the Cloudflare Pages deploy. Full workflow, schema notes, and layout: [`career/README.md`](career/README.md).

## Available Scripts

### Development

- `yarn start` or `yarn dev` - Start development server on `localhost:5173`
- `yarn build` - Create production build in `build/` directory
- `yarn preview` - Preview production build locally on `localhost:4173`

### Career content

- `yarn career:ui` - Start the local career content editor
- `yarn career:sync` - Generate portfolio experiences + LinkedIn/resume exports
- `yarn career:check` - Fail if generated portfolio data is stale vs YAML
- See [`career/README.md`](career/README.md) for `career:generate`, `career:linkedin`, `career:resume`, and more

### Testing

- `yarn test` - Run unit tests once
- `yarn test:watch` - Run unit tests in watch mode
- `yarn test:ui` - Open interactive Vitest UI
- `yarn test:coverage` - Generate test coverage report
- `yarn test:e2e` - Run Playwright E2E tests
- `yarn test:e2e:ui` - Open interactive Playwright UI
- `yarn test:e2e:headed` - Run E2E tests with visible browser
- `yarn test:lighthouse` - Run Lighthouse CI audits (builds and audits production site)
- `yarn test:all` - Run all tests (unit + Lighthouse + E2E)

### Code Quality

- `yarn lint` - Run all linters (ESLint, TypeScript, Stylelint, Prettier)
- `yarn lint:fix` - Auto-fix linting issues and format code
- `yarn lint:eslint` - Run ESLint only
- `yarn lint:eslint:fix` - Auto-fix ESLint issues
- `yarn lint:types` - Run TypeScript type checking
- `yarn lint:css` - Run Stylelint on CSS files
- `yarn lint:css:fix` - Auto-fix CSS linting issues

### Analysis

- `yarn analyze` - Analyze bundle size with source-map-explorer

<!-- TESTING -->

## Testing

This project includes comprehensive automated testing to catch regressions and ensure quality.

### Unit Tests

Unit tests verify component rendering and behavior using Vitest and React Testing Library.

Run all unit tests once:
```sh
yarn test
```

Run tests in watch mode (useful during development):
```sh
yarn test:watch
```

Open the Vitest UI for an interactive testing experience:
```sh
yarn test:ui
```

Generate test coverage report:
```sh
yarn test:coverage
```

### E2E Tests

End-to-end tests verify the application works correctly in real browsers using Playwright. These tests ensure no regressions occur when making changes to the codebase.

Run all E2E tests:
```sh
yarn test:e2e
```

Run E2E tests with interactive UI:
```sh
yarn test:e2e:ui
```

Run E2E tests with browser visible (headed mode):
```sh
yarn test:e2e:headed
```

**Test Coverage:**

The E2E test suite comprehensively validates all features documented in [`tests/e2e/E2E Test Requirements.md`](tests/e2e/E2E%20Test%20Requirements.md):

**Desktop Tests:**
- **Landing Page**: Element visibility, navbar navigation, smooth scrolling, animations
- **Theme Switcher**: Dark/light mode toggle, localStorage persistence, visual regression
- **Mouse Scroll Indicator**: Animations, visibility thresholds, fade out behavior
- **Contact Me**: Button hover effects, modal interactions (open/close/ESC/backdrop), social links
- **Scroll To Top**: Visibility threshold, smooth scrolling, hover effects
- **About Me**: Layout, image animations with stagger, organic blob background
- **Experience**: Company cards, colors, technologies, clickable links, animations
- **Skills & Technologies**: Grid layout, hover effects, color wipe animations, stagger
- **SW Projects**: Project cards, video autoplay, technologies, buttons, links
- **Art Projects**: Grid layout, hover effects, fullscreen modal, modal interactions
- **Footer**: Page layout integrity

**Mobile Tests:**
- **Landing Page Mobile**: Hamburger menu, drawer animations, nav link behavior, profile pic centering
- **About Me Mobile**: Single column layout, element order (Images → Title → Description)
- **SW Projects Mobile**: Single column cards, video handling, Instagram browser detection
- **Art Projects Mobile**: Carousel instead of grid, swipe gestures, pagination dots
- **General Mobile**: No scroll indicator, no scroll-to-top button, touch interactions

**Test Reliability:**
- All tests follow anti-flaky practices (no arbitrary timeouts, proper waiting strategies)
- Visual regression testing with screenshot comparison
- Tests run against 5 browser configurations:
  - Desktop: Chrome, Firefox, Safari
  - Mobile: Chrome (Pixel 5), Safari (iPhone 12)
- Automatic retries in CI (2 retries on failure)
- Test results and screenshots uploaded as artifacts on failure

**Running Specific Test Suites:**
```sh
# Run only desktop tests
npx playwright test tests/e2e/desktop

# Run only mobile tests  
npx playwright test tests/e2e/mobile

# Run specific test file
npx playwright test tests/e2e/desktop/landing-page.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project="Mobile Safari"
```

**Debugging Failed Tests:**
```sh
# Run in debug mode with Playwright Inspector
npx playwright test --debug

# Run with visible browser
yarn test:e2e:headed

# View test report after run
npx playwright show-report test_results/e2e/html-report
```

### Lighthouse Performance Audits

Lighthouse CI verifies the portfolio maintains high performance, accessibility, best practices, and SEO standards using Google's official Lighthouse tooling.

Run Lighthouse audits locally:
```sh
yarn test:lighthouse          # Runs desktop tests (default)
yarn test:lighthouse:desktop  # Explicitly run desktop tests
yarn test:lighthouse:mobile   # Run mobile tests with device emulation
yarn test:lighthouse:both     # Run both desktop and mobile tests
```

This command builds the production site and runs a Lighthouse audit to verify performance and quality standards.

**Monitored Metrics:**
- **Performance** (threshold: 85+): Load times, Core Web Vitals (LCP, CLS, FID), bundle optimization
- **Accessibility** (threshold: 90+): ARIA labels, keyboard navigation, color contrast, semantic HTML
- **Best Practices** (threshold: 90+): HTTPS, console errors, deprecated APIs, security
- **SEO** (threshold: 90+): Meta tags, mobile-friendliness, structured data

**Configuration:** Lighthouse settings are defined in:
- [`.lighthouserc.desktop.json`](.lighthouserc.desktop.json) - Desktop preset (no throttling)
- [`.lighthouserc.mobile.json`](.lighthouserc.mobile.json) - Mobile preset (375x667, 4G throttling, 4x CPU slowdown)

**GitHub Integration:** Lighthouse CI is configured with a GitHub token to provide:
- ✅ Status checks on commits showing pass/fail for each category
- 💬 PR comments with score comparisons when changes affect performance
- 📊 Integration with GitHub's checks interface

**Local Development:** To run Lighthouse locally without token warnings:
1. Copy `.env.example` to `.env.local`: `cp .env.example .env.local`
2. Add your GitHub token to `.env.local`
3. The token will be automatically loaded when running `yarn test:lighthouse`

### Run All Tests

Run unit tests, Lighthouse audits, and E2E tests:
```sh
yarn test:all
```

This command runs all three test suites in sequence: unit tests with Vitest, Lighthouse performance audits, and E2E tests with Playwright. Tests are ordered from fastest to slowest for quicker feedback.

### Continuous Integration

The CI pipeline runs automatically on every push and pull request via GitHub Actions ([`.github/workflows/test.yml`](.github/workflows/test.yml)):

**Test Job:**
1. **Setup**: Install Node.js 22 and dependencies
2. **Lint**: Run ESLint, Stylelint, and TypeScript type checking
3. **Test**: Run unit tests with Vitest
4. **Build**: Create production build
5. **Analyze**: Check bundle sizes

**Lighthouse Job** (runs after Test job passes):
1. **Build**: Create production build
2. **Audit**: Run desktop Lighthouse audits for performance, accessibility, best practices, and SEO
3. **Upload**: Save reports to temporary public storage and GitHub artifacts
4. **Status**: Post GitHub status check with pass/fail results

You can view interactive Lighthouse reports directly from the GitHub Actions run output via the temporary public storage link.

**Note:** E2E tests run in CI as part of the Test workflow (`test.yml`). The pre-push hook runs unit tests and desktop Lighthouse audits (not the full `yarn test:all` suite). Pull requests must pass all CI checks before merging.

### Test Structure

Tests are located in the `tests/` directory, mirroring the structure of `src/`:
- `tests/unit/` - Unit tests with Vitest
  - `App.test.tsx` - Main app component
  - `components/` - Component tests organized by feature
  - `hooks/` - Custom hook tests
  - `utils/` - Utility function tests
- `tests/e2e/` - End-to-end tests with Playwright
  - `desktop/` - Desktop browser specs
  - `mobile/` - Mobile browser specs
  - `fixtures/` - Page object models
  - `helpers/` - Shared E2E helpers
- `.lighthouserc.desktop.json` / `.lighthouserc.mobile.json` - Lighthouse CI configurations for performance audits
- All tests use TypeScript for type safety
- Focus on catching regressions when updating content or refactoring

<!-- PROJECT MAINTENANCE -->

## Project Maintenance

### Security

For information about reporting security vulnerabilities, see [`SECURITY.md`](SECURITY.md).

### Changelog

All notable changes are automatically documented in [`CHANGELOG.md`](CHANGELOG.md) by semantic-release. The changelog is generated from conventional commit messages and should not be manually edited. See [Releases](#releases) for more information.

<!-- CONTRIBUTING -->

## Contributing

This project follows conventional commit standards to maintain a clean and readable git history.

### Commit Message Format

All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<optional-scope>): <subject>
```

**Example commits:**
```sh
feat: add dark mode toggle
fix: resolve mobile navigation bug
docs: update README with setup instructions
chore: update dependencies
refactor(auth): simplify login logic
test: add unit tests for utils
style: format code with prettier
perf: optimize image loading
```

### Commit Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code changes that neither fix bugs nor add features
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Validation

Commit messages are automatically validated using [commitlint](https://commitlint.js.org/):

- The commit-msg hook runs on every commit
- Invalid commit messages will be rejected
- You'll see an error message explaining what's wrong

To manually validate a commit message:
```sh
echo "feat: your message" | yarn commitlint
```

### Pre-commit Hooks

This project uses [Husky](https://typicode.github.io/husky/) to enforce quality standards:

- **pre-commit**: Runs `lint-staged` which formats and lints only staged files:
  - ESLint auto-fixes JavaScript/TypeScript issues
  - Prettier formats code
  - Stylelint fixes CSS issues
- **commit-msg**: Validates commit message format with `commitlint` (rejects invalid commits)
- **pre-push**: Runs `yarn test && yarn test:lighthouse` (unit tests and desktop Lighthouse) before pushing

**Note:** If tests fail during pre-push, the push will be blocked. Ensure unit and Lighthouse checks pass locally before pushing. Run `yarn test:e2e` (or `yarn test:all`) when UI changes warrant full E2E coverage.

**Node Version:** All tests require Node.js version 22 or higher (specified in `.nvmrc`). If you use nvm, run `nvm use` to switch to the correct version.

<!-- DEPLOYMENT -->

## Deployment

This project automatically deploys to Cloudflare Pages.

### Automatic Deployment

Cloudflare Pages automatically deploys your site whenever you push to the repository:

1. Make your changes and commit them (following [conventional commit format](#contributing)):
   ```sh
   git add .
   git commit -m "feat: your feature description"
   ```

2. Push to the main branch:
   ```sh
   git push origin main
   ```

3. Cloudflare Pages will automatically:
   - Detect the changes
   - Install dependencies
   - Build the project with `yarn build`
   - Deploy to production

4. View deployment status and logs in your Cloudflare Pages dashboard

5. Your site will be live at `https://nickhs.dev` (or your configured domain)

### Cloudflare Pages Configuration

Your Cloudflare Pages project should be configured with:

- **Build command:** `yarn build`
- **Build output directory:** `build`
- **Root directory:** `/` (default)
- **Node version:** 22 or higher

### Custom Domain

The custom domain `nickhs.dev` is configured in Cloudflare:

1. DNS is managed through Cloudflare
2. SSL/TLS is automatically handled
3. CDN caching and optimization are enabled

To update the domain or DNS settings, visit your Cloudflare dashboard.

### Local Development Build

To create a production build locally without deploying:

```sh
yarn build
```

This creates an optimized build in the `build` folder. To preview the production build locally:

```sh
yarn preview
```

This will serve the production build at `localhost:4173`.

### Notes

- Follow [conventional commit format](#contributing) for all commits
- Pre-commit hooks automatically format code and validate commits
- Pre-push hook runs unit tests and desktop Lighthouse before pushing to remote
- Cloudflare Pages deployments typically complete in 1-2 minutes
- Preview deployments are automatically created for pull requests
- Cloudflare provides automatic HTTPS, CDN, and DDoS protection

<!-- RELEASES -->

## Releases

This project uses [semantic-release](https://semantic-release.gitbook.io/) for automated version management and changelog generation.

### How It Works

Releases are fully automated based on your commit messages:

1. **Commit with conventional format** (following the [Contributing](#contributing) guidelines)
2. **Push to main branch** - triggers the CI pipeline
3. **After tests pass** - the Release workflow automatically:
   - Analyzes commits since the last release
   - Determines the next version number based on commit types
   - Generates release notes from commit messages
   - Updates `CHANGELOG.md`
   - Creates a GitHub release with notes
   - Tags the release in git

### Version Bumping Rules

The version number is automatically determined by commit types:

- **Major release** (1.0.0 → 2.0.0): Commits with `BREAKING CHANGE:` in the footer
- **Minor release** (1.0.0 → 1.1.0): `feat:` commits
- **Patch release** (1.0.0 → 1.0.1): `fix:`, `perf:`, or `revert:` commits
- **No release**: `docs:`, `style:`, `chore:`, `refactor:`, `test:`, `build:`, `ci:` commits (but they still appear in the changelog)

### Example Workflow

```sh
# Make changes
git add .

# Commit with conventional format - will trigger patch release
git commit -m "fix: resolve mobile navigation bug"

# Push to main
git push origin main

# GitHub Actions will:
# 1. Run tests (test.yml workflow)
# 2. If tests pass, run release (release.yml workflow)
# 3. Create version 1.0.1 with generated changelog
# 4. Create GitHub release with notes
```

### Important Notes

- **DO NOT manually edit `CHANGELOG.md`** - it's automatically generated by semantic-release
- Releases only happen on the `main` branch after successful test runs
- The release workflow can be viewed at `.github/workflows/release.yml`
- Release configuration is in `.releaserc.json`

<!-- LICENSE -->

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

[product-screenshot]: src/assets/website_screenshot.png
