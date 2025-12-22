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
  <li><a href="#deployment">Deployment</a></li>
  <li><a href="#license">License</a></li>
</ol>

<!-- ABOUT THE PROJECT -->

## About The Project

![product-screenshot]

### Built With

[![My Skills](https://skillicons.dev/icons?i=react,vite,js,html,css,figma,cloudflare)](https://skillicons.dev)

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- Node.js version 18 or higher
- Yarn package manager

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
4. Open your web browser to `localhost:5173`

## Usage

1. View the site live at https://nickhs.dev/

<!-- DEPLOYMENT -->

## Deployment

This project automatically deploys to Cloudflare Pages.

### Automatic Deployment

Cloudflare Pages automatically deploys your site whenever you push to the repository:

1. Make your changes and commit them:
   ```sh
   git add .
   git commit -m "Your commit message"
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
- **Node version:** 18 or higher

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

- Run `yarn format` before committing to ensure code is properly formatted
- Cloudflare Pages deployments typically complete in 1-2 minutes
- Preview deployments are automatically created for pull requests
- Cloudflare provides automatic HTTPS, CDN, and DDoS protection

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

[product-screenshot]: src/assets/website_screenshot.png
