import { act, renderHook } from "@testing-library/react"
import { useTheme } from "hooks/useTheme"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { TEST_PROPS } from "../helpers/constants"
import { createMouseEvent, mockMatchMedia, mockStartViewTransition } from "../helpers/mocks"

describe("useTheme", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute("color-mode")
    vi.clearAllMocks()
  })

  it("should initialize with light theme by default", () => {
    mockMatchMedia(false)

    const { result } = renderHook(() => useTheme())

    expect(result.current.isDarkMode).toBe(false)
    expect(document.documentElement.getAttribute("color-mode")).toBe("light")
  })

  it("should initialize with dark theme from system preference", () => {
    mockMatchMedia(true)

    const { result } = renderHook(() => useTheme())

    expect(result.current.isDarkMode).toBe(true)
    expect(document.documentElement.getAttribute("color-mode")).toBe("dark")
  })

  it("should initialize with theme from localStorage", () => {
    localStorage.setItem("color-mode", "dark")

    const { result } = renderHook(() => useTheme())

    expect(result.current.isDarkMode).toBe(true)
    expect(document.documentElement.getAttribute("color-mode")).toBe("dark")
  })

  it("should toggle theme from light to dark without View Transitions API", () => {
    // Mock no View Transitions API support
    document.startViewTransition = undefined
    mockMatchMedia(false)

    const { result } = renderHook(() => useTheme())

    // Start in light mode
    expect(result.current.isDarkMode).toBe(false)

    // Toggle to dark
    act(() => {
      result.current.toggleTheme(createMouseEvent(TEST_PROPS.MOCK_CLICK_X, TEST_PROPS.MOCK_CLICK_Y))
    })

    expect(result.current.isDarkMode).toBe(true)
    expect(document.documentElement.getAttribute("color-mode")).toBe("dark")
    expect(localStorage.getItem("color-mode")).toBe("dark")
  })

  it("should toggle theme from dark to light without View Transitions API", () => {
    localStorage.setItem("color-mode", "dark")
    document.startViewTransition = undefined

    const { result } = renderHook(() => useTheme())

    // Start in dark mode
    expect(result.current.isDarkMode).toBe(true)

    // Toggle to light
    act(() => {
      result.current.toggleTheme(createMouseEvent(TEST_PROPS.MOCK_CLICK_X, TEST_PROPS.MOCK_CLICK_Y))
    })

    expect(result.current.isDarkMode).toBe(false)
    expect(document.documentElement.getAttribute("color-mode")).toBe("light")
    expect(localStorage.getItem("color-mode")).toBe("light")
  })

  it("should toggle theme with View Transitions API", () => {
    const mockTransition = mockStartViewTransition()
    mockMatchMedia(false)

    const { result } = renderHook(() => useTheme())

    // Toggle theme
    act(() => {
      result.current.toggleTheme(createMouseEvent(100, 200))
    })

    expect(mockTransition).toHaveBeenCalled()
    expect(result.current.isDarkMode).toBe(true)
    expect(document.documentElement.style.getPropertyValue("--x")).toBe("100px")
    expect(document.documentElement.style.getPropertyValue("--y")).toBe("200px")
    expect(document.documentElement.style.getPropertyValue("--r")).toBeTruthy()
  })

  it("should set CSS custom properties for animation", () => {
    mockStartViewTransition()

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme(createMouseEvent(50, 75))
    })

    expect(document.documentElement.style.getPropertyValue("--x")).toBe("50px")
    expect(document.documentElement.style.getPropertyValue("--y")).toBe("75px")
  })

  it("should set correct animation name matching the CSS keyframe", () => {
    mockStartViewTransition()

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme(createMouseEvent(TEST_PROPS.MOCK_CLICK_X, TEST_PROPS.MOCK_CLICK_Y))
    })

    // Verify the animation name matches the CSS keyframe name (reveal-theme)
    // This prevents regressions where the JS uses 'revealTheme' but CSS has 'reveal-theme'
    expect(document.documentElement.style.getPropertyValue("--theme-transition-animation")).toBe("reveal-theme")
  })

  it("should persist theme across multiple toggles", () => {
    document.startViewTransition = undefined
    mockMatchMedia(false)

    const { result } = renderHook(() => useTheme())

    const event = createMouseEvent(0, 0)

    // Toggle multiple times
    act(() => {
      result.current.toggleTheme(event)
    })
    expect(result.current.isDarkMode).toBe(true)

    act(() => {
      result.current.toggleTheme(event)
    })
    expect(result.current.isDarkMode).toBe(false)

    act(() => {
      result.current.toggleTheme(event)
    })
    expect(result.current.isDarkMode).toBe(true)

    expect(localStorage.getItem("color-mode")).toBe("dark")
  })
})
