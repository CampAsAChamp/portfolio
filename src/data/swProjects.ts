import ChickFilAThumbnail from "assets/Projects/Software/Chick_Fil_A.webp"
import DiggermanVideoThumbnailMp4 from "assets/Projects/Software/Diggerman.mp4"
import DiggermanVideoThumbnail from "assets/Projects/Software/Diggerman.webm"
import DiggermanThumbnail from "assets/Projects/Software/Diggerman.webp"
import FaceSwappingVideoThumbnailMp4 from "assets/Projects/Software/Face_Morphing.mp4"
import FaceSwappingVideoThumbnail from "assets/Projects/Software/Face_Morphing.webm"
import FaceSwappingThumbnail from "assets/Projects/Software/Face_Morphing.webp"
import HomeServerThumbnail from "assets/Projects/Software/Home_Server.webp"
import ObjectDetectionThumbnail from "assets/Projects/Software/Object_Detection.webp"
import PortfolioThumbnail from "assets/Projects/Software/Portfolio_Thumbnail.webp"
import SpotifyPPThumbnail from "assets/Projects/Software/Spotify.webp"
import { SoftwareProject, SoftwareProjectMap } from "types/project.types"
import { createExternalLink } from "utils/contentUtils"

import * as technologies from "./technologies"

const projects: SoftwareProject[] = [
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
    link: "https://github.com/CampAsAChamp/los-angeles-sports-chick-fil-a-scraper",
    thumbnail: ChickFilAThumbnail,
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
    link: "https://github.com/CampAsAChamp/DiggerMan",
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
    link: "https://github.com/CampAsAChamp/SpotifyPP",
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
    link: "https://github.com/CampAsAChamp/ObjectDetection",
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
    link: "https://github.com/CampAsAChamp/FaceSwap",
    thumbnail: FaceSwappingThumbnail,
    videoThumbnail: FaceSwappingVideoThumbnail,
    videoThumbnailMp4: FaceSwappingVideoThumbnailMp4,
    isVideo: true,
  },
  {
    name: "Portfolio Website",
    technologies: [technologies.REACT, technologies.JAVASCRIPT, technologies.HTML5, technologies.CSS3, technologies.FIGMA],
    bulletPoints: [
      [
        "Static React, Javascript, HTML and CSS website built to showcase my design skills along with experience and projects I've had over the years.",
      ],
      ["Created mockup design with Figma."],
    ],
    link: "https://nickhs.dev",
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
    link: "https://github.com/CampAsAChamp/home-server",
    thumbnail: HomeServerThumbnail,
  },
]

const projectMap: SoftwareProjectMap = new Map()

projects.forEach((item) => {
  projectMap.set(item.name, item)
})

export { projects, projectMap }
