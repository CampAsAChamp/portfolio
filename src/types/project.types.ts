// Project types for software and art projects

export interface SoftwareProject {
  name: string
  technologies: string[]
  textContent: string
  link: string
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
