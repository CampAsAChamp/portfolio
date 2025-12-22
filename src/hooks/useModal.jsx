import { useCallback, useState } from 'react'

/**
 * Custom hook for managing modal state with body scroll lock
 * @param {boolean} initialState - Initial open/closed state (default: false)
 * @returns {{ isOpen: boolean, open: Function, close: Function, toggle: Function }}
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => {
    setIsOpen(true)
    // Lock body scroll when modal is open
    document.body.style.position = 'fixed'
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    // Restore body scroll when modal is closed
    document.body.style.position = ''
  }, [])

  const toggle = useCallback(() => {
    if (isOpen) {
      close()
    } else {
      open()
    }
  }, [isOpen, open, close])

  return { isOpen, open, close, toggle }
}
