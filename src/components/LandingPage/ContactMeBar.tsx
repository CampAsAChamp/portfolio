import { useEffect, useRef, useState } from "react"
import GitHubLogo from "assets/Dev_Icons/GitHub.svg"
import LinkedInLogo from "assets/Dev_Icons/LinkedIn.svg"
import { Svg } from "components/Common/Svg"
import { flushSync } from "react-dom"

type ContactMeModalModule = typeof import("components/ContactMeModal/ContactMeModal")
type ContactMeModalComponent = ContactMeModalModule["ContactMeModal"]

const loadContactMeModal = (): Promise<ContactMeModalModule> => import("components/ContactMeModal/ContactMeModal")

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

  // Once the chunk has resolved, holds the component so handleOpen can mount + open()
  // synchronously in the same click tick (see handleOpen below for why that matters).
  const loadedModalRef = useRef<ContactMeModalComponent | null>(null)
  // In-flight/started load promise, so overlapping trigger events (e.g. pointerdown then
  // click) share a single import() call instead of kicking off duplicate fetches.
  const loadPromiseRef = useRef<Promise<ContactMeModalModule> | null>(null)

  const startLoadingModal = (): Promise<ContactMeModalModule> => {
    if (!loadPromiseRef.current) {
      loadPromiseRef.current = loadContactMeModal().then((module) => {
        loadedModalRef.current = module.ContactMeModal
        return module
      })
    }
    return loadPromiseRef.current
  }

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

  // Warm the modal chunk on the first sign of intent (hover/focus/touch), which on real
  // user interactions virtually always lands before the subsequent click. That lets
  // handleOpen below take its synchronous path — calling open() directly in the click
  // handler — instead of deferring past an `await`. The deferred/async path leaves a window,
  // between the click and the mount+open() landing, during which the (now-mounted) backdrop
  // fully overlaps the button; any further click delivered in that window — e.g. a second,
  // distinct click dispatched by something re-triggering the interaction while the first
  // click's open is still in flight — lands on the backdrop instead of the button and
  // immediately dismisses the modal it just opened (see the grace-period guard in
  // ContactMeModal, which is the other half of this fix).
  const handlePrimeModal = (): void => {
    if (!hasOpened) void startLoadingModal()
  }

  const mountModalAndOpen = (component: ContactMeModalComponent): void => {
    // flushSync forces the mount to commit to the DOM before open() runs. Calling it here —
    // synchronously inside the click handler (fast path) or inside the microtask continuation
    // right after the import resolves (cold path, unavoidable for a genuinely first click) —
    // guarantees open()'s isOpen=true is applied to an already-mounted modal in one paint,
    // rather than leaving a closed modal on screen for a frame that a stray click could land on.
    flushSync(() => {
      setContactMeModalComponent(() => component)
      setHasOpened(true)
    })
    open()
  }

  const handleOpen = (): void => {
    if (isOpeningRef.current) return

    // Fast path: chunk already resolved (typical case, thanks to handlePrimeModal above).
    // Mount the modal and call open() synchronously, in the same click-event tick, so
    // React never leaves the DOM in a state where the click can retarget onto the backdrop.
    if (!hasOpened && loadedModalRef.current) {
      mountModalAndOpen(loadedModalRef.current)
      return
    }
    if (hasOpened) {
      open()
      return
    }

    // Cold path: genuinely first-ever interaction before the chunk has finished loading
    // (e.g. a very fast click with no preceding hover/focus). Must wait for the import to
    // resolve before we can mount+open — there is no way to do this synchronously.
    isOpeningRef.current = true
    void startLoadingModal()
      .then((module) => mountModalAndOpen(module.ContactMeModal))
      .finally(() => {
        isOpeningRef.current = false
      })
  }

  return (
    <div id="contact-me-bar">
      <button
        type="button"
        className="button animate__animated animate__fadeInUp"
        id="contact-me-button"
        ref={buttonRef}
        onClick={handleOpen}
        onPointerDown={handlePrimeModal}
        onMouseEnter={handlePrimeModal}
        onFocus={handlePrimeModal}
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
