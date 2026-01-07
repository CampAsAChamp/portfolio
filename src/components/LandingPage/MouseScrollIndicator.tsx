import useScrollPosition from "hooks/useScrollPosition"

import "styles/LandingPage/MouseScrollIndicator.css"

export function MouseScrollIndicator(): React.ReactElement {
  const scrollPosition = useScrollPosition()

  // Hide the indicator once user has scrolled down a bit (opposite of ScrollToTopButton)
  const hideMouseIndicator = scrollPosition.y > 100

  const className = hideMouseIndicator ? "hide" : ""

  return (
    <div id="mouse-scroll-indicator-wrapper">
      <div className={className} id="mouse-scroll-indicator" />
    </div>
  )
}
