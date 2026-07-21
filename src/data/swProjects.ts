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
        "Professional law firm website specializing in estate planning, built with ",
        createExternalLink("Next.js 15", "https://nextjs.org/"),
        " and React 19, deployed on ",
        createExternalLink("Cloudflare Workers", "https://www.cloudflare.com/"),
        ".",
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
      [
        "Static export deployed to ",
        createExternalLink("GitHub Pages", "https://campasachamp.github.io/sprint-planner/"),
        " with installable PWA support, dark mode, and toast feedback.",
      ],
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
        "Cron job that checks all of the Los Angeles sports teams scores each morning using Python and GitHub actions (for running the cron job automatically) to see if any of them qualify for free Chick Fil A sandwiches and sends me an email as a reminder to check my app to claim the coupon",
      ],
      ["Free Chick Fil A is available if one of the following criteria for the sports teams are met"],
      ["Los Angeles Angels score 7 or more runs at home"],
      ["Anaheim Ducks score 5 or more goals at home"],
      ["LAFC wins at home"],
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
        "Static React + TypeScript portfolio built with Vite, deployed on Cloudflare Pages, showcasing design skills along with experience and projects I've had over the years.",
      ],
      ["Covered with Vitest unit tests and Playwright end-to-end tests; mockup design created in Figma."],
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
    bulletPoints: [["My Home Server for file storage, photo, movie, tv management & serving, with many other bells and whistles."]],
    githubLink: "https://github.com/CampAsAChamp/home-server",
    thumbnail: HomeServerThumbnail,
  },
  {
    name: "Diggerman",
    technologies: [technologies.CPP, technologies.OPEN_GL],
    bulletPoints: [
      [
        "Designed and implemented a large 2D Dig Dug-like game in C++ driven by ",
        createExternalLink("OpenGL", "https://www.opengl.org/"),
        ", utilizing A.I. enemies and sprites with light animations.",
      ],
      ["Coordinated with team members to realize the groups design goals."],
      [
        "Added logic for digging through the game board, as well as falling boulders to be an obstacle and kill the player if the player wasn't moving.",
      ],
      ["Implemented gold nuggets, score system and hidden oil barrels power ups."],
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
      ["Python program that uses gradient features of an image for edge detection."],
      ["Uses sliding window classification for detecting objects based on a template generated from test images."],
      ["Can detect any object including faces given test data."],
    ],
    githubLink: "https://github.com/CampAsAChamp/ObjectDetection",
    thumbnail: ObjectDetectionThumbnail,
  },
  {
    name: "Face Swapping",
    technologies: [technologies.PYTHON, technologies.NUMPY],
    bulletPoints: [
      ["Piecewise affine warping, computes an affine transformation for triangles placed along the face."],
      [
        "Morphs a face into another one or can swap parts of a face(eyes, mouth, nose) to another face while still maintaining the facial structure.",
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
