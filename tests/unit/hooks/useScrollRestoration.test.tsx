import { act, renderHook } from "@testing-library/react"
import { useScrollRestoration } from "hooks/useScrollRestoration"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const STORAGE_KEY = "portfolio-scroll-y"

describe("useScrollRestoration", () => {
  const originalHash = window.location.hash
  let scrollTo: ReturnType<typeof vi.fn>
  let scrollIntoView: ReturnType<typeof vi.fn<HTMLElement["scrollIntoView"]>>
  let observe: ReturnType<typeof vi.fn>
  let disconnect: ReturnType<typeof vi.fn>
  let mutationCallback: MutationCallback | undefined

  beforeEach(() => {
    scrollTo = vi.fn()
    scrollIntoView = vi.fn<HTMLElement["scrollIntoView"]>()
    observe = vi.fn()
    disconnect = vi.fn()
    mutationCallback = undefined
    sessionStorage.clear()

    vi.stubGlobal("scrollTo", scrollTo)
    vi.stubGlobal(
      "MutationObserver",
      class {
        constructor(callback: MutationCallback) {
          mutationCallback = callback
        }

        observe = observe

        disconnect = disconnect
      },
    )
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe = vi.fn()

        disconnect = vi.fn()

        unobserve = vi.fn()
      },
    )

    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 0 })
    Object.defineProperty(window.history, "scrollRestoration", {
      configurable: true,
      writable: true,
      value: "auto",
    })
    Object.defineProperty(document, "readyState", {
      configurable: true,
      get: () => "complete",
    })

    const root = document.createElement("div")
    root.id = "root"
    document.body.appendChild(root)
  })

  afterEach(() => {
    window.location.hash = originalHash
    document.body.innerHTML = ""
    document.documentElement.style.scrollBehavior = ""
    sessionStorage.clear()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it("restores a saved scroll position on mount", () => {
    sessionStorage.setItem(STORAGE_KEY, "1200")

    renderHook(() => useScrollRestoration())

    expect(window.history.scrollRestoration).toBe("manual")
    expect(scrollTo).toHaveBeenCalledWith(0, 1200)
    expect(observe).toHaveBeenCalled()
  })

  it("does not restore a saved scroll position of 0", () => {
    sessionStorage.setItem(STORAGE_KEY, "0")

    renderHook(() => useScrollRestoration())

    expect(scrollTo).not.toHaveBeenCalled()
    expect(observe).not.toHaveBeenCalled()
    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it("does not persist scroll position 0 on cold mount", () => {
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 0 })

    renderHook(() => useScrollRestoration())

    expect(sessionStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it("stops restoring when scroll diverges from the saved position", () => {
    const rafCallbacks: FrameRequestCallback[] = []
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    })

    sessionStorage.setItem(STORAGE_KEY, "1200")
    renderHook(() => useScrollRestoration())
    scrollTo.mockClear()

    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 500 })

    act(() => {
      window.dispatchEvent(new Event("scroll"))
      rafCallbacks.forEach((cb) => cb(0))
    })

    expect(sessionStorage.getItem(STORAGE_KEY)).toBe("500")
    expect(disconnect).toHaveBeenCalled()

    scrollTo.mockClear()
    act(() => {
      mutationCallback?.([], {} as MutationObserver)
    })
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it("does not overwrite the saved position while restoring", () => {
    sessionStorage.setItem(STORAGE_KEY, "1200")
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 40 })

    renderHook(() => useScrollRestoration())

    act(() => {
      window.dispatchEvent(new Event("scroll"))
    })

    expect(sessionStorage.getItem(STORAGE_KEY)).toBe("1200")
  })

  it("re-applies the saved position when the DOM mutates during restore", () => {
    sessionStorage.setItem(STORAGE_KEY, "800")

    renderHook(() => useScrollRestoration())
    scrollTo.mockClear()

    act(() => {
      mutationCallback?.([], {} as MutationObserver)
    })

    expect(scrollTo).toHaveBeenCalledWith(0, 800)
  })

  it("reveals in-viewport animated elements after restore", () => {
    sessionStorage.setItem(STORAGE_KEY, "500")
    const animated = document.createElement("div")
    animated.className = "animated"
    animated.style.opacity = "0"
    vi.spyOn(animated, "getBoundingClientRect").mockReturnValue({
      top: 100,
      bottom: 200,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    })
    document.getElementById("root")?.appendChild(animated)

    renderHook(() => useScrollRestoration())

    expect(animated.style.opacity).toBe("1")
  })

  it("keeps the intended saved position after the restore timeout", () => {
    vi.useFakeTimers()
    sessionStorage.setItem(STORAGE_KEY, "500")
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 120 })

    renderHook(() => useScrollRestoration())

    act(() => {
      vi.advanceTimersByTime(8_000)
    })

    expect(sessionStorage.getItem(STORAGE_KEY)).toBe("500")
    expect(disconnect).toHaveBeenCalled()
  })

  it("falls back to hash scrolling when nothing is saved", () => {
    window.location.hash = "#experience-header"
    const target = document.createElement("div")
    target.id = "experience-header"
    target.scrollIntoView = scrollIntoView
    document.getElementById("root")?.appendChild(target)

    renderHook(() => useScrollRestoration())

    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start" })
    expect(scrollTo).not.toHaveBeenCalledWith(0, expect.any(Number))
  })

  it("prefers the saved scroll position over the URL hash", () => {
    sessionStorage.setItem(STORAGE_KEY, "450")
    window.location.hash = "#skills-header"
    const target = document.createElement("div")
    target.id = "skills-header"
    target.scrollIntoView = scrollIntoView
    document.getElementById("root")?.appendChild(target)

    renderHook(() => useScrollRestoration())

    expect(scrollTo).toHaveBeenCalledWith(0, 450)
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it("clears the URL hash when the user scrolls", () => {
    const replaceState = vi.spyOn(window.history, "replaceState")
    window.location.hash = "#experience-header"

    renderHook(() => useScrollRestoration())

    act(() => {
      window.dispatchEvent(new Event("wheel"))
    })

    expect(replaceState).toHaveBeenCalledWith(null, "", `${window.location.pathname}${window.location.search}`)
    expect(window.location.hash).toBe("")
  })

  it("persists scroll position while the user scrolls after restore", () => {
    const rafCallbacks: FrameRequestCallback[] = []
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      rafCallbacks.push(cb)
      return rafCallbacks.length
    })

    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 640 })

    renderHook(() => useScrollRestoration())

    act(() => {
      window.dispatchEvent(new Event("scroll"))
      rafCallbacks.forEach((cb) => cb(0))
    })

    expect(sessionStorage.getItem(STORAGE_KEY)).toBe("640")
  })

  it("persists scroll position on pagehide", () => {
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 960 })

    renderHook(() => useScrollRestoration())

    act(() => {
      window.dispatchEvent(new Event("pagehide"))
    })

    expect(sessionStorage.getItem(STORAGE_KEY)).toBe("960")
  })

  it("preserves the intended saved Y on pagehide during restore", () => {
    sessionStorage.setItem(STORAGE_KEY, "2200")
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 100 })

    renderHook(() => useScrollRestoration())

    act(() => {
      window.dispatchEvent(new Event("pagehide"))
    })

    expect(sessionStorage.getItem(STORAGE_KEY)).toBe("2200")
  })

  it("persists the locked modal scroll offset instead of window.scrollY", () => {
    Object.defineProperty(window, "scrollY", { configurable: true, writable: true, value: 0 })
    document.body.style.position = "fixed"
    document.body.style.top = "-1500px"

    renderHook(() => useScrollRestoration())

    act(() => {
      window.dispatchEvent(new Event("pagehide"))
    })

    expect(sessionStorage.getItem(STORAGE_KEY)).toBe("1500")
  })

  it("restores the previous scrollRestoration on unmount", () => {
    const { unmount } = renderHook(() => useScrollRestoration())
    expect(window.history.scrollRestoration).toBe("manual")

    unmount()
    expect(window.history.scrollRestoration).toBe("auto")
  })
})
