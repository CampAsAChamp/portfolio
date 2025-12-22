import { useEffect, useState } from 'react'

import 'styles/NavBar/ThemeSwitcher.css'

const DARK = 'dark'
const LIGHT = 'light'
const COLOR_MODE_KEY = 'color-mode'

export function ThemeSwitcher() {
  let localStorageTheme = localStorage.getItem(COLOR_MODE_KEY)

  // Check for the OS theme if no localStorage theme
  if (!localStorageTheme) {
    const osDarkTheme = window.matchMedia('(prefers-color-scheme: dark)').matches

    localStorageTheme = osDarkTheme ? DARK : LIGHT
  }

  const [isDarkMode, setIsDarkMode] = useState(localStorageTheme === DARK)

  // Initialize theme on mount only
  useEffect(() => {
    if (isDarkMode) {
      setDarkMode()
    } else {
      setLightMode()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setDarkMode = () => {
    document.documentElement.setAttribute(COLOR_MODE_KEY, DARK)
    localStorage.setItem(COLOR_MODE_KEY, DARK)
    setIsDarkMode(true)
  }

  const setLightMode = () => {
    document.documentElement.setAttribute(COLOR_MODE_KEY, LIGHT)
    localStorage.setItem(COLOR_MODE_KEY, LIGHT)
    setIsDarkMode(false)
  }

  const switchTheme = (event) => {
    // Get click position for circular reveal origin
    const x = event.clientX
    const y = event.clientY

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      // Fallback: instant switch
      if (isDarkMode) {
        setLightMode()
      } else {
        setDarkMode()
      }
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
      if (isDarkMode) {
        setLightMode()
      } else {
        setDarkMode()
      }
    })
  }

  return (
    <button className="theme-toggle-button" onClick={switchTheme} aria-label="Toggle theme">
      {isDarkMode ? (
        // Moon icon for dark mode
        <svg className="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg className="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" fill="currentColor" stroke="currentColor" strokeWidth="2" />
          <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}
