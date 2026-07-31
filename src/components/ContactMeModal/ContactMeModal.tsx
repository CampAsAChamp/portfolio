import { useEffect, useLayoutEffect, useRef } from "react"
import GitHubLogo from "assets/Dev_Icons/GitHub.svg"
import LinkedInLogo from "assets/Dev_Icons/LinkedIn.svg"
import RealProfilePic120w from "assets/Real_Profile_Pic_120w.webp"
import RealProfilePic240w from "assets/Real_Profile_Pic_240w.webp"
import { CloseIcon } from "components/Common/Icons/CloseIcon"
import { EmailIcon } from "components/Common/Icons/EmailIcon"
import { Svg } from "components/Common/Svg"
import { useKeyboardAccessibility } from "hooks/useKeyboardAccessibility"

import "styles/ContactMeModal/ContactMeModal.css"

interface ContactMeModalProps {
  isOpen: boolean
  close: () => void
}

const FOCUSABLE_SELECTOR = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

// Ignore a backdrop dismiss-click that lands within this window of the modal opening. The
// backdrop mounts underneath the trigger button and is a full-viewport target the instant it
// appears — a second click delivered right after the opening click (e.g. a trigger's own
// retry/defensive re-click while the first click's open is still settling) can land on the
// backdrop instead of the button and immediately dismiss the modal it just opened.
// No real "click outside to dismiss" is ever intentionally this fast.
const DISMISS_GRACE_PERIOD_MS = 300

export function ContactMeModal({ isOpen, close }: ContactMeModalProps): React.ReactElement {
  const dialogRef = useRef<HTMLDivElement>(null)
  const modalCloseKeyboardProps = useKeyboardAccessibility(close)

  // Sampled in a layout effect (runs synchronously right after the DOM commits, before the
  // browser paints or any subsequent user event can fire) whenever isOpen flips false -> true.
  // A plain useEffect would run too late — after paint, with room for a stray click to land
  // first — to reliably guard the earliest possible dismiss-click.
  const openedAtRef = useRef<number | null>(null)
  useLayoutEffect(() => {
    openedAtRef.current = isOpen ? performance.now() : null
  }, [isOpen])

  const handleBackdropClick = (): void => {
    if (!isOpen) return
    // Read the clock here (handler-execution time) instead of the click event's own
    // `timeStamp`. `Event.timeStamp` is supposed to share an origin with `performance.now()`,
    // and does on Chromium/Firefox — but on WebKit, native/OS-level synthesized clicks (which
    // is how Playwright's WebKit driver dispatches clicks, and how real trackpad/mouse input
    // reaches WebKit) carry a `timeStamp` from an unrelated clock, off by many orders of
    // magnitude from `performance.now()`. Subtracting the two there always yields a huge delta,
    // so this guard would never engage on WebKit. The handler runs synchronously off the click
    // dispatch with no meaningful delay, so sampling `performance.now()` right here is just as
    // accurate for this comparison and is portable across all engines.
    if (openedAtRef.current !== null && performance.now() - openedAtRef.current < DISMISS_GRACE_PERIOD_MS) return
    close()
  }

  // Focus trap and initial focus when dialog opens
  useEffect(() => {
    if (!isOpen) return

    const dialog = dialogRef.current
    if (!dialog) return

    const getFocusableElements = (): HTMLElement[] =>
      Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
      )

    const focusable = getFocusableElements()
    focusable[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Tab") return

      const elements = getFocusableElements()
      if (elements.length === 0) return

      const first = elements[0]
      const last = elements[elements.length - 1]
      if (!first || !last) return

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return (): void => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  return (
    // Backdrop click dismisses; keyboard users close via Escape (useModal) or the Close button
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={`modal-bg${isOpen ? " show" : ""}`}
      id="contact-me-modal-background"
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <div
        id="contact-me-modal-content"
        className={isOpen ? "show" : undefined}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-me-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={close} {...modalCloseKeyboardProps} type="button" aria-label="Close">
          <CloseIcon />
        </button>
        <div id="contact-me-modal-header">
          <img
            id="contact-me-modal-profile-pic"
            src={RealProfilePic120w}
            srcSet={`${RealProfilePic120w} 1x, ${RealProfilePic240w} 2x`}
            alt="Nick Schneider"
            width="120"
            height="120"
          />
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
              <a href="mailto:nickschneider101@gmail.com" className="contact-me-modal-link">
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
                <Svg className="contact-me-modal-social-icon" src={GitHubLogo} title="GitHub" />
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
