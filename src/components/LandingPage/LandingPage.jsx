import { Svg } from 'components/Common/Svg'
import { ContactMeModal } from 'components/ContactMeModal/ContactMeModal'
import { MouseScrollIndicator } from 'components/LandingPage/MouseScrollIndicator'

import ArtProfilePic from 'assets/Art_Profile_Pic.svg'
import GitHubLogo from 'assets/Dev_Icons/GitHub.svg'
import LinkedInLogo from 'assets/Dev_Icons/LinkedIn.svg'
import HeroImageBlobShape from 'assets/Organic_Shapes/Hero_Image_Blob_Shape.svg'

import { useModal } from 'hooks/useModal'

import 'styles/LandingPage/LandingPage.css'

export function LandingPage() {
  const { isOpen, open, close } = useModal()

  return (
    <>
      <img id="landing-blob" src={HeroImageBlobShape} alt="" />
      <section id="landing-page-container" className="page-container">
        <div id="name-intro-container">
          <h1 id="name">
            NICK
            <br />
            SCHNEIDER
          </h1>
          <div id="software-engineer">Software Engineer</div>
          <br />
          <div id="subtitle">If you&apos;re going to make something, why not make it pretty?</div>
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
          <MouseScrollIndicator />
        </div>
        <div id="profile-pic-container">
          <Svg id="profile-pic" src={ArtProfilePic} alt="Flat Profile Pic" className="center" />
        </div>
      </section>
    </>
  )
}
