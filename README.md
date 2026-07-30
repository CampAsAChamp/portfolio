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
  <li><a href="#experience-sync-editor">Experience Sync Editor</a></li>
  <li><a href="#available-scripts">Available Scripts</a></li>
  <li><a href="#documentation">Documentation</a></li>
  <li><a href="#project-maintenance">Project Maintenance</a></li>
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

Live site: https://nickhs.dev/

## Experience Sync Editor

Local tooling keeps experience content in sync across the portfolio, LinkedIn, and resume from a YAML source of truth (`experience-sync/content/experiences.yaml`).

```sh
yarn exp:ui       # local editor at http://127.0.0.1:4700
yarn exp:sync     # generate portfolio data + LinkedIn/resume exports
yarn exp:check    # fail if src/data/experiences.ts is stale vs YAML
```

The editor UI is localhost-only and is **not** part of the Cloudflare Pages deploy. Full workflow, schema notes, and layout: [`experience-sync/README.md`](experience-sync/README.md).

## Available Scripts

### Development

- `yarn start` or `yarn dev` - Start development server on `localhost:5173`
- `yarn build` - Create production build in `build/` directory
- `yarn preview` - Preview production build locally on `localhost:4173`

### Experience sync

- `yarn exp:ui` - Start the local experience content editor
- `yarn exp:sync` - Generate portfolio experiences + LinkedIn/resume exports
- `yarn exp:check` - Fail if generated portfolio data is stale vs YAML
- See [`experience-sync/README.md`](experience-sync/README.md) for `exp:generate`, `exp:linkedin`, `exp:resume`, and more

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

See [`docs/testing.md`](docs/testing.md) for details on unit, E2E, Lighthouse, and CI testing.

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

## Documentation

| Topic                  | Guide                                                  |
| ---------------------- | ------------------------------------------------------ |
| Testing                | [docs/testing.md](docs/testing.md)                     |
| VS Code / Cursor       | [docs/vscode.md](docs/vscode.md)                       |
| Deployment             | [docs/deployment.md](docs/deployment.md)               |
| Releases               | [docs/releases.md](docs/releases.md)                   |
| Tooling configs        | [config/README.md](config/README.md)                   |
| Experience sync        | [experience-sync/README.md](experience-sync/README.md) |
| Agent / AI conventions | [AGENTS.md](AGENTS.md)                                 |

<!-- PROJECT MAINTENANCE -->

## Project Maintenance

### Security

For information about reporting security vulnerabilities, see [`SECURITY.md`](SECURITY.md).

### Changelog

All notable changes are automatically documented in [`CHANGELOG.md`](CHANGELOG.md) by semantic-release. The changelog is generated from conventional commit messages and should not be manually edited. See [docs/releases.md](docs/releases.md) for more information.

<!-- LICENSE -->

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

[product-screenshot]: src/assets/website_screenshot.png
