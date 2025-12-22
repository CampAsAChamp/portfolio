import { useEffect, useState } from 'react'

import parse from 'html-react-parser'
import ScrollAnimation from 'react-animate-on-scroll'

import { Svg } from 'components/Common/Svg'
import { TechnologiesBar } from 'components/Common/TechnologiesBar'
import { SwProjectImage } from 'components/SwProjects/SwProjectImage'
import { SwProjectVideo } from 'components/SwProjects/SwProjectVideo'

import GitHubIcon from 'assets/Dev_Icons/GitHub.svg'

import { COLORS } from 'data/colors'

export function SwProjectCard(props) {
  const { project, index } = props
  const [canAutoPlay, setCanAutoPlay] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // Check if we're in a problematic browser environment
  useEffect(() => {
    const userAgent = navigator.userAgent
    const isInstagramBrowser = userAgent.includes('Instagram')
    const isFacebookBrowser = userAgent.includes('FBAN') || userAgent.includes('FBAV')
    const isIOSMobile = /iPad|iPhone|iPod/.test(userAgent)
    const isAndroidMobile = /Android/.test(userAgent)

    // Only disable autoplay for known problematic mobile in-app browsers
    const isProblematicBrowser = (isInstagramBrowser || isFacebookBrowser) && (isIOSMobile || isAndroidMobile)

    if (!isProblematicBrowser) {
      // Allow autoplay immediately for safe environments (including desktop)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCanAutoPlay(true)
    }
  }, [])

  const handleVideoError = () => {
    setVideoError(true)
  }

  const renderProjectMedia = () => {
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
              <ul>{parse(project.textContent)}</ul>
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
                <Svg className="github-button-icon" src={GitHubIcon} fill="white" alt="Github Icon" />
                <span>View Code</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ScrollAnimation>
  )
}
