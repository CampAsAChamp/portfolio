import { useCallback, useEffect, useState } from "react"

import { supportsViewTransitions } from "@/utils/viewTransitionsUtils"

interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

/**
 * Custom hook for managing modal state with body scroll lock and View Transitions API
 * @param initialState - Initial open/closed state (default: false)
 */
export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => {
    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    // Save current scroll position before locking
    const scrollY = window.scrollY

    const updateState = (): void => {
      setIsOpen(true)
      // Lock body scroll and compensate for scrollbar width
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.body.style.width = "100%"
      // Set CSS variable for elements that need scrollbar compensation
      document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`)
    }

    // Use View Transitions API if available, otherwise fall back to instant change
    if (supportsViewTransitions()) {
      document.startViewTransition!(updateState)
    } else {
      updateState()
    }
  }, [])

  const close = useCallback(() => {
    // Get the scroll position that was saved (convert negative top value back to positive scroll position)
    const scrollY = document.body.style.top
    const scrollPosition = parseInt(scrollY || "0") * -1

    const updateState = (): void => {
      setIsOpen(false)
      // Remove fixed positioning and styles
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.paddingRight = ""
      document.body.style.width = ""
      // Remove CSS variable
      document.documentElement.style.removeProperty("--scrollbar-width")
      // Restore scroll position immediately in the same frame
      // Use scrollTo with instant behavior to prevent smooth scrolling
      window.scrollTo({
        top: scrollPosition,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      })
    }

    // Use View Transitions API if available, otherwise fall back to instant change
    if (supportsViewTransitions()) {
      document.startViewTransition!(updateState)
    } else {
      updateState()
    }
  }, [])

  const toggle = useCallback(() => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [isOpen, open, close])

  // Add ESC key listener to close modal
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        close()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return (): void => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, close])

  return { isOpen, open, close, toggle }
}
