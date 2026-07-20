import { useCallback, useState } from "react"
import { ArtGalleryCarousel } from "components/ArtProjects/ArtGalleryCarousel"
import { ArtGalleryGrid } from "components/ArtProjects/ArtGalleryGrid"
import { ArtLightbox, type ArtLightboxItem } from "components/ArtProjects/ArtLightbox"
import { artProjects } from "data/artProjects"
import ScrollAnimation from "react-animate-on-scroll"

import "styles/ArtProjects/ArtProjects.css"

export function ArtProjects(): React.ReactElement {
  const [lightboxItem, setLightboxItem] = useState<ArtLightboxItem | null>(null)

  const openLightbox = useCallback((item: ArtLightboxItem): void => {
    setLightboxItem(item)
  }, [])

  const closeLightbox = useCallback((): void => {
    setLightboxItem(null)
  }, [])

  return (
    <section id="graphic-design-container" className="page-container">
      <div id="graphic-design-header" className="section-header">
        <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
          <h2>Art & Design Projects</h2>
        </ScrollAnimation>
      </div>
      <div id="graphic-design-content">
        <ArtGalleryGrid projects={artProjects} onOpen={openLightbox} />
        {/* For Mobile Only */}
        <ArtGalleryCarousel projects={artProjects} onOpen={openLightbox} />
      </div>
      <ArtLightbox item={lightboxItem} onClose={closeLightbox} />
    </section>
  )
}
