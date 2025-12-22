<div id="top"></div>

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
<details>
  <summary>Table of Contents</summary>
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
    <li><a href="#deployment-to-github-pages">Deployment to GitHub Pages</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

![product-screenshot]

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

[![My Skills](https://skillicons.dev/icons?i=react,js,html,css,figma,netlify,cloudflare)](https://skillicons.dev)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/CampAsAChamp/portfolio.git
   ```
2. Navigate into the repo and install dependencies
   ```sh
   yarn install
   ```
   Or simply:
   ```sh
   yarn
   ```
3. Start the development server
   ```sh
   yarn start
   ```
4. Open your web browser (if not automatically done for you) to `localhost:3000`

<p align="right">(<a href="#top">back to top</a>)</p>


## Usage

1. View the site live at https://nickhs.dev/

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- DEPLOYMENT -->

## Deployment to GitHub Pages

This project is configured to deploy to GitHub Pages using the `gh-pages` package.

### Prerequisites

1. Ensure your GitHub repository has GitHub Pages enabled
   - Go to your repository Settings → Pages
   - Source should be set to "Deploy from a branch"
   - Branch should be set to `gh-pages` (will be created automatically on first deploy)

### Deploying

1. Make sure all changes are committed and pushed to your repository

2. Run the deploy command:
   ```sh
   yarn deploy
   ```
   This will:
   - Automatically run `yarn build` to create an optimized production build
   - Deploy the `build` folder to the `gh-pages` branch
   - Push changes to GitHub

3. Your site will be available at your GitHub Pages URL (e.g., `https://username.github.io/portfolio`)
   - Custom domains can be configured in repository Settings → Pages

### Manual Build

To create a production build without deploying:
```sh
yarn build
```

This creates an optimized build in the `build` folder.

### Notes

- The `predeploy` script automatically runs `yarn build` before deploying
- The `prebuild` script ensures dependencies are installed
- Run `yarn format` before committing to ensure code is properly formatted

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

[product-screenshot]: src/assets/website_screenshot.png
