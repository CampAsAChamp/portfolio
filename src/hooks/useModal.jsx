import { useCallback, useEffect, useState } from 'react'

/**
 * Custom hook for managing modal state with body scroll lock and View Transitions API
 * @param {boolean} initialState - Initial open/closed state (default: false)
 * @returns {{ isOpen: boolean, open: Function, close: Function, toggle: Function }}
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => {
    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    // Use View Transitions API if available, otherwise fall back to instant change
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setIsOpen(true)
        // Lock body scroll and compensate for scrollbar width
        document.body.style.position = 'fixed'
        document.body.style.paddingRight = `${scrollbarWidth}px`
        // Set CSS variable for elements that need scrollbar compensation
        document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
      })
    } else {
      setIsOpen(true)
      document.body.style.position = 'fixed'
      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`)
    }
  }, [])

  const close = useCallback(() => {
    // Use View Transitions API if available, otherwise fall back to instant change
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setIsOpen(false)
        // Restore body scroll and remove padding
        document.body.style.position = ''
        document.body.style.paddingRight = ''
        // Remove CSS variable
        document.documentElement.style.removeProperty('--scrollbar-width')
      })
    } else {
      setIsOpen(false)
      document.body.style.position = ''
      document.body.style.paddingRight = ''
      document.documentElement.style.removeProperty('--scrollbar-width')
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

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, close])

  return { isOpen, open, close, toggle }
}
