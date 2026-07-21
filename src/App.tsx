import { lazy, Suspense } from "react"
import { AboutMe } from "components/AboutMe/AboutMe"
import { ScrollToTopButton } from "components/Common/ScrollToTopButton"
import { LandingPage } from "components/LandingPage/LandingPage"
import { Navbar } from "components/NavBar/Navbar"

import "styles/Common/Globals.css"
import "styles/Common/Scrollbar.css"
import "styles/Common/SectionSkeleton.css"

// Lazy load below-fold components for better initial page load performance
const Experience = lazy(() => import("components/Experience/Experience").then((module) => ({ default: module.Experience })))
const SkillsAndTechnologies = lazy(() =>
  import("components/SkillsAndTech/SkillsAndTechnologies").then((module) => ({ default: module.SkillsAndTechnologies })),
)
const SWProjects = lazy(() => import("components/SwProjects/SwProjects").then((module) => ({ default: module.SWProjects })))
const ArtProjects = lazy(() => import("components/ArtProjects/ArtProjects").then((module) => ({ default: module.ArtProjects })))

function SectionSkeleton(): React.ReactElement {
  return (
    <div className="section-skeleton" aria-hidden="true">
      <div className="section-skeleton-header" />
      <div className="section-skeleton-card" />
      <div className="section-skeleton-card" />
    </div>
  )
}

export function App(): React.ReactElement {
  return (
    <>
      <a href="#landing-page-container" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <ScrollToTopButton />
      <LandingPage />
      <AboutMe />
      <Suspense fallback={<SectionSkeleton />}>
        <Experience />
        <SkillsAndTechnologies />
        <SWProjects />
        <ArtProjects />
      </Suspense>
    </>
  )
}
