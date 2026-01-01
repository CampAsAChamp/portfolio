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
  <li><a href="#testing">Testing</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#deployment">Deployment</a></li>
  <li><a href="#license">License</a></li>
</ol>

<!-- ABOUT THE PROJECT -->

## About The Project

![product-screenshot]

### Built With

[![My Skills](https://skillicons.dev/icons?i=react,vite,ts,html,css,figma,cloudflare)](https://skillicons.dev)

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

<!-- TESTING -->

## Testing

This project includes automated tests to catch regressions and ensure components render correctly.

### Running Tests

Run all tests once:
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

### Continuous Integration

Tests run automatically on every push and pull request via GitHub Actions. The CI pipeline:
- Installs dependencies
- Runs ESLint to check code quality
- Runs all tests
- Builds the project

Pull requests must pass all checks before merging. You can view test results in the "Actions" tab of the repository.

### Test Structure

Tests are located in the `tests/` directory, mirroring the structure of `src/`:
- `tests/App.test.tsx` - Main app component
- `tests/components/` - Component tests organized by feature
- Smoke tests verify components render without errors
- Focus on catching regressions when updating content or refactoring
- Use React Testing Library for behavior-focused testing
- Written in TypeScript for type safety

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

This project uses Husky to enforce quality standards:

- **pre-commit**: Runs lint-staged (ESLint, Prettier, Stylelint on staged files)
- **commit-msg**: Validates commit message format with commitlint
- **pre-push**: Runs all tests (unit and e2e) before pushing

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
- Cloudflare Pages deployments typically complete in 1-2 minutes
- Preview deployments are automatically created for pull requests
- Cloudflare provides automatic HTTPS, CDN, and DDoS protection

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

[product-screenshot]: src/assets/website_screenshot.png
