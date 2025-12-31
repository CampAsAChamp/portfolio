import 'animate.css/animate.min.css'

import { AboutMe } from 'components/AboutMe/AboutMe'
import { ArtProjects } from 'components/ArtProjects/ArtProjects'
import { ScrollToTopButton } from 'components/Common/ScrollToTopButton'
import { Experience } from 'components/Experience/Experience'
import { LandingPage } from 'components/LandingPage/LandingPage'
import { Navbar } from 'components/NavBar/Navbar'
import { SkillsAndTechnologies } from 'components/SkillsAndTech/SkillsAndTechnologies'
import { SWProjects } from 'components/SwProjects/SwProjects'

import 'styles/Common/Globals.css'
import 'styles/Common/Scrollbar.css'

function App(): React.ReactElement {
  return (
    <>
      <Navbar />
      <ScrollToTopButton />
      <LandingPage />
      <AboutMe />
      <Experience />
      <SkillsAndTechnologies />
      <SWProjects />
      <ArtProjects />
    </>
  )
}

export default App
