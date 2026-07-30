import {
  bootstrapScrollRestore,
  markScrollRestoreComplete,
  markScrollRestorePending,
  preloadBelowFoldSections,
  readSavedScrollY,
  SCROLL_RESTORING_ATTR,
  SCROLL_STORAGE_KEY,
  writeSavedScrollY,
} from "utils/scrollRestoration"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

describe("scrollRestoration utils", () => {
  beforeEach(() => {
    sessionStorage.clear()
    document.documentElement.removeAttribute(SCROLL_RESTORING_ATTR)
  })

  afterEach(() => {
    sessionStorage.clear()
    document.documentElement.removeAttribute(SCROLL_RESTORING_ATTR)
  })

  it("reads and writes saved scroll positions", () => {
    writeSavedScrollY(1800)
    expect(sessionStorage.getItem(SCROLL_STORAGE_KEY)).toBe("1800")
    expect(readSavedScrollY()).toBe(1800)
  })

  it("treats zero as no saved scroll position", () => {
    writeSavedScrollY(0)
    expect(sessionStorage.getItem(SCROLL_STORAGE_KEY)).toBeNull()
    expect(readSavedScrollY()).toBeNull()
  })

  it("marks and clears the restore-pending attribute", () => {
    markScrollRestorePending()
    expect(document.documentElement.getAttribute(SCROLL_RESTORING_ATTR)).toBe("true")

    markScrollRestoreComplete()
    expect(document.documentElement.hasAttribute(SCROLL_RESTORING_ATTR)).toBe(false)
  })

  it("bootstraps restore by hiding the app and preloading below-fold sections", async () => {
    sessionStorage.setItem(SCROLL_STORAGE_KEY, "2400")

    expect(bootstrapScrollRestore()).toBe(true)
    expect(document.documentElement.getAttribute(SCROLL_RESTORING_ATTR)).toBe("true")

    const modules = await preloadBelowFoldSections()
    expect(typeof modules.Experience).toBe("function")
    expect(typeof modules.SkillsAndTechnologies).toBe("function")
    expect(typeof modules.SWProjects).toBe("function")
    expect(typeof modules.ArtProjects).toBe("function")
  })

  it("does not bootstrap when there is no saved scroll position", () => {
    expect(bootstrapScrollRestore()).toBe(false)
    expect(document.documentElement.hasAttribute(SCROLL_RESTORING_ATTR)).toBe(false)
  })
})
