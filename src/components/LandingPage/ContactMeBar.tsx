import { lazy, Suspense, useEffect, useRef } from "react"
import GitHubLogo from "assets/Dev_Icons/GitHub.svg"
import LinkedInLogo from "assets/Dev_Icons/LinkedIn.svg"
import { Svg } from "components/Common/Svg"

const ContactMeModal = lazy(() => import("components/ContactMeModal/ContactMeModal").then((module) => ({ default: module.ContactMeModal })))

interface ContactMeBarProps {
  isOpen: boolean
  open: () => void
  close: () => void
}

export function ContactMeBar({ isOpen, open, close }: ContactMeBarProps): React.ReactElement {
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleContactMeClick = (): void => {
    open()
    // Blur the button after opening to remove focus
    setTimeout(() => {
      buttonRef.current?.blur()
    }, 100)
  }

  // Manage button state and view transitions
  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    if (isOpen) {
      // Keep arrow visible while modal is open
      button.classList.add("modal-open")
      button.style.viewTransitionName = "none"
      return
    } else {
      // Start button exit animation slightly before modal fully disappears
      const timeoutId = setTimeout(() => {
        button.classList.remove("modal-open")
      }, 300)
      button.style.viewTransitionName = "contact-button"
      return (): void => clearTimeout(timeoutId)
    }
  }, [isOpen])

  return (
    <div id="contact-me-bar">
      <button
        type="button"
        className="button animate__animated animate__fadeInUp"
        id="contact-me-button"
        ref={buttonRef}
        onClick={handleContactMeClick}
      >
        <span>Contact Me</span>
      </button>
      <Suspense fallback={null}>
        <ContactMeModal isOpen={isOpen} close={close} />
      </Suspense>
      <div id="contact-me-socials" className="animate__animated animate__fadeInUp">
        <a href="https://github.com/CampAsAChamp/" target="_blank" rel="noopener noreferrer">
          <Svg className="contact-me-item" id="github-logo" src={GitHubLogo} title="Github Icon" />
        </a>
        <a href="https://www.linkedin.com/in/nick-schneider-swe/" target="_blank" rel="noopener noreferrer">
          <Svg className="contact-me-item" id="linkedin-logo" src={LinkedInLogo} title="LinkedIn Icon" />
        </a>
      </div>
    </div>
  )
}
