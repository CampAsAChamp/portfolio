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

  // Initialize theme DOM attribute on mount only
  useEffect(() => {
    const initialTheme = getInitialTheme()
    document.documentElement.setAttribute(COLOR_MODE_KEY, initialTheme)
  }, [])

  // Apply theme to DOM and localStorage
  const applyTheme = useCallback((theme) => {
    document.documentElement.setAttribute(COLOR_MODE_KEY, theme)
    localStorage.setItem(COLOR_MODE_KEY, theme)
    setIsDarkMode(theme === DARK)
  }, [])

  // Toggle theme with View Transitions API support
  const toggleTheme = useCallback(
    (event) => {
      const newTheme = isDarkMode ? LIGHT : DARK

      // Get click position for circular reveal origin
      const x = event.clientX
      const y = event.clientY

      // Check if View Transitions API is supported
      if (!document.startViewTransition) {
        // Fallback: instant switch
        applyTheme(newTheme)
        return
      }

      // Calculate radius for full-screen circle
      const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

      // Set CSS custom properties for animation
      document.documentElement.style.setProperty('--x', `${x}px`)
      document.documentElement.style.setProperty('--y', `${y}px`)
      document.documentElement.style.setProperty('--r', `${endRadius}px`)

      // Animate the transition
      document.startViewTransition(() => {
        applyTheme(newTheme)
      })
    },
    [isDarkMode, applyTheme],
  )

  return { isDarkMode, toggleTheme }
}
