import "swiper/css"
import "swiper/css/effect-cards"
import "swiper/css/navigation"
import "swiper/css/pagination"

import type { ArtLightboxItem } from "components/ArtProjects/ArtLightbox"
import { Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { ArtProject } from "types/project.types"

interface ArtGalleryCarouselProps {
  projects: ArtProject[]
  onOpen: (item: ArtLightboxItem) => void
}

export function ArtGalleryCarousel({ projects, onOpen }: ArtGalleryCarouselProps): React.ReactElement {
  return (
    <Swiper
      spaceBetween={50}
      grabCursor={true}
      modules={[Navigation, Pagination]}
      autoHeight={true}
      loop={true}
      navigation={{ enabled: true }}
      pagination={{ clickable: true }}
    >
      {projects.map((project) => (
        <SwiperSlide key={project.id}>
          <button
            type="button"
            className="art-carousel-open"
            onClick={() => onOpen({ imgSrc: project.imageSrc, altText: project.altText })}
            aria-label={`View ${project.altText}`}
          >
            <img src={project.imageSrc} alt={project.altText} loading="lazy" />
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
