import React from 'react'

import useScrollPosition from 'hooks/useScrollPosition'

import 'styles/Common/ScrollToTopButton.css'

export function ScrollToTopButton() {
  const scrollPosition = useScrollPosition()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // * NOTE: Conditional rendering handled by the CSS
  // * Initial opacity is 0, and adding the show class sets the opacity to 1
  // * This allows us to animate the conditional rendering
  const showScrollToTopButton = scrollPosition.y > 400

  return (
    <button onClick={scrollToTop} className={`button ${showScrollToTopButton && 'show'}`} id="scroll-to-top-button" title="Go to top">
      ↑
    </button>
  )
}
