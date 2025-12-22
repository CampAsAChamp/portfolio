export function HamburgerMenu({ navSlide }) {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navSlide()
    }
  }

  return (
    <div
      className="hamburger-menu"
      onClick={navSlide}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Toggle navigation menu"
    >
      <div className="hamburger-menu-line" id="hamburger-menu-line1" />
      <div className="hamburger-menu-line" id="hamburger-menu-line2" />
      <div className="hamburger-menu-line" id="hamburger-menu-line3" />
    </div>
  )
}
