import { useEffect, useRef, useState } from "react"
import GitHubLogo from "assets/Dev_Icons/GitHub.svg"
import LinkedInLogo from "assets/Dev_Icons/LinkedIn.svg"
import { Svg } from "components/Common/Svg"
import { flushSync } from "react-dom"

const loadContactMeModal = (): Promise<typeof import("components/ContactMeModal/ContactMeModal")> =>
  import("components/ContactMeModal/ContactMeModal")

type ContactMeModalComponent = typeof import("components/ContactMeModal/ContactMeModal").ContactMeModal

interface ContactMeBarProps {
  isOpen: boolean
  open: () => void
  close: () => void
}

export function ContactMeBar({ isOpen, open, close }: ContactMeBarProps): React.ReactElement {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(false)
  const isOpeningRef = useRef(false)
  const [ContactMeModalComponent, setContactMeModalComponent] = useState<ContactMeModalComponent | null>(null)
  // Defer loading the modal chunk until the user opens it (keeps initial mobile TBT down)
  const [hasOpened, setHasOpened] = useState(false)
  // Keep the boundary mounted if parent isOpen survives a remount that resets hasOpened
  const showModal = hasOpened || isOpen

  // Manage button state, view transitions, and restore focus when the modal closes
  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    if (wasOpenRef.current && !isOpen) {
      button.focus()
    }

    const wasOpen = wasOpenRef.current
    wasOpenRef.current = isOpen

    if (isOpen) {
      // Keep arrow visible while modal is open
      button.classList.add("modal-open")
      button.style.viewTransitionName = "none"
      return
    }

    // Initial mount: CSS already sets view-transition-name. Touching it here cancels
    // the staggered fadeInUp entrance while opacity is still 0 (animation delay).
    if (!wasOpen) {
      return
    }

    // Start button exit animation slightly before modal fully disappears
    const timeoutId = setTimeout(() => {
      button.classList.remove("modal-open")
    }, 300)
    button.style.removeProperty("view-transition-name")
    return (): void => clearTimeout(timeoutId)
  }, [isOpen])

  const handleOpen = (): void => {
    if (isOpeningRef.current) return

    void (async (): Promise<void> => {
      isOpeningRef.current = true
      try {
        if (!hasOpened) {
          const module = ContactMeModalComponent ? null : await loadContactMeModal()
          flushSync(() => {
            if (module) {
              setContactMeModalComponent(() => module.ContactMeModal)
            }
            setHasOpened(true)
          })
        }
        open()
      } finally {
        isOpeningRef.current = false
      }
    })()
  }

  return (
    <div id="contact-me-bar">
      <button
        type="button"
        className="button animate__animated animate__fadeInUp"
        id="contact-me-button"
        ref={buttonRef}
        onClick={handleOpen}
      >
        <span>Contact Me</span>
      </button>
      {showModal && ContactMeModalComponent && <ContactMeModalComponent isOpen={isOpen} close={close} />}
      <div id="contact-me-socials">
        <a href="https://github.com/CampAsAChamp/" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
          <Svg className="contact-me-item animate__animated animate__fadeInUp" id="github-logo" src={GitHubLogo} title="GitHub Icon" />
        </a>
        <a href="https://www.linkedin.com/in/nick-schneider-swe/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
          <Svg
            className="contact-me-item animate__animated animate__fadeInUp"
            id="linkedin-logo"
            src={LinkedInLogo}
            title="LinkedIn Icon"
          />
        </a>
      </div>
    </div>
  )
}
