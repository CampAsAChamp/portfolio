import { ArtGalleryCarousel } from "components/ArtProjects/ArtGalleryCarousel"
import { ArtGalleryGrid } from "components/ArtProjects/ArtGalleryGrid"
import { artProjects } from "data/artProjects"
import ScrollAnimation from "react-animate-on-scroll"

import "styles/ArtProjects/ArtProjects.css"

export function ArtProjects(): React.ReactElement {
  return (
    <section id="graphic-design-container" className="page-container">
      <div id="graphic-design-header" className="section-header">
        <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
          <h2>Art & Design Projects</h2>
        </ScrollAnimation>
      </div>
      <div id="graphic-design-content">
        <ArtGalleryGrid projects={artProjects} />
        {/* For Mobile Only */}
        <ArtGalleryCarousel projects={artProjects} />
      </div>
    </section>
  )
}
