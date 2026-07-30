import AMSLawThumbnail from "assets/Projects/Software/AMS_Law.webp"
import ChickFilAThumbnail from "assets/Projects/Software/Chick_Fil_A.webp"
import DiagonalBlendThumbnail from "assets/Projects/Software/DiagonalBlend.webp"
import HomeServerThumbnail from "assets/Projects/Software/Home_Server.webp"
import JiraQuickFiltersThumbnail from "assets/Projects/Software/Jira_Quick_Filters.webp"
import PlextraktboxThumbnail from "assets/Projects/Software/Plextraktbox.webp"
import PortfolioThumbnail from "assets/Projects/Software/Portfolio_Thumbnail.webp"
import ReadmeScreenshotThumbnail from "assets/Projects/Software/Readme_Screenshot.webp"
import SDGERateCheckerThumbnail from "assets/Projects/Software/SDGE_Rate_Checker.webp"
import SprintPlannerThumbnail from "assets/Projects/Software/Sprint_Planner.webp"
import TrueNASConfigBackupThumbnail from "assets/Projects/Software/TrueNAS_Config_Backup.webp"
import { SoftwareProject, SoftwareProjectMap } from "types/project.types"

import * as technologies from "./technologies"

const projects: SoftwareProject[] = [
  {
    name: "Anna M. Schneider Law",
    technologies: [
      technologies.NEXTJS,
      technologies.REACT,
      technologies.TYPESCRIPT,
      technologies.TAILWIND,
      technologies.FRAMER_MOTION,
      technologies.VITEST,
      technologies.PLAYWRIGHT,
      technologies.ESLINT,
      technologies.GITHUB_ACTIONS,
      technologies.CLOUDFLARE,
    ],
    bulletPoints: [
      "Professional law firm website specializing in estate planning, built with Next.js 15 and React 19, deployed on Cloudflare Workers.",
      "Features responsive design with dark mode support, contact form with email integration using [Resend](https://resend.com/), Yelp reviews integration, and interactive maps.",
      "Includes comprehensive FAQ section, attorney profile, services overview, and SEO optimization with structured data.",
      "Automated testing with Vitest and Playwright, CI/CD pipeline with GitHub Actions, and semantic versioning for releases.",
    ],
    githubLink: "https://github.com/CampAsAChamp/amslaw",
    siteLink: "https://annamschneiderlaw.com",
    thumbnail: AMSLawThumbnail,
  },
  {
    name: "plextraktbox",
    technologies: [
      technologies.PYTHON,
      technologies.FASTAPI,
      technologies.REACT,
      technologies.TYPESCRIPT,
      technologies.VITE,
      technologies.MANTINE,
      technologies.SQLITE,
      technologies.DOCKER,
      technologies.LINUX,
    ],
    bulletPoints: [
      "Self-hosted all-in-one sync for [Plex](https://www.plex.tv/), [Letterboxd](https://letterboxd.com/), and [Trakt](https://trakt.tv/) — web UI, built-in scheduler, live log streaming, and notifications in one Docker image.",
      "Per-data-type source of truth: watchlist from Plex, ratings from Letterboxd (read-only), watched history from Trakt; FastAPI + React/Vite SPA with SQLite persistence and Mantine UI.",
      "Targets [TrueNAS SCALE](https://www.truenas.com/truenas-scale/) for home-lab installs; App Catalog publication planned so others can install easily.",
    ],
    githubLink: "https://github.com/CampAsAChamp/plextraktbox",
    thumbnail: PlextraktboxThumbnail,
  },
  {
    name: "TrueNAS Config Backup",
    technologies: [technologies.PYTHON, technologies.FASTAPI, technologies.DOCKER, technologies.LINUX],
    bulletPoints: [
      "Scheduled [TrueNAS SCALE](https://www.truenas.com/truenas-scale/) config backups via the WebSocket API (`config.save` + `core.download`), with API-key auth, retention pruning, and run-history logging.",
      "Web dashboard to view, download, and delete backups; optional cron schedule (APScheduler) plus on-demand run now.",
      "Packaged as a Custom App (native Docker) for TrueNAS SCALE 24.10+ with health checks and jsonl run history.",
    ],
    githubLink: "https://github.com/CampAsAChamp/truenas-config-backup",
    thumbnail: TrueNASConfigBackupThumbnail,
    thumbnailObjectPosition: "top left",
  },
  {
    name: "readme-screenshot",
    technologies: [technologies.TYPESCRIPT, technologies.NODEJS, technologies.PLAYWRIGHT, technologies.GITHUB_ACTIONS, technologies.VITEST],
    bulletPoints: [
      "Config-driven [Playwright](https://playwright.dev/) screenshot automation for static sites and web apps — define capture, theme, and server setup in `.readme-screenshot.yml`.",
      "Optional light/dark blend step via DiagonalBlend for README hero images; validate, capture, and commit-message CLI commands.",
      "Reusable GitHub Actions workflow auto-captures screenshots and commits updated assets on a schedule or after deploys.",
    ],
    githubLink: "https://github.com/CampAsAChamp/readme-screenshot",
    thumbnail: ReadmeScreenshotThumbnail,
  },
  {
    name: "DiagonalBlend",
    technologies: [technologies.PYTHON, technologies.FASTAPI, technologies.HTML5, technologies.CSS3],
    bulletPoints: [
      "Blends two same-scene images along a diagonal line with a soft gradient — built for comparing light and dark mode screenshots in README hero images.",
      "CLI (`diag_blend`), Python API (`blend_images`), and drag-and-drop web UI with live preview and PNG download.",
      "Configurable blend angle, width, and flip sides; FastAPI backend serves the web UI and `/api/blend` endpoint.",
    ],
    githubLink: "https://github.com/CampAsAChamp/DiagonalBlend",
    thumbnail: DiagonalBlendThumbnail,
  },
  {
    name: "Jira Single Click Filters",
    technologies: [technologies.JAVASCRIPT, technologies.HTML5, technologies.CSS3, technologies.CHROME],
    bulletPoints: [
      "Chrome extension (Manifest V3) that makes Jira quick filters mutually exclusive — clicking one filter auto-deselects all others.",
      "Toggle on/off via the extension popup; settings persist across browser sessions via Chrome Storage API.",
      "Works on [Atlassian Cloud](https://www.atlassian.com/software/jira) and common self-hosted Jira URL patterns (Backlog and Active Sprint views).",
    ],
    githubLink: "https://github.com/CampAsAChamp/jira-single-click-filters",
    thumbnail: JiraQuickFiltersThumbnail,
  },
  {
    name: "Sprint Planner",
    technologies: [
      technologies.NEXTJS,
      technologies.REACT,
      technologies.TYPESCRIPT,
      technologies.TAILWIND,
      technologies.GITHUB_ACTIONS,
      technologies.GITHUB,
    ],
    bulletPoints: [
      "Next.js PWA for real-time sprint capacity planning: (team members x sprint days) - PTO days - on-call days - rollover points.",
      "Tracks PTO and activities, on-call time, and unfinished work from prior sprints; save, load, duplicate, rename, and delete configurations in local storage.",
      "Static export deployed to GitHub Pages with installable PWA support, dark mode, and toast feedback.",
    ],
    githubLink: "https://github.com/CampAsAChamp/sprint-planner",
    siteLink: "https://campasachamp.github.io/sprint-planner/",
    thumbnail: SprintPlannerThumbnail,
  },
  {
    name: "Los Angeles Sports Chick Fil A Scraper",
    technologies: [technologies.PYTHON, technologies.BEAUTIFUL_SOUP, technologies.GITHUB_ACTIONS],
    bulletPoints: [
      "Python scraper (Beautiful Soup + requests) that pulls prior day match results from [Baseball-Reference](https://www.baseball-reference.com/), [Hockey-Reference](https://www.hockey-reference.com/), and [FBref](https://fbref.com/) for Angels, Ducks, and LAFC, then checks Chick-fil-A home-game promo thresholds: Angels 7+ runs, Ducks 5+ goals, or an LAFC win.",
      "Season-aware scheduling: only evaluates each team while that sport is in season; runs daily at 8 AM PT via GitHub Actions cron.",
      "Emails a Gmail SMTP reminder when criteria are met; includes local HTML sample pages so the parsers can be tested without hitting live sites.",
    ],
    githubLink: "https://github.com/CampAsAChamp/los-angeles-sports-chick-fil-a-scraper",
    thumbnail: ChickFilAThumbnail,
  },
  {
    name: "Portfolio Website",
    technologies: [
      technologies.REACT,
      technologies.TYPESCRIPT,
      technologies.VITE,
      technologies.VITEST,
      technologies.PLAYWRIGHT,
      technologies.GITHUB_ACTIONS,
      technologies.ESLINT,
      technologies.CLOUDFLARE,
      technologies.HTML5,
      technologies.CSS3,
      technologies.FIGMA,
    ],
    bulletPoints: [
      "Personal portfolio SPA (React + TypeScript + Vite) at [nickhs.dev](https://nickhs.dev), with dark/light theme, scroll-driven sections, and Cloudflare Pages deploy.",
      "Experience-sync tooling: YAML source of truth with a localhost editor (`yarn exp:ui`) that generates portfolio experience data and LinkedIn/resume exports — one place to edit job-history copy across channels.",
      "Quality bar: Vitest unit tests, Playwright desktop/mobile E2E, Lighthouse CI, Husky/lint-staged hooks, and semantic-release for versioning and changelog.",
    ],
    githubLink: "https://github.com/CampAsAChamp/portfolio",
    siteLink: "https://nickhs.dev",
    thumbnail: PortfolioThumbnail,
  },
  {
    name: "Home Server",
    technologies: [
      technologies.UBUNTU,
      technologies.LINUX,
      technologies.DOCKER,
      technologies.NGINX,
      technologies.MONGODB,
      technologies.POSTGRES,
      technologies.REDIS,
      technologies.CLOUDFLARE,
    ],
    bulletPoints: [
      "Self-hosted Ubuntu lab: Docker Compose stacks behind Nginx Proxy Manager, with Cloudflare-facing hostnames and a Homer dashboard for service discovery.",
      "Media pipeline: Plex + Sonarr/Radarr/Prowlarr/Jackett, qBittorrent routed through a Gluetun VPN, plus Immich for photos and File Browser for storage.",
      "Ops extras: Portainer for container management, Scrutiny for drive health, Watchtower for image updates, MergerFS/SnapRAID-backed pool storage, plus optional Spotify analytics and Minecraft stacks.",
    ],
    githubLink: "https://github.com/CampAsAChamp/home-server",
    thumbnail: HomeServerThumbnail,
  },
  {
    name: "SDGE Rate Checker",
    technologies: [technologies.JAVASCRIPT, technologies.HTML5, technologies.CSS3, technologies.GITHUB],
    bulletPoints: [
      "Real-time [SDGE](https://www.sdge.com/) Time of Use period tracker — shows current rate level, time range, and when the next period change occurs.",
      "Automatic weekday/weekend and seasonal schedule detection (summer vs. winter TOU windows).",
      "Static single-page app with live updates every second; deployed to GitHub Pages with no backend required.",
    ],
    githubLink: "https://github.com/CampAsAChamp/sdge-rate-checker",
    siteLink: "https://campasachamp.github.io/sdge-rate-checker/",
    thumbnail: SDGERateCheckerThumbnail,
  },
]

const projectMap: SoftwareProjectMap = new Map()

projects.forEach((item) => {
  projectMap.set(item.name, item)
})

export { projects, projectMap }
