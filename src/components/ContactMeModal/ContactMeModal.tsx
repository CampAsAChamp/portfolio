import { useEffect } from "react"
import GitHubLogo from "assets/Dev_Icons/GitHub.svg"
import LinkedInLogo from "assets/Dev_Icons/LinkedIn.svg"
import RealProfilePic from "assets/Real_Profile_Pic.webp"
import { CloseIcon } from "components/Common/Icons/CloseIcon"
import { EmailIcon } from "components/Common/Icons/EmailIcon"
import { Svg } from "components/Common/Svg"
import { useKeyboardAccessibility } from "hooks/useKeyboardAccessibility"

import "styles/ContactMeModal/ContactMeModal.css"

interface ContactMeModalProps {
  isOpen: boolean
  close: () => void
}

export function ContactMeModal({ isOpen, close }: ContactMeModalProps): React.ReactElement {
  const modalBackgroundKeyboardProps = useKeyboardAccessibility(close)
  const modalCloseKeyboardProps = useKeyboardAccessibility(close)

  // Sync modal state with CSS classes
  useEffect(() => {
    const modalBackground = document.getElementById("contact-me-modal-background")
    const modalContent = document.getElementById("contact-me-modal-content")

    if (!modalBackground || !modalContent) return

    if (isOpen) {
      modalBackground.classList.add("show")
      modalContent.classList.add("show")
    } else {
      modalBackground.classList.remove("show")
      modalContent.classList.remove("show")
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
        <button className="modal-close" onClick={close} {...modalCloseKeyboardProps} type="button" aria-label="Close">
          <CloseIcon />
        </button>
        <div id="contact-me-modal-header">
          <img id="contact-me-modal-profile-pic" src={RealProfilePic} alt="Nick Schneider" />
          <h3 id="contact-me-modal-title">Let&apos;s Connect!</h3>
          <p id="contact-me-modal-subtitle">I&apos;d love to hear from you</p>
        </div>
        <div id="contact-me-modal-body">
          <div className="contact-me-modal-section">
            <div className="contact-me-modal-icon">
              <EmailIcon />
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
                <Svg className="contact-me-modal-social-icon" src={GitHubLogo} title="Github" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/nick-schneider-swe/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-me-modal-social-link"
                aria-label="LinkedIn Profile"
              >
                <Svg className="contact-me-modal-social-icon" src={LinkedInLogo} title="LinkedIn" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
