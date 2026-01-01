// Work experience types
import { BulletPoint } from "./content.types"

export interface Experience {
  company_name: string
  location: string
  position: string
  duration: string
  bulletPoints: BulletPoint[]
  technologies: string[]
  logo: string
  color: string
}

export type ExperienceMap = Map<string, Experience>
