import { useCallback, useEffect, useState } from 'react'

import { supportsViewTransitions } from '@/utils/viewTransitionsUtils'

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

    const updateState = (): void => {
      setIsOpen(true)
      // Lock body scroll and compensate for scrollbar width
      document.body.style.position = 'fixed'
      document.body.style.paddingRight = `${scrollbarWidth}px`
      // Set CSS variable for elements that need scrollbar compensation
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
    }

    // Use View Transitions API if available, otherwise fall back to instant change
    if (supportsViewTransitions()) {
      document.startViewTransition!(updateState)
    } else {
      updateState()
    }
  }, [])

  const close = useCallback(() => {
    const updateState = (): void => {
      setIsOpen(false)
      // Restore body scroll and remove padding
      document.body.style.position = ''
      document.body.style.paddingRight = ''
      // Remove CSS variable
      document.documentElement.style.removeProperty('--scrollbar-width')
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
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return (): void => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, close])

  return { isOpen, open, close, toggle }
}
