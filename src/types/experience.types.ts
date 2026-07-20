// Work experience types
import type { TechnologyName } from "data/technologies"

import { BulletPoint } from "./content.types"

export type MonthAbbrev = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sept" | "Oct" | "Nov" | "Dec"

export interface RoleDate {
  month: MonthAbbrev
  year: number
}

export interface ExperienceRole {
  position: string
  /** Start month/year of the role. */
  start: RoleDate
  /** End month/year; omit for the current/ongoing role. */
  end?: RoleDate
  bulletPoints: BulletPoint[]
}

export interface Experience {
  companyName: string
  location: string
  roles: ExperienceRole[]
  technologies: TechnologyName[]
  logo: string
  color: string
}
