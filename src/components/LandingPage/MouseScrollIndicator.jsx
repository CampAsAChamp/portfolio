import React from 'react'

import useScrollPosition from 'hooks/useScrollPosition'

import 'styles/LandingPage/MouseScrollIndicator.css'

export function MouseScrollIndicator() {
  const scrollPosition = useScrollPosition()

  const showMouse = scrollPosition.y > 400

  const className = showMouse ? 'show' : ''

  return <div className={className} id="mouse-scroll-indicator" />
}
