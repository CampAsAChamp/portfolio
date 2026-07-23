import AMSLawThumbnail from "assets/Projects/Software/AMS_Law.webp"
import ChickFilAThumbnail from "assets/Projects/Software/Chick_Fil_A.webp"
import DiggermanVideoThumbnailMp4 from "assets/Projects/Software/Diggerman.mp4"
import DiggermanVideoThumbnail from "assets/Projects/Software/Diggerman.webm"
import DiggermanThumbnail from "assets/Projects/Software/Diggerman.webp"
import FaceSwappingVideoThumbnailMp4 from "assets/Projects/Software/Face_Morphing.mp4"
import FaceSwappingVideoThumbnail from "assets/Projects/Software/Face_Morphing.webm"
import FaceSwappingThumbnail from "assets/Projects/Software/Face_Morphing.webp"
import HomeServerThumbnail from "assets/Projects/Software/Home_Server.webp"
import ObjectDetectionThumbnail from "assets/Projects/Software/Object_Detection.webp"
import PlextraktboxThumbnail from "assets/Projects/Software/Plextraktbox.webp"
import PortfolioThumbnail from "assets/Projects/Software/Portfolio_Thumbnail.webp"
import SpotifyPPThumbnail from "assets/Projects/Software/Spotify.webp"
import SprintPlannerThumbnail from "assets/Projects/Software/Sprint_Planner.webp"
import { SoftwareProject, SoftwareProjectMap } from "types/project.types"
import { createExternalLink } from "utils/contentUtils"

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
      technologies.CLOUDFLARE,
    ],
    bulletPoints: [
      [
        "Professional law firm website specializing in estate planning, built with Next.js 15 and React 19, deployed on Cloudflare Workers.",
      ],
      [
        "Features responsive design with dark mode support, contact form with email integration using ",
        createExternalLink("Resend", "https://resend.com/"),
        ", Yelp reviews integration, and interactive maps.",
      ],
      ["Includes comprehensive FAQ section, attorney profile, services overview, and SEO optimization with structured data."],
      ["Automated testing with Vitest and Playwright, CI/CD pipeline with GitHub Actions, and semantic versioning for releases."],
    ],
    githubLink: "https://github.com/CampAsAChamp/amslaw",
    siteLink: "https://annamschneiderlaw.com",
    thumbnail: AMSLawThumbnail,
  },
  {
    name: "Sprint Planner",
    technologies: [technologies.NEXTJS, technologies.REACT, technologies.TYPESCRIPT, technologies.TAILWIND, technologies.GITHUB_ACTIONS],
    bulletPoints: [
      [
        "Next.js PWA for real-time sprint capacity planning: ",
        "(team members × sprint days) − PTO days − on-call days − rollover points",
        ".",
      ],
      [
        "Tracks PTO and activities, on-call time, and unfinished work from prior sprints; save, load, duplicate, rename, and delete configurations in local storage.",
      ],
      ["Static export deployed to GitHub Pages with installable PWA support, dark mode, and toast feedback."],
    ],
    githubLink: "https://github.com/CampAsAChamp/sprint-planner",
    siteLink: "https://campasachamp.github.io/sprint-planner/",
    thumbnail: SprintPlannerThumbnail,
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
      [
        "Self-hosted all-in-one sync for ",
        createExternalLink("Plex", "https://www.plex.tv/"),
        ", ",
        createExternalLink("Letterboxd", "https://letterboxd.com/"),
        ", and ",
        createExternalLink("Trakt", "https://trakt.tv/"),
        " — web UI, built-in scheduler, live log streaming, and notifications in one Docker image.",
      ],
      [
        "Per-data-type source of truth: watchlist from Plex, ratings from Letterboxd (read-only), watched history from Trakt; FastAPI + React/Vite SPA with SQLite persistence and Mantine UI.",
      ],
      [
        "Targets ",
        createExternalLink("TrueNAS SCALE", "https://www.truenas.com/truenas-scale/"),
        " for home-lab installs; App Catalog publication planned so others can install easily.",
      ],
    ],
    githubLink: "https://github.com/CampAsAChamp/plextraktbox",
    thumbnail: PlextraktboxThumbnail,
  },
  {
    name: "Los Angeles Sports Chick Fil A Scraper",
    technologies: [technologies.PYTHON, technologies.GITHUB_ACTIONS],
    bulletPoints: [
      [
        "Python scraper (Beautiful Soup + requests) that pulls prior day match results from ",
        createExternalLink("Baseball-Reference", "https://www.baseball-reference.com/"),
        ", ",
        createExternalLink("Hockey-Reference", "https://www.hockey-reference.com/"),
        ", and ",
        createExternalLink("FBref", "https://fbref.com/"),
        " for Angels, Ducks, and LAFC, then checks Chick-fil-A home-game promo thresholds: Angels 7+ runs, Ducks 5+ goals, or an LAFC win.",
      ],
      ["Season-aware scheduling: only evaluates each team while that sport is in season; runs daily at 8 AM PT via GitHub Actions cron."],
      [
        "Emails a Gmail SMTP reminder when criteria are met; includes local HTML sample pages so the parsers can be tested without hitting live sites.",
      ],
    ],
    githubLink: "https://github.com/CampAsAChamp/los-angeles-sports-chick-fil-a-scraper",
    thumbnail: ChickFilAThumbnail,
  },
  {
    name: "Portfolio Website",
    technologies: [
      technologies.REACT,
      technologies.TYPESCRIPT,
      technologies.VITEST,
      technologies.PLAYWRIGHT,
      technologies.CLOUDFLARE,
      technologies.HTML5,
      technologies.CSS3,
      technologies.FIGMA,
    ],
    bulletPoints: [
      [
        "Personal portfolio SPA (React + TypeScript + Vite) at ",
        createExternalLink("nickhs.dev", "https://nickhs.dev"),
        ", with dark/light theme, scroll-driven sections, and Cloudflare Pages deploy.",
      ],
      [
        "Local experience-sync pipeline: YAML source of truth with a localhost editor that syncs experience copy into the site plus LinkedIn/resume exports.",
      ],
      [
        "Quality bar: Vitest unit tests, Playwright desktop/mobile E2E, Lighthouse CI, Husky/lint-staged hooks, and semantic-release for versioning and changelog.",
      ],
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
      [
        "Self-hosted Ubuntu lab: Docker Compose stacks behind Nginx Proxy Manager, with Cloudflare-facing hostnames and a Homer dashboard for service discovery.",
      ],
      [
        "Media pipeline: Plex + Sonarr/Radarr/Prowlarr/Jackett, qBittorrent routed through a Gluetun VPN, plus Immich for photos and File Browser for storage.",
      ],
      [
        "Ops extras: Portainer for container management, Scrutiny for drive health, Watchtower for image updates, MergerFS/SnapRAID-backed pool storage, plus optional Spotify analytics and Minecraft stacks.",
      ],
    ],
    githubLink: "https://github.com/CampAsAChamp/home-server",
    thumbnail: HomeServerThumbnail,
  },
  {
    name: "Diggerman",
    technologies: [technologies.CPP, technologies.OPEN_GL],
    bulletPoints: [
      [
        "Dig Dug–style 2D game in C++ with ",
        createExternalLink("OpenGL", "https://www.opengl.org/"),
        "/freeglut: dig through a dirt grid, avoid falling boulders, collect oil barrels to clear the level.",
      ],
      [
        'Protester AI with state machines (wander, chase, stunned, leave); pathfinding via BFS back to the exit; harder "hardcore" protesters that track the player more aggressively.',
      ],
      [
        "Player tools and pickups: water squirts, sonar reveal, gold bait to distract enemies, scoring, and irrKlang sound effects; built as a Visual Studio team project.",
      ],
    ],
    githubLink: "https://github.com/CampAsAChamp/DiggerMan",
    thumbnail: DiggermanThumbnail,
    videoThumbnail: DiggermanVideoThumbnail,
    videoThumbnailMp4: DiggermanVideoThumbnailMp4,
    isVideo: true,
  },
  {
    name: "Spotify++",
    technologies: [
      technologies.NODEJS,
      technologies.EXPRESS,
      technologies.ANGULAR,
      technologies.TYPESCRIPT,
      technologies.HTML5,
      technologies.CSS3,
    ],
    bulletPoints: [
      [
        "Created Spotify browser using the ",
        createExternalLink("Spotify Web API", "https://developer.spotify.com/documentation/web-api/"),
        " with custom front end interface built from the ground up using ",
        createExternalLink("Spicetify", "https://github.com/khanhas/spicetify-cli"),
        " to inject custom CSS and Javascript into the Spotify client.",
      ],
      [
        "Adds additional track information the user normally doesn't have access to such as dance-ability, energy, acousticness, instrumentalness, and liveness provided by the track endpoint.",
      ],
    ],
    githubLink: "https://github.com/CampAsAChamp/SpotifyPP",
    thumbnail: SpotifyPPThumbnail,
  },
  {
    name: "Object & Face Detection System",
    technologies: [technologies.PYTHON, technologies.NUMPY],
    bulletPoints: [
      ["From-scratch object detector in Python/NumPy: image gradients → HOG descriptors over 8×8 blocks with 9 orientation bins."],
      [
        "Learns a template as average positive HOG minus average negative HOG, then finds matches with sliding-window correlation and non-maxima suppression.",
      ],
      ["Validated on faces and a second category (traffic signs), including scenes with multiple detections."],
    ],
    githubLink: "https://github.com/CampAsAChamp/ObjectDetection",
    thumbnail: ObjectDetectionThumbnail,
  },
  {
    name: "Face Swapping",
    technologies: [technologies.PYTHON, technologies.NUMPY],
    bulletPoints: [
      [
        "Piecewise affine face warping in Python/NumPy: estimate per-triangle affine transforms from annotated keypoints, then backward-warp with bilinear sampling.",
      ],
      ["Builds morph sequences by interpolating correspondences between two faces and cross-dissolving warped frames into a video."],
      [
        "Face swap composites a warped face onto another image using a triangle-region mask with Gaussian-feathered alpha blending to reduce seams.",
      ],
    ],
    githubLink: "https://github.com/CampAsAChamp/FaceSwap",
    thumbnail: FaceSwappingThumbnail,
    videoThumbnail: FaceSwappingVideoThumbnail,
    videoThumbnailMp4: FaceSwappingVideoThumbnailMp4,
    isVideo: true,
  },
]

const projectMap: SoftwareProjectMap = new Map()

projects.forEach((item) => {
  projectMap.set(item.name, item)
})

export { projects, projectMap }
