import { act, renderHook } from "@testing-library/react"
import { useScrollPosition } from "hooks/useScrollPosition"
import { afterEach, describe, expect, it } from "vitest"

describe("useScrollPosition", () => {
  afterEach(() => {
    Object.defineProperty(window, "scrollX", { configurable: true, value: 0 })
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 })
  })

  it("returns the initial scroll position", () => {
    Object.defineProperty(window, "scrollX", { configurable: true, value: 12 })
    Object.defineProperty(window, "scrollY", { configurable: true, value: 34 })

    const { result } = renderHook(() => useScrollPosition())
    expect(result.current).toEqual({ x: 12, y: 34 })
  })

  it("updates when the window scrolls", () => {
    const { result } = renderHook(() => useScrollPosition())

    act(() => {
      Object.defineProperty(window, "scrollX", { configurable: true, value: 50 })
      Object.defineProperty(window, "scrollY", { configurable: true, value: 120 })
      window.dispatchEvent(new Event("scroll"))
    })

    expect(result.current).toEqual({ x: 50, y: 120 })
  })
})
