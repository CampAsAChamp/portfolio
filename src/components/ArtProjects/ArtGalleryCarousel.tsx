import { useEffect } from "react"
import type { ArtLightboxItem } from "components/ArtProjects/ArtLightbox"
// Imported with the `?url` suffix so Vite treats these as plain asset URL
// strings instead of stylesheets to bundle. A normal `import "swiper/css"`
// (even a dynamic one) is still statically discovered by Vite's CSS-code-split
// analysis and hoisted into index.html as a render-blocking <link
// rel="stylesheet">, to prevent a flash of unstyled content on lazy
// components -- but ArtGalleryCarousel is below-the-fold and reached only
// through the already-lazy ArtProjects section, so that stylesheet was
// blocking first paint for a section nobody sees yet. Injecting the <link>
// ourselves at mount time (below) defers it until the carousel actually runs.
import swiperCss from "swiper/css?url"
import swiperEffectCardsCss from "swiper/css/effect-cards?url"
import swiperNavigationCss from "swiper/css/navigation?url"
import swiperPaginationCss from "swiper/css/pagination?url"
import { Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { ArtProject } from "types/project.types"

const SWIPER_STYLESHEETS = [swiperCss, swiperEffectCardsCss, swiperNavigationCss, swiperPaginationCss]

function useDeferredStylesheets(hrefs: string[]): void {
  useEffect(() => {
    const links = hrefs.map((href): HTMLLinkElement | null => {
      const existing = document.querySelector(`link[href="${href}"]`)
      if (existing) return null

      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = href
      document.head.appendChild(link)
      return link
    })

    return (): void => {
      links.forEach((link) => link?.remove())
    }
  }, [hrefs])
}

interface ArtGalleryCarouselProps {
  projects: ArtProject[]
  onOpen: (item: ArtLightboxItem) => void
}

export function ArtGalleryCarousel({ projects, onOpen }: ArtGalleryCarouselProps): React.ReactElement {
  useDeferredStylesheets(SWIPER_STYLESHEETS)

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
