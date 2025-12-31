import { useCallback } from 'react'

interface KeyboardAccessibilityReturn {
  onKeyDown: (event: React.KeyboardEvent) => void
}

/**
 * Custom hook for making non-button elements keyboard accessible
 * Handles Enter and Space key presses for interactive elements
 * @param callback - Function to call when Enter or Space is pressed
 */
export function useKeyboardAccessibility(callback: (event: React.KeyboardEvent) => void): KeyboardAccessibilityReturn {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        callback(event)
      }
    },
    [callback],
  )

  return { onKeyDown: handleKeyDown }
}
