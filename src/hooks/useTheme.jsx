import { useCallback, useEffect, useState } from 'react'

const DARK = 'dark'
const LIGHT = 'light'
const COLOR_MODE_KEY = 'color-mode'

/**
 * Helper to get initial theme preference from localStorage or system preference
 */
const getInitialTheme = () => {
  const localStorageTheme = localStorage.getItem(COLOR_MODE_KEY)

  // Check for the OS theme if no localStorage theme
  if (!localStorageTheme) {
    const osDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    return osDarkTheme ? DARK : LIGHT
  }

  return localStorageTheme
}

/**
 * Custom hook for managing dark/light theme with View Transitions API support
 * @returns {{ isDarkMode: boolean, toggleTheme: Function }}
 */
export function useTheme() {
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
    (event) => {
      const newTheme = isDarkMode ? LIGHT : DARK

      // Check if View Transitions API is supported
      if (!document.startViewTransition) {
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

      // Update React state immediately to prevent icon flash
      setIsDarkMode(newTheme === DARK)

      // Animate the transition - only update DOM and localStorage in callback
      const transition = document.startViewTransition(() => {
        document.documentElement.setAttribute(COLOR_MODE_KEY, newTheme)
        localStorage.setItem(COLOR_MODE_KEY, newTheme)
      })

      // Ensure transition completes properly (if ready promise exists)
      if (transition && transition.ready) {
        transition.ready.catch(() => {
          // If transition fails, ensure theme is still fully applied
          document.documentElement.setAttribute(COLOR_MODE_KEY, newTheme)
          localStorage.setItem(COLOR_MODE_KEY, newTheme)
        })
      }
    },
    [isDarkMode],
  )

  return { isDarkMode, toggleTheme }
}
