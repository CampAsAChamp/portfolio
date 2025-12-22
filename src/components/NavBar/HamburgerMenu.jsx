import { useKeyboardAccessibility } from 'hooks/useKeyboardAccessibility'

export function HamburgerMenu({ navSlide }) {
  const keyboardProps = useKeyboardAccessibility(navSlide)

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div className="hamburger-menu" onClick={navSlide} {...keyboardProps} role="button" tabIndex={0} aria-label="Toggle navigation menu">
      <div className="hamburger-menu-line" id="hamburger-menu-line1" />
      <div className="hamburger-menu-line" id="hamburger-menu-line2" />
      <div className="hamburger-menu-line" id="hamburger-menu-line3" />
    </div>
  )
}
