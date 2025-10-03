import React, { useEffect, useRef, useState } from 'react';

import { COLORS } from 'data/colors';
import GitHubIcon from 'assets/Dev_Icons/GitHub.svg';
import ScrollAnimation from 'react-animate-on-scroll';
import { Svg } from 'components/Common/Svg';
import { TechnologiesBar } from 'components/Common/TechnologiesBar';
import parse from 'html-react-parser';

export function SwProjectCard(props) {
  const { project, index } = props;
  const [canAutoPlay, setCanAutoPlay] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  // Check if we're in a problematic browser environment
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isInstagramBrowser = userAgent.includes('Instagram');
    const isFacebookBrowser = userAgent.includes('FBAN') || userAgent.includes('FBAV');
    const isIOSMobile = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroidMobile = /Android/.test(userAgent);

    // Only disable autoplay for known problematic mobile in-app browsers
    const isProblematicBrowser = (isInstagramBrowser || isFacebookBrowser) && (isIOSMobile || isAndroidMobile);

    if (!isProblematicBrowser) {
      // Allow autoplay immediately for safe environments (including desktop)
      setCanAutoPlay(true);
    }
  }, []);

  const handleVideoError = () => {
    setVideoError(true);
  };

  const startVideoManually = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback to showing static image if video fails
        setVideoError(true);
      });
    }
  };

  return (
    <ScrollAnimation animateIn="animate__slideInLeft" animateOnce>
      <div className="card sw-projects-card" id={'sw-projects-card' + index}>
        <div className="sw-projects-title-container">
          <div className="sw-project-title card-title">{project.name}</div>
          <TechnologiesBar technologyNames={project.technologies} fillColor={COLORS.PURPLE} />
        </div>
        <div className="sw-projects-content">
          <div className="sw-projects-thumbnail-container">
            {project.isVideo && !videoError ? (
              <div
                className="video-container"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: 'var(--rounded-component-corners-size)'
                }}
              >
                <video
                  ref={videoRef}
                  className="sw-projects-thumbnail"
                  src={project.videoThumbnail}
                  poster={project.thumbnail} // Fallback poster image
                  alt={project.name}
                  title={project.name}
                  autoPlay={canAutoPlay}
                  loop={canAutoPlay}
                  muted
                  playsInline
                  disablePictureInPicture
                  controls={false}
                  preload="metadata"
                  onError={handleVideoError}
                  onLoadStart={(e) => e.stopPropagation()}
                  onPlay={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    borderRadius: 'var(--rounded-component-corners-size)',
                    background: `url(${project.thumbnail}) center/cover no-repeat`
                  }}
                />
                {!canAutoPlay && (
                  <div
                    className="video-play-overlay"
                    onClick={startVideoManually}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      padding: '10px 15px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      userSelect: 'none'
                    }}
                  >
                    ▶ Play Video
                  </div>
                )}
              </div>
            ) : (
              <img className="sw-projects-thumbnail" src={project.thumbnail} alt={project.name} title={project.name} />
            )}
          </div>
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
                    return;
                  }
                  window.open(project.link, '_blank');
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
  );
}
