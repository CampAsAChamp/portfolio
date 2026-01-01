import "swiper/css"
import "swiper/css/effect-cards"
import "swiper/css/navigation"
import "swiper/css/pagination"

import { Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { ArtProject } from "types/project.types"

interface ArtGalleryCarouselProps {
  projects: ArtProject[]
}

export function ArtGalleryCarousel({ projects }: ArtGalleryCarouselProps): React.ReactElement {
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
          <img src={project.imageSrc} alt={project.altText} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
