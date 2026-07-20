// Project types for software and art projects
import type { TechnologyName } from "data/technologies"

import { BulletPoint } from "./content.types"

export interface SoftwareProject {
  name: string
  technologies: TechnologyName[]
  bulletPoints: BulletPoint[]
  githubLink?: string
  siteLink?: string
  thumbnail: string
  videoThumbnail?: string
  videoThumbnailMp4?: string
  isVideo?: boolean
}

export type SoftwareProjectMap = Map<string, SoftwareProject>

export interface ArtProject {
  id: string
  name: string
  imageSrc: string
  altText: string
}
