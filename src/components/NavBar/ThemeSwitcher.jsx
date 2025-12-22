import { MoonIcon } from 'components/NavBar/MoonIcon'
import { SunIcon } from 'components/NavBar/SunIcon'

import { useTheme } from 'hooks/useTheme'

import 'styles/NavBar/ThemeSwitcher.css'

export function ThemeSwitcher() {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button className="theme-toggle-button" onClick={toggleTheme} aria-label="Toggle theme">
      {isDarkMode ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}
