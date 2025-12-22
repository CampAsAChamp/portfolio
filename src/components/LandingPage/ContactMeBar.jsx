import { useEffect, useRef } from 'react'

import { Svg } from 'components/Common/Svg'
import { ContactMeModal } from 'components/ContactMeModal/ContactMeModal'

import GitHubLogo from 'assets/Dev_Icons/GitHub.svg'
import LinkedInLogo from 'assets/Dev_Icons/LinkedIn.svg'

export function ContactMeBar({ isOpen, open, close }) {
  const buttonRef = useRef(null)

  const handleContactMeClick = (e) => {
    open()
    // Blur the button after opening to remove focus
    setTimeout(() => {
      e.currentTarget.blur()
    }, 100)
  }

  // Manage button state and view transitions
  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    if (isOpen) {
      // Keep arrow visible while modal is open
      button.classList.add('modal-open')
      button.style.viewTransitionName = 'none'
    } else {
      // Start button exit animation slightly before modal fully disappears
      const timeoutId = setTimeout(() => {
        button.classList.remove('modal-open')
      }, 300)
      button.style.viewTransitionName = 'contact-button'
      return () => clearTimeout(timeoutId)
    }
  }, [isOpen])

  return (
    <div id="contact-me-bar">
      <button type="button" className="button" id="contact-me-button" ref={buttonRef} onClick={handleContactMeClick}>
        <span>Contact Me</span>
      </button>
      <ContactMeModal isOpen={isOpen} close={close} />
      <div id="contact-me-socials">
        <a href="https://github.com/CampAsAChamp/" target="_blank" rel="noopener noreferrer">
          <Svg className="contact-me-item" id="github-logo" src={GitHubLogo} alt="Github Icon" title="Github Icon" />
        </a>
        <a href="https://www.linkedin.com/in/nick-schneider-swe/" target="_blank" rel="noopener noreferrer">
          <Svg className="contact-me-item" id="linkedin-logo" src={LinkedInLogo} alt="LinkedIn Icon" title="LinkedIn Icon" />
        </a>
      </div>
    </div>
  )
}
