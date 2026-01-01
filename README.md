<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/CampAsAChamp/portfolio">
    <img src="src/assets/S_Logo_Purple.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Portfolio</h3>

  <p align="center">
    Portfolio Website to visually show off my work in my career and free time
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
  <li><a href="#available-scripts">Available Scripts</a></li>
  <li><a href="#testing">Testing</a></li>
  <li><a href="#project-maintenance">Project Maintenance</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#deployment">Deployment</a></li>
  <li><a href="#license">License</a></li>
</ol>

<!-- ABOUT THE PROJECT -->

## About The Project

![product-screenshot]

### Built With

[![My Skills](https://skills.syvixor.com/api/icons?perline=8&i=reactjs,typescript,tailwindcss,postcss,cloudflare,nodejs,yarn,vite,vitest,playwright,eslint,commitlint,prettier,dependabot,git,github)](https://builder.syvixor.com/)

**Additional Tools:**
- [Playwright](https://playwright.dev/) - E2E testing
- [Vitest](https://vitest.dev/) - Unit testing
- [ESLint](https://eslint.org/) - Code linting
- [Stylelint](https://stylelint.io/) - CSS linting
- [Commitlint](https://commitlint.js.org/) - Commit message validation
- [Husky](https://typicode.github.io/husky/) - Git hooks

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

## Available Scripts

### Development

- `yarn start` or `yarn dev` - Start development server on `localhost:5173`
- `yarn build` - Create production build in `build/` directory
- `yarn preview` - Preview production build locally on `localhost:4173`

### Testing

- `yarn test` - Run unit tests once
- `yarn test:watch` - Run unit tests in watch mode
- `yarn test:ui` - Open interactive Vitest UI
- `yarn test:coverage` - Generate test coverage report
- `yarn test:e2e` - Run Playwright E2E tests
- `yarn test:e2e:ui` - Open interactive Playwright UI
- `yarn test:e2e:headed` - Run E2E tests with visible browser
- `yarn test:all` - Run all tests (unit + E2E)

### Code Quality

- `yarn lint` - Run all linters (ESLint + Stylelint + TypeScript)
- `yarn lint:fix` - Auto-fix linting issues
- `yarn lint:eslint` - Run ESLint only
- `yarn lint:eslint:fix` - Auto-fix ESLint issues
- `yarn lint:types` - Run TypeScript type checking
- `yarn lint:css` - Run Stylelint on CSS files
- `yarn lint:css:fix` - Auto-fix CSS linting issues
- `yarn format` - Format code with Prettier

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

End-to-end tests verify the application works correctly in real browsers using Playwright.

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
- Functional tests verify user interactions and navigation
- Visual regression tests catch unintended UI changes
- Tests run against 5 browser configurations:
  - Desktop: Chrome, Firefox, Safari
  - Mobile: Chrome (Pixel 5), Safari (iPhone 12)

### Run All Tests

Run both unit and E2E tests:
```sh
yarn test:all
```

### Continuous Integration

The CI pipeline runs automatically on every push and pull request via GitHub Actions ([`.github/workflows/test.yml`](.github/workflows/test.yml)):

1. **Setup**: Install Node.js 22 and dependencies
2. **Lint**: Run ESLint, Stylelint, and TypeScript type checking
3. **Test**: Run unit tests with Vitest
4. **Build**: Create production build
5. **Analyze**: Check bundle sizes

**Note:** E2E tests run locally via the pre-push hook but are not part of the CI pipeline to keep build times fast. Pull requests must pass all CI checks before merging.

### Test Structure

Tests are located in the `tests/` directory, mirroring the structure of `src/`:
- `tests/unit/` - Unit tests with Vitest
  - `App.test.tsx` - Main app component
  - `components/` - Component tests organized by feature
  - `hooks/` - Custom hook tests
  - `utils/` - Utility function tests
- `tests/e2e/` - End-to-end tests with Playwright
  - `functional/` - User interaction and navigation tests
  - `visual-regression/` - Screenshot comparison tests
- All tests use TypeScript for type safety
- Focus on catching regressions when updating content or refactoring

<!-- PROJECT MAINTENANCE -->

## Project Maintenance

### Automated Dependency Updates

This project uses [Dependabot](https://docs.github.com/en/code-security/dependabot) to automatically keep dependencies up to date:

- Runs weekly on Mondays at 9:00 AM PST
- Creates grouped pull requests for related dependencies:
  - React ecosystem packages
  - Testing libraries (Vitest, Playwright, Testing Library)
  - Linting tools (ESLint, TypeScript, Prettier, Stylelint)
  - Build tools (Vite, Rollup)
- Also updates GitHub Actions weekly
- Maximum of 5 open dependency PRs at a time
- All PRs follow [conventional commit format](#contributing)

Configuration can be found in [`.github/dependabot.yml`](.github/dependabot.yml).

### Security

For information about reporting security vulnerabilities, see [`SECURITY.md`](SECURITY.md).

### Changelog

All notable changes are documented in [`CHANGELOG.md`](CHANGELOG.md) following the [Keep a Changelog](https://keepachangelog.com/) format.

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
- **pre-push**: Runs `yarn test:all` (both unit and E2E tests) before pushing

**Note:** If tests fail during pre-push, the push will be blocked. Ensure all tests pass locally before pushing.

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
- Pre-push hook runs all tests (unit + E2E) before pushing to remote
- Cloudflare Pages deployments typically complete in 1-2 minutes
- Preview deployments are automatically created for pull requests
- Cloudflare provides automatic HTTPS, CDN, and DDoS protection

<!-- LICENSE -->

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

[product-screenshot]: src/assets/website_screenshot.png
