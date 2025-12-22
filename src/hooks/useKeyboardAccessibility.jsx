import { useCallback } from 'react'

/**
 * Custom hook for making non-button elements keyboard accessible
 * Handles Enter and Space key presses for interactive elements
 * @param {Function} callback - Function to call when Enter or Space is pressed
 * @returns {Object} - Object with onKeyDown handler
 */
export function useKeyboardAccessibility(callback) {
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        callback(event)
      }
    },
    [callback],
  )

  return { onKeyDown: handleKeyDown }
}
