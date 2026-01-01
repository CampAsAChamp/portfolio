import { ArtProjectPicture } from "components/ArtProjects/ArtProjectPicture"
import ScrollAnimation from "react-animate-on-scroll"
import { ArtProject } from "types/project.types"

interface ArtGalleryGridProps {
  projects: ArtProject[]
}

export function ArtGalleryGrid({ projects }: ArtGalleryGridProps): React.ReactElement {
  // Organize projects into 4 columns
  const columns: ArtProject[][] = [[], [], [], []]
  projects.forEach((project, index) => {
    const columnIndex = index % 4
    if (columns[columnIndex]) {
      columns[columnIndex].push(project)
    }
  })

  // Base delay for staggered animations (50ms between columns)
  const columnDelays = [0, 50, 100, 150]

  return (
    <div className="row">
      {columns.map((columnProjects, columnIndex) => (
        <div key={columnIndex} className="column">
          {columnProjects.map((project, projectIndex) => {
            // Stagger delay: column base delay + (100ms * project position in column)
            const delay = (columnDelays[columnIndex] ?? 0) + projectIndex * 100
            return (
              <ScrollAnimation key={project.id} animateIn="animate__fadeInUp" delay={delay} animateOnce>
                <ArtProjectPicture imgSrc={project.imageSrc} altText={project.altText} />
              </ScrollAnimation>
            )
          })}
        </div>
      ))}
    </div>
  )
}
