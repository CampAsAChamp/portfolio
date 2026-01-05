import { useState } from "react"
import GitHubIcon from "assets/Dev_Icons/GitHub.svg"
import ExternalLinkIcon from "assets/External_Link.svg"
import { BulletPointList } from "components/Common/BulletPointList"
import { Svg } from "components/Common/Svg"
import { TechnologiesBar } from "components/Common/TechnologiesBar"
import { SwProjectImage } from "components/SwProjects/SwProjectImage"
import { SwProjectVideo } from "components/SwProjects/SwProjectVideo"
import { COLORS } from "data/colors"
import { useBrowserDetection } from "hooks/useBrowserDetection"
import ScrollAnimation from "react-animate-on-scroll"
import { SoftwareProject } from "types/project.types"

interface SwProjectCardProps {
  project: SoftwareProject
  index: number
}

export function SwProjectCard({ project, index }: SwProjectCardProps): React.ReactElement {
  const { isProblematicBrowser } = useBrowserDetection()
  const [canAutoPlay] = useState(() => !isProblematicBrowser)
  const [videoError, setVideoError] = useState(false)

  const handleVideoError = (): void => {
    setVideoError(true)
  }

  const renderProjectMedia = (): React.ReactElement => {
    const shouldShowVideo = project.isVideo && !videoError

    if (shouldShowVideo) {
      return <SwProjectVideo project={project} canAutoPlay={canAutoPlay} onVideoError={handleVideoError} />
    }

    return <SwProjectImage project={project} />
  }

  const handleButtonClick = (url: string, event: React.MouseEvent<HTMLButtonElement>): void => {
    // Prevent unwanted triggers from Instagram or other injected scripts
    if (!event || !event.isTrusted) {
      return
    }
    window.open(url, "_blank")
  }

  const renderButtons = (): React.ReactElement | null => {
    const hasGithub = !!project.githubLink
    const hasSite = !!project.siteLink

    if (!hasGithub && !hasSite) {
      return null
    }

    return (
      <div className="sw-projects-button-row">
        {hasSite && (
          <button
            type="button"
            className="button sw-projects-button"
            onClick={(event) => handleButtonClick(project.siteLink!, event)}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <Svg className="github-button-icon" src={ExternalLinkIcon} fill="white" title="External Link Icon" />
            <span>Visit Site</span>
          </button>
        )}
        {hasGithub && (
          <button
            type="button"
            className="button sw-projects-button"
            onClick={(event) => handleButtonClick(project.githubLink!, event)}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <Svg className="github-button-icon" src={GitHubIcon} fill="white" title="Github Icon" />
            <span>View Code</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <ScrollAnimation animateIn="animate__springIn" animateOnce>
      <div className="card sw-projects-card" id={`sw-projects-card${index}`}>
        <div className="sw-projects-title-container">
          <div className="sw-project-title card-title">{project.name}</div>
          <TechnologiesBar technologyNames={project.technologies} fillColor={COLORS.PURPLE} />
        </div>
        <div className="sw-projects-content">
          <div className="sw-projects-thumbnail-container">{renderProjectMedia()}</div>
          <div className="sw-projects-info-container">
            <div className="sw-projects-text">
              <BulletPointList bulletPoints={project.bulletPoints} />
            </div>
            {renderButtons()}
          </div>
        </div>
      </div>
    </ScrollAnimation>
  )
}
