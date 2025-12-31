import { SoftwareProject } from 'types/project.types'

interface SwProjectImageProps {
  project: SoftwareProject
}

export function SwProjectImage({ project }: SwProjectImageProps): React.ReactElement {
  return <img className="sw-projects-thumbnail" src={project.thumbnail} alt={project.name} title={project.name} loading="lazy" />
}
