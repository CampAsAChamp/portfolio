import { useState } from 'react'

import ScrollAnimation from 'react-animate-on-scroll'
import { SoftwareProject } from 'types/project.types'

import { BulletPointList } from 'components/Common/BulletPointList'
import { Svg } from 'components/Common/Svg'
import { TechnologiesBar } from 'components/Common/TechnologiesBar'
import { SwProjectImage } from 'components/SwProjects/SwProjectImage'
import { SwProjectVideo } from 'components/SwProjects/SwProjectVideo'

import GitHubIcon from 'assets/Dev_Icons/GitHub.svg'

import { COLORS } from 'data/colors'

import { useBrowserDetection } from 'hooks/useBrowserDetection'

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
            <div className="sw-projects-button-row">
              <button
                type="button"
                className="button sw-projects-button"
                onClick={(event) => {
                  // Prevent unwanted triggers from Instagram or other injected scripts
                  if (!event || !event.isTrusted) {
                    return
                  }
                  window.open(project.link, '_blank')
                }}
                onTouchStart={(e) => e.stopPropagation()} // Prevent touch interference
              >
                <Svg className="github-button-icon" src={GitHubIcon} fill="white" title="Github Icon" />
                <span>View Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  )
}
