import { supportsViewTransitions } from "utils/viewTransitionsUtils"
import { afterEach, describe, expect, it } from "vitest"

describe("viewTransitionsUtils", () => {
  afterEach(() => {
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      writable: true,
      value: undefined,
    })
  })

  it("returns false when View Transitions API is unavailable", () => {
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      writable: true,
      value: undefined,
    })
    expect(supportsViewTransitions()).toBe(false)
  })

  it("returns true when document.startViewTransition is a function", () => {
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      writable: true,
      value: (): unknown => ({}),
    })
    expect(supportsViewTransitions()).toBe(true)
  })
})
