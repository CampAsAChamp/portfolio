import { useEffect } from 'react'

import { Svg } from 'components/Common/Svg'

import GitHubLogo from 'assets/Dev_Icons/GitHub.svg'
import LinkedInLogo from 'assets/Dev_Icons/LinkedIn.svg'
import RealProfilePic from 'assets/Real_Profile_Pic.webp'

import { useKeyboardAccessibility } from 'hooks/useKeyboardAccessibility'

import 'styles/ContactMeModal/ContactMeModal.css'

export function ContactMeModal({ isOpen, close }) {
  const modalBackgroundKeyboardProps = useKeyboardAccessibility(close)
  const modalCloseKeyboardProps = useKeyboardAccessibility(close)

  // Sync modal state with CSS classes
  useEffect(() => {
    const modalBackground = document.getElementById('contact-me-modal-background')
    const modalContent = document.getElementById('contact-me-modal-content')

    if (isOpen) {
      modalBackground.classList.add('show')
      modalContent.classList.add('show')
    } else {
      modalBackground.classList.remove('show')
      modalContent.classList.remove('show')
    }
  }, [isOpen])

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className="modal-bg"
      id="contact-me-modal-background"
      onClick={close}
      {...modalBackgroundKeyboardProps}
      role="button"
      tabIndex={0}
      aria-label="Close modal"
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div id="contact-me-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <button className="modal-close" onClick={close} {...modalCloseKeyboardProps} type="button" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div id="contact-me-modal-header">
          <img id="contact-me-modal-profile-pic" src={RealProfilePic} alt="Nick Schneider" />
          <h3 id="contact-me-modal-title">Let&apos;s Connect!</h3>
          <p id="contact-me-modal-subtitle">I&apos;d love to hear from you</p>
        </div>
        <div id="contact-me-modal-body">
          <div className="contact-me-modal-section">
            <div className="contact-me-modal-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="contact-me-modal-info">
              <div className="contact-me-modal-label">Email</div>
              <a href="mailto:nickschneider101@gmail.com" target="_blank" rel="noopener noreferrer" className="contact-me-modal-link">
                nickschneider101@gmail.com
              </a>
            </div>
          </div>
          <div className="contact-me-modal-divider" />
          <div className="contact-me-modal-section">
            <div className="contact-me-modal-label">Connect with me</div>
            <div id="contact-me-modal-socials">
              <a
                href="https://github.com/CampAsAChamp/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-me-modal-social-link"
                aria-label="GitHub Profile"
              >
                <Svg className="contact-me-modal-social-icon" src={GitHubLogo} alt="Github Icon" title="Github" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/nick-schneider-swe/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-me-modal-social-link"
                aria-label="LinkedIn Profile"
              >
                <Svg className="contact-me-modal-social-icon" src={LinkedInLogo} alt="LinkedIn Icon" title="LinkedIn" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
