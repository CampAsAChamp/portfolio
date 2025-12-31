import { useCallback, useEffect, useState } from 'react'

import { supportsViewTransitions } from '@/utils/viewTransitionsUtils'
import { Theme } from 'types/common.types'

const DARK: Theme = 'dark'
const LIGHT: Theme = 'light'
const COLOR_MODE_KEY = 'color-mode'

interface UseThemeReturn {
  isDarkMode: boolean
  toggleTheme: (event: React.MouseEvent) => void
}

/**
 * Helper to get initial theme preference from localStorage or system preference
 */
const getInitialTheme = (): Theme => {
  const localStorageTheme = localStorage.getItem(COLOR_MODE_KEY) as Theme | null

  // Check for the OS theme if no localStorage theme
  if (!localStorageTheme) {
    const osDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    return osDarkTheme ? DARK : LIGHT
  }

  return localStorageTheme
}

/**
 * Custom hook for managing dark/light theme with View Transitions API support
 */
export function useTheme(): UseThemeReturn {
  const [isDarkMode, setIsDarkMode] = useState(() => getInitialTheme() === DARK)

  // Initialize theme DOM attribute on mount if not already set
  // In production, this is already set in index.js before React renders to prevent FOUC
  // In tests, this ensures the attribute is set
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute(COLOR_MODE_KEY)
    if (!currentTheme) {
      const initialTheme = getInitialTheme()
      document.documentElement.setAttribute(COLOR_MODE_KEY, initialTheme)
    }
  }, [])

  // Toggle theme with View Transitions API support
  const toggleTheme = useCallback(
    (event: React.MouseEvent) => {
      const newTheme = isDarkMode ? LIGHT : DARK

      // Check if View Transitions API is supported
      if (!supportsViewTransitions()) {
        // Fallback: instant switch
        document.documentElement.setAttribute(COLOR_MODE_KEY, newTheme)
        localStorage.setItem(COLOR_MODE_KEY, newTheme)
        setIsDarkMode(newTheme === DARK)
        return
      }

      // Get click position for circular reveal origin
      const x = event.clientX
      const y = event.clientY

      // Calculate radius for full-screen circle
      const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

      // Set CSS custom properties BEFORE starting transition
      document.documentElement.style.setProperty('--x', `${x}px`)
      document.documentElement.style.setProperty('--y', `${y}px`)
      document.documentElement.style.setProperty('--r', `${endRadius}px`)

      // Enable circle wipe animation for theme transitions only
      document.documentElement.style.setProperty('--theme-transition-animation', 'revealTheme')

      // Mark that we're transitioning theme (for debugging/reference)
      document.documentElement.setAttribute('data-theme-transitioning', 'true')

      // Update React state immediately to prevent icon flash
      setIsDarkMode(newTheme === DARK)

      // Animate the transition - only update DOM and localStorage in callback
      const transition = document.startViewTransition!(() => {
        document.documentElement.setAttribute(COLOR_MODE_KEY, newTheme)
        localStorage.setItem(COLOR_MODE_KEY, newTheme)
      })

      // Clean up after transition finishes
      // Note: We intentionally don't await these cleanup operations - they run asynchronously in the background
      if (transition) {
        void transition.finished?.finally(() => {
          document.documentElement.removeAttribute('data-theme-transitioning')
          document.documentElement.style.removeProperty('--theme-transition-animation')
        })

        // Ensure transition completes properly (if ready promise exists)
        void transition.ready?.catch(() => {
          // If transition fails, ensure theme is still fully applied
          document.documentElement.setAttribute(COLOR_MODE_KEY, newTheme)
          localStorage.setItem(COLOR_MODE_KEY, newTheme)
          document.documentElement.removeAttribute('data-theme-transitioning')
          document.documentElement.style.removeProperty('--theme-transition-animation')
        })
      }
    },
    [isDarkMode],
  )

  return { isDarkMode, toggleTheme }
}
