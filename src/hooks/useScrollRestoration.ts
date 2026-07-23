import { useEffect } from "react"

const SCROLL_STORAGE_KEY = "portfolio-scroll-y"
const HASH_RESTORE_TIMEOUT_MS = 10_000
/** Max time to keep re-applying saved scroll while layout/lazy content settles. */
const SAVED_RESTORE_TIMEOUT_MS = 8_000
/** Consider layout stable when scrollHeight is unchanged for this long. */
const LAYOUT_STABLE_MS = 200
/** How far scroll may drift from the restore target before we treat it as user intent. */
const RESTORE_DIVERGENCE_PX = 8

function withInstantScroll(action: () => void): void {
  const html = document.documentElement
  const previousBehavior = html.style.scrollBehavior
  html.style.scrollBehavior = "auto"
  action()
  html.style.scrollBehavior = previousBehavior
}

function readSavedScrollY(): number | null {
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

function writeSavedScrollY(y: number): void {
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

/** Prefer the locked modal offset when body scroll is frozen; otherwise use window.scrollY. */
function getCurrentScrollY(): number {
  if (document.body.style.position === "fixed") {
    const locked = Number.parseInt(document.body.style.top || "0", 10) * -1
    if (Number.isFinite(locked) && locked >= 0) return locked
  }
  return window.scrollY
}

function notifyScrollListeners(): void {
  window.dispatchEvent(new Event("scroll"))
}

/** Drop a stale section hash after the user scrolls away from a nav jump. */
function clearUrlHash(): void {
  if (!window.location.hash) return
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`)
}

function scrollToY(y: number): void {
  withInstantScroll(() => {
    window.scrollTo(0, y)
  })
}

function scrollToHashTarget(): boolean {
  const id = decodeURIComponent(window.location.hash.slice(1))
  if (!id) return true

  const target = document.getElementById(id)
  if (!target) return false

  withInstantScroll(() => {
    target.scrollIntoView({ block: "start" })
  })
  return true
}

/**
 * react-animate-on-scroll mounts at opacity 0 and uses offset:150, so content can
 * sit on-screen but stay invisible until the user scrolls further. Force-show
 * anything currently intersecting the viewport after a programmatic restore.
 */
function revealInViewportAnimations(): void {
  document.querySelectorAll<HTMLElement>(".animated").forEach((el) => {
    const rect = el.getBoundingClientRect()
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return
    el.style.opacity = "1"
  })
  notifyScrollListeners()
}

/**
 * Persists scroll position across refreshes and restores it after React (and
 * lazy sections) mount. Falls back to URL-hash targets for cold deep links.
 *
 * Persistence is frozen while restoring so a short first paint (or React
 * StrictMode remount) cannot overwrite the real saved Y with a clamped value.
 */
export function useScrollRestoration(): void {
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"

    const savedY = readSavedScrollY()
    const shouldRestoreSaved = savedY !== null
    const shouldRestoreHash = !shouldRestoreSaved && Boolean(window.location.hash)

    let isRestoring = shouldRestoreSaved || shouldRestoreHash
    let mutationObserver: MutationObserver | undefined
    let resizeObserver: ResizeObserver | undefined
    let restoreTimeoutId: number | undefined
    let stableTimeoutId: number | undefined
    let ticking = false

    const persistScrollY = (): void => {
      if (isRestoring) return
      writeSavedScrollY(getCurrentScrollY())
    }

    const stopObservers = (): void => {
      mutationObserver?.disconnect()
      mutationObserver = undefined
      resizeObserver?.disconnect()
      resizeObserver = undefined
      if (restoreTimeoutId !== undefined) {
        window.clearTimeout(restoreTimeoutId)
        restoreTimeoutId = undefined
      }
      if (stableTimeoutId !== undefined) {
        window.clearTimeout(stableTimeoutId)
        stableTimeoutId = undefined
      }
    }

    const onUserScrollIntent = (): void => {
      clearUrlHash()
      if (isRestoring) {
        finishRestoring()
      }
    }

    const onScrollKeyDown = (event: KeyboardEvent): void => {
      switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "PageUp":
        case "PageDown":
        case "Home":
        case "End":
        case " ":
          onUserScrollIntent()
          break
        default:
          break
      }
    }

    const finishRestoring = (): void => {
      if (!isRestoring) return
      isRestoring = false
      stopObservers()
      window.removeEventListener("load", onLayoutChange)

      // Never persist a clamped mid-restore Y — keep the intended saved position
      // until the user scrolls on their own.
      if (shouldRestoreSaved && savedY !== null) {
        writeSavedScrollY(savedY)
      } else {
        writeSavedScrollY(getCurrentScrollY())
      }
    }

    const applySavedPosition = (y: number): void => {
      scrollToY(y)
      revealInViewportAnimations()
    }

    const observeLayout = (onChange: () => void): void => {
      const root = document.getElementById("root")
      if (root) {
        mutationObserver = new MutationObserver(onChange)
        mutationObserver.observe(root, { childList: true, subtree: true })
      }

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(onChange)
        resizeObserver.observe(document.documentElement)
      }
    }

    const onLayoutChange = (): void => {
      if (!shouldRestoreSaved || savedY === null || !isRestoring) return

      applySavedPosition(savedY)

      if (stableTimeoutId !== undefined) {
        window.clearTimeout(stableTimeoutId)
      }
      stableTimeoutId = window.setTimeout(() => {
        if (!isRestoring || savedY === null) return
        const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
        if (maxScroll >= savedY - 1) {
          applySavedPosition(savedY)
          finishRestoring()
        }
      }, LAYOUT_STABLE_MS)
    }

    if (shouldRestoreSaved && savedY !== null) {
      applySavedPosition(savedY)
      observeLayout(onLayoutChange)

      restoreTimeoutId = window.setTimeout(() => {
        applySavedPosition(savedY)
        finishRestoring()
      }, SAVED_RESTORE_TIMEOUT_MS)

      if (document.readyState === "complete") {
        onLayoutChange()
      } else {
        window.addEventListener("load", onLayoutChange)
      }
    } else if (shouldRestoreHash) {
      const tryHash = (): boolean => {
        if (!scrollToHashTarget()) return false
        revealInViewportAnimations()
        return true
      }

      if (tryHash()) {
        finishRestoring()
      } else {
        observeLayout(() => {
          if (tryHash()) {
            finishRestoring()
          }
        })
        restoreTimeoutId = window.setTimeout(() => {
          finishRestoring()
        }, HASH_RESTORE_TIMEOUT_MS)
      }
    }

    const onScroll = (): void => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        // Programmatic scrolls (e.g. Playwright) don't fire wheel/touch/keydown — if the
        // page has moved away from the restore target, stop fighting and accept the new Y.
        if (isRestoring && shouldRestoreSaved && savedY !== null) {
          const currentY = getCurrentScrollY()
          if (Math.abs(currentY - savedY) > RESTORE_DIVERGENCE_PX) {
            clearUrlHash()
            finishRestoring()
            writeSavedScrollY(currentY)
            ticking = false
            return
          }
        }
        persistScrollY()
        ticking = false
      })
    }

    const onPageHide = (): void => {
      if (isRestoring && shouldRestoreSaved && savedY !== null) {
        writeSavedScrollY(savedY)
        return
      }
      writeSavedScrollY(getCurrentScrollY())
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pagehide", onPageHide)
    window.addEventListener("wheel", onUserScrollIntent, { passive: true })
    window.addEventListener("touchmove", onUserScrollIntent, { passive: true })
    window.addEventListener("keydown", onScrollKeyDown)

    if (!isRestoring) {
      persistScrollY()
    }

    return (): void => {
      isRestoring = false
      stopObservers()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pagehide", onPageHide)
      window.removeEventListener("wheel", onUserScrollIntent)
      window.removeEventListener("touchmove", onUserScrollIntent)
      window.removeEventListener("keydown", onScrollKeyDown)
      window.removeEventListener("load", onLayoutChange)
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [])
}
