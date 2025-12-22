import { Svg } from 'components/Common/Svg'
import { ContactMeModal } from 'components/ContactMeModal/ContactMeModal'

import GitHubLogo from 'assets/Dev_Icons/GitHub.svg'
import LinkedInLogo from 'assets/Dev_Icons/LinkedIn.svg'

export function ContactMeBar({ isOpen, open, close }) {
  return (
    <div id="contact-me-bar">
      <button type="button" className="button" id="contact-me-button" onClick={open}>
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
