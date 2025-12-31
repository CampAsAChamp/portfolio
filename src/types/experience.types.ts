// Work experience types

export interface Experience {
  company_name: string
  location: string
  position: string
  duration: string
  textContent: string
  technologies: string[]
  logo: string
  color: string
}

export type ExperienceMap = Map<string, Experience>
