export const SCROLL_STORAGE_KEY = "portfolio-scroll-y"
export const SCROLL_RESTORING_ATTR = "data-scroll-restoring"

export function readSavedScrollY(): number | null {
  try {
    const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY)
    if (raw === null) return null
    const y = Number(raw)
    // Top-of-page is the default — never treat 0 as a restore target (StrictMode remount
    // used to persist "0" then re-enter an 8s restore loop that fought programmatic scroll).
    return Number.isFinite(y) && y > 0 ? y : null
  } catch {
    return null
  }
}

export function writeSavedScrollY(y: number): void {
  try {
    if (y > 0) {
      sessionStorage.setItem(SCROLL_STORAGE_KEY, String(y))
    } else {
      sessionStorage.removeItem(SCROLL_STORAGE_KEY)
    }
  } catch {
    // Ignore quota / private-mode failures
  }
}

export function markScrollRestorePending(): void {
  document.documentElement.setAttribute(SCROLL_RESTORING_ATTR, "true")
}

export function markScrollRestoreComplete(): void {
  document.documentElement.removeAttribute(SCROLL_RESTORING_ATTR)
}

export interface BelowFoldSectionModules {
  Experience: typeof import("components/Experience/Experience").Experience
  SkillsAndTechnologies: typeof import("components/SkillsAndTech/SkillsAndTechnologies").SkillsAndTechnologies
  SWProjects: typeof import("components/SwProjects/SwProjects").SWProjects
  ArtProjects: typeof import("components/ArtProjects/ArtProjects").ArtProjects
}

let belowFoldPreloadPromise: Promise<BelowFoldSectionModules> | null = null

export function preloadBelowFoldSections(): Promise<BelowFoldSectionModules> {
  if (!belowFoldPreloadPromise) {
    belowFoldPreloadPromise = Promise.all([
      import("components/Experience/Experience"),
      import("components/SkillsAndTech/SkillsAndTechnologies"),
      import("components/SwProjects/SwProjects"),
      import("components/ArtProjects/ArtProjects"),
    ]).then(([experience, skills, swProjects, artProjects]) => ({
      Experience: experience.Experience,
      SkillsAndTechnologies: skills.SkillsAndTechnologies,
      SWProjects: swProjects.SWProjects,
      ArtProjects: artProjects.ArtProjects,
    }))
  }

  return belowFoldPreloadPromise
}

/** Hide the app and start preloading below-fold sections when a refresh restore is pending. */
export function bootstrapScrollRestore(): boolean {
  const savedY = readSavedScrollY()
  if (savedY === null) return false

  markScrollRestorePending()
  void preloadBelowFoldSections()
  return true
}
