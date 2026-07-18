// Work experience types
import { BulletPoint } from "./content.types"

export interface ExperienceRole {
  position: string
  duration: string
  bulletPoints: BulletPoint[]
}

export interface Experience {
  company_name: string
  location: string
  roles: ExperienceRole[]
  technologies: string[]
  logo: string
  color: string
}

export type ExperienceMap = Map<string, Experience>
