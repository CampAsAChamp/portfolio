import useScrollPosition from "hooks/useScrollPosition"

import "styles/LandingPage/MouseScrollIndicator.css"

export function MouseScrollIndicator(): React.ReactElement {
  const scrollPosition = useScrollPosition()

  const showMouse = scrollPosition.y > 400

  const className = showMouse ? "show" : ""

  return (
    <div id="mouse-scroll-indicator-wrapper">
      <div className={`${className} animate__animated animate__fadeInUp`} id="mouse-scroll-indicator" />
    </div>
  )
}
