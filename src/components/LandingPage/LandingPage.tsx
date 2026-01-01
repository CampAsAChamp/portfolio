import ArtProfilePic from "assets/Art_Profile_Pic.svg"
import HeroImageBlobShape from "assets/Organic_Shapes/Hero_Image_Blob_Shape.svg"
import { Svg } from "components/Common/Svg"
import { ContactMeBar } from "components/LandingPage/ContactMeBar"
import { MouseScrollIndicator } from "components/LandingPage/MouseScrollIndicator"
import { useModal } from "hooks/useModal"

import "styles/LandingPage/LandingPage.css"

export function LandingPage(): React.ReactElement {
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
          <ContactMeBar isOpen={isOpen} open={open} close={close} />
          <MouseScrollIndicator />
        </div>
        <div id="profile-pic-container">
          <Svg id="profile-pic" src={ArtProfilePic} title="Flat Profile Pic" className="center" />
        </div>
      </section>
    </>
  )
}
