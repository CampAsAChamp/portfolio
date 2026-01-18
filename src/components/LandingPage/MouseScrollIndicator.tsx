import { useState } from "react"
import useScrollPosition from "hooks/useScrollPosition"

import "styles/LandingPage/MouseScrollIndicator.css"

export function MouseScrollIndicator(): React.ReactElement {
  const scrollPosition = useScrollPosition()
  const [hasEntered, setHasEntered] = useState(false)

  // Hide the indicator once user has scrolled down a bit (opposite of ScrollToTopButton)
  const hideMouseIndicator = scrollPosition.y > 100

  // Build className dynamically
  const classList = []
  if (!hasEntered) classList.push("entrance")
  if (hideMouseIndicator) classList.push("hide")
  const className = classList.join(" ")

  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>): void => {
    // Only handle the entrance animation, not the scroll wheel animation
    if (e.animationName === "fade-in-up") {
      setHasEntered(true)
    }
  }

  return (
    <div id="mouse-scroll-indicator-wrapper">
      <div className={className} id="mouse-scroll-indicator" onAnimationEnd={handleAnimationEnd} />
    </div>
  )
}
