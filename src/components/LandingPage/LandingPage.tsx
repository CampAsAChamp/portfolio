import ArtProfilePic from "assets/Art_Profile_Pic.svg"
import HeroImageBlobShape from "assets/Organic_Shapes/Hero_Image_Blob_Shape.svg"
import { ContactMeBar } from "components/LandingPage/ContactMeBar"
import { MouseScrollIndicator } from "components/LandingPage/MouseScrollIndicator"
import { useModal } from "hooks/useModal"

import "styles/LandingPage/LandingPage.css"

export function LandingPage(): React.ReactElement {
  const { isOpen, open, close } = useModal()

  return (
    <>
      <img id="landing-blob" src={HeroImageBlobShape} alt="" className="animate__animated animate__fadeIn" width="1078" height="1154" />
      <section id="landing-page-container" className="page-container">
        <div id="name-intro-container">
          <h1 id="name" className="animate__animated animate__fadeInDown">
            NICK
            <br />
            SCHNEIDER
          </h1>
          <div id="software-engineer" className="animate__animated animate__fadeInUp">
            Software Engineer
          </div>
          <br />
          <div id="subtitle" className="animate__animated animate__fadeInUp">
            If you&apos;re going to make something, why not make it pretty?
          </div>
          <ContactMeBar isOpen={isOpen} open={open} close={close} />
          <MouseScrollIndicator />
        </div>
        <div id="profile-pic-container">
          {/* Use <img> (not InlineSVG) so width/height reserve space before paint and avoid mobile CLS */}
          <img
            id="profile-pic"
            src={ArtProfilePic}
            alt="Flat Profile Pic"
            title="Flat Profile Pic"
            width="418"
            height="468"
            fetchPriority="high"
            decoding="async"
            className="center animate__animated animate__fadeIn"
          />
        </div>
      </section>
    </>
  )
}
