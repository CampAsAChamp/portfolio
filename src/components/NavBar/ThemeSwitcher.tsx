import { MorphIcon } from "components/NavBar/MorphIcon"
import { useTheme } from "hooks/useTheme"

import "styles/NavBar/ThemeSwitcher.css"

export function ThemeSwitcher(): React.ReactElement {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <button className="theme-toggle-button" onClick={toggleTheme} aria-label="Toggle theme">
      <MorphIcon isDarkMode={isDarkMode} />
    </button>
  )
}
