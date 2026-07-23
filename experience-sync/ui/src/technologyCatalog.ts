import Adobe_Illustrator_Icon from "assets/Dev_Icons/Adobe_Illustrator.svg"
import Adobe_Photoshop_Icon from "assets/Dev_Icons/Adobe_Photoshop.svg"
import Adobe_XD_Icon from "assets/Dev_Icons/Adobe_XD.svg"
import Angular_Icon from "assets/Dev_Icons/Angular.svg"
import AWS_Icon from "assets/Dev_Icons/AWS.svg"
import C_Icon from "assets/Dev_Icons/C.svg"
import Cloudflare_Icon from "assets/Dev_Icons/Cloudflare.svg"
import ColdFusion_Icon from "assets/Dev_Icons/ColdFusion.svg"
import CPP_Icon from "assets/Dev_Icons/CPP.svg"
import CSS3_Icon from "assets/Dev_Icons/CSS3.svg"
import Docker_Icon from "assets/Dev_Icons/Docker.svg"
import Eslint_Icon from "assets/Dev_Icons/Eslint.svg"
import Express_Icon from "assets/Dev_Icons/Express.svg"
import Figma_Icon from "assets/Dev_Icons/Figma.svg"
import FramerMotion_Icon from "assets/Dev_Icons/FramerMotion.svg"
import GCP_Icon from "assets/Dev_Icons/GCP.svg"
import Git_Icon from "assets/Dev_Icons/Git.svg"
import GitHub_Actions_Icon from "assets/Dev_Icons/GitHub_Actions.svg"
import GitHub_Icon from "assets/Dev_Icons/GitHub.svg"
import Go_Icon from "assets/Dev_Icons/Go.svg"
import GraphQL_Icon from "assets/Dev_Icons/GraphQL.svg"
import HTML5_Icon from "assets/Dev_Icons/HTML5.svg"
import Java_Icon from "assets/Dev_Icons/Java.svg"
import JavaScript_Icon from "assets/Dev_Icons/JavaScript.svg"
import Kubernetes_Icon from "assets/Dev_Icons/Kubernetes.svg"
import Linux_Icon from "assets/Dev_Icons/Linux.svg"
import MongoDB_Icon from "assets/Dev_Icons/MongoDB.svg"
import MySQL_Icon from "assets/Dev_Icons/MySQL.svg"
import NextJS_Icon from "assets/Dev_Icons/NextJS.svg"
import Nginx_Icon from "assets/Dev_Icons/Nginx.svg"
import NodeJS_Icon from "assets/Dev_Icons/NodeJS.svg"
import NumPy_Icon from "assets/Dev_Icons/NumPy.svg"
import OpenGL_Icon from "assets/Dev_Icons/OpenGL.svg"
import Playwright_Icon from "assets/Dev_Icons/Playwright.svg"
import Postgres_Icon from "assets/Dev_Icons/Postgres.svg"
import Python_Icon from "assets/Dev_Icons/Python.svg"
import React_Icon from "assets/Dev_Icons/React.svg"
import Redis_Icon from "assets/Dev_Icons/Redis.svg"
import Redux_Icon from "assets/Dev_Icons/Redux.svg"
import Spring_Icon from "assets/Dev_Icons/Spring.svg"
import Tailwind_Icon from "assets/Dev_Icons/Tailwind.svg"
import TypeScript_Icon from "assets/Dev_Icons/TypeScript.svg"
import Ubuntu_Icon from "assets/Dev_Icons/Ubuntu.svg"
import Vite_Test_Icon from "assets/Dev_Icons/Vite_Test.svg"

/** Catalog keyed by `data/technologies` export names used in experiences.yaml. */
export interface TechnologyOption {
  key: string
  label: string
  icon: string
}

export const TECHNOLOGY_OPTIONS: TechnologyOption[] = [
  { key: "ADOBE_ILLUSTRATOR", label: "Adobe Illustrator", icon: Adobe_Illustrator_Icon },
  { key: "ADOBE_PHOTOSHOP", label: "Adobe Photoshop", icon: Adobe_Photoshop_Icon },
  { key: "ADOBE_XD", label: "Adobe XD", icon: Adobe_XD_Icon },
  { key: "ANGULAR", label: "Angular", icon: Angular_Icon },
  { key: "AWS", label: "Amazon Web Services", icon: AWS_Icon },
  { key: "C", label: "C", icon: C_Icon },
  { key: "CLOUDFLARE", label: "Cloudflare", icon: Cloudflare_Icon },
  { key: "COLDFUSION", label: "ColdFusion", icon: ColdFusion_Icon },
  { key: "CPP", label: "C++", icon: CPP_Icon },
  { key: "CSS3", label: "CSS3", icon: CSS3_Icon },
  { key: "DOCKER", label: "Docker", icon: Docker_Icon },
  { key: "ESLINT", label: "ESLint", icon: Eslint_Icon },
  { key: "EXPRESS", label: "Express", icon: Express_Icon },
  { key: "FIGMA", label: "Figma", icon: Figma_Icon },
  { key: "FRAMER_MOTION", label: "Framer Motion", icon: FramerMotion_Icon },
  { key: "GCP", label: "Google Cloud Platform", icon: GCP_Icon },
  { key: "GIT", label: "Git", icon: Git_Icon },
  { key: "GITHUB", label: "GitHub", icon: GitHub_Icon },
  { key: "GITHUB_ACTIONS", label: "GitHub Actions", icon: GitHub_Actions_Icon },
  { key: "GO", label: "Go", icon: Go_Icon },
  { key: "GRAPHQL", label: "GraphQL", icon: GraphQL_Icon },
  { key: "HTML5", label: "HTML5", icon: HTML5_Icon },
  { key: "JAVA", label: "Java", icon: Java_Icon },
  { key: "JAVASCRIPT", label: "JavaScript", icon: JavaScript_Icon },
  { key: "KUBERNETES", label: "Kubernetes", icon: Kubernetes_Icon },
  { key: "LINUX", label: "Linux", icon: Linux_Icon },
  { key: "MONGODB", label: "MongoDB", icon: MongoDB_Icon },
  { key: "MYSQL", label: "MySQL", icon: MySQL_Icon },
  { key: "NEXTJS", label: "Next.js", icon: NextJS_Icon },
  { key: "NGINX", label: "Nginx", icon: Nginx_Icon },
  { key: "NODEJS", label: "NodeJS", icon: NodeJS_Icon },
  { key: "NUMPY", label: "NumPy", icon: NumPy_Icon },
  { key: "OPEN_GL", label: "OpenGL", icon: OpenGL_Icon },
  { key: "PLAYWRIGHT", label: "Playwright", icon: Playwright_Icon },
  { key: "POSTGRES", label: "Postgres", icon: Postgres_Icon },
  { key: "PYTHON", label: "Python", icon: Python_Icon },
  { key: "REACT", label: "React", icon: React_Icon },
  { key: "REDIS", label: "Redis", icon: Redis_Icon },
  { key: "REDUX", label: "Redux", icon: Redux_Icon },
  { key: "SPRING", label: "Spring", icon: Spring_Icon },
  { key: "TAILWIND", label: "Tailwind CSS", icon: Tailwind_Icon },
  { key: "TYPESCRIPT", label: "TypeScript", icon: TypeScript_Icon },
  { key: "UBUNTU", label: "Ubuntu", icon: Ubuntu_Icon },
  { key: "VITEST", label: "Vitest", icon: Vite_Test_Icon },
]

export const TECHNOLOGY_OPTIONS_BY_KEY = new Map(TECHNOLOGY_OPTIONS.map((opt) => [opt.key, opt]))

export const TECHNOLOGY_OPTIONS_ALPHA = [...TECHNOLOGY_OPTIONS].sort((a, b) =>
  a.label.localeCompare(b.label, undefined, { sensitivity: "base" }),
)
