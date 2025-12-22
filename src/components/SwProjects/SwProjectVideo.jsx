import { useRef, useState } from 'react'

export function SwProjectVideo({ project, canAutoPlay, onVideoPlay, onVideoPause, onVideoError }) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isPlayButtonFading, setIsPlayButtonFading] = useState(false)
  const videoRef = useRef(null)

  const handleVideoPlay = (e) => {
    e.stopPropagation()
    setIsVideoPlaying(true)
    onVideoPlay?.()
  }

  const handleVideoPause = (e) => {
    e.stopPropagation()
    setIsVideoPlaying(false)
    onVideoPause?.()
  }

  const handleVideoError = (e) => {
    const video = e?.target
    let errorMessage = 'Video playback error'

    if (video?.error) {
      switch (video.error.code) {
        case 1:
          errorMessage = 'Video loading aborted'
          break
        case 2:
          errorMessage = 'Network error while loading video'
          break
        case 3:
          errorMessage = 'Video decoding failed (format may not be supported)'
          break
        case 4:
          errorMessage = 'Video format not supported by browser'
          break
        default:
          errorMessage = `Unknown video error (code: ${video.error.code})`
      }
    }

    console.error(`${errorMessage} - Project: ${project.name}`, {
      error: video?.error,
      currentSrc: video?.currentSrc,
      networkState: video?.networkState,
      readyState: video?.readyState,
    })

    onVideoError?.()
  }

  const toggleVideoPlayback = (event) => {
    event.stopPropagation()
    if (!videoRef.current) return

    if (isVideoPlaying) {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    } else {
      videoRef.current
        .play()
        .then(() => setIsVideoPlaying(true))
        .catch((error) => {
          console.error('Failed to toggle video playback:', error)
          onVideoError?.()
        })
    }
  }

  const startVideoManually = (event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    if (!videoRef.current) return

    setIsPlayButtonFading(true)

    videoRef.current
      .play()
      .then(() => {
        setIsVideoPlaying(true)
        // Wait for fade animation to complete
        setTimeout(() => {
          setIsPlayButtonFading(false)
        }, 300)
      })
      .catch((error) => {
        console.error('Video playback failed:', error)
        setIsPlayButtonFading(false)
        onVideoError?.()
      })
  }

  const handlePlayButtonTouch = (event) => {
    // Prevent click event from also firing on touch devices
    event.preventDefault()
    startVideoManually(event)
  }

  const getPlayButtonClassName = () => {
    const baseClass = 'video-play-overlay'

    if (isPlayButtonFading) {
      return `${baseClass} fading`
    }

    if (canAutoPlay && !isVideoPlaying) {
      return `${baseClass} fade-in`
    }

    return baseClass
  }

  const shouldShowPlayButton = !canAutoPlay || !isVideoPlaying

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className="sw-projects-thumbnail"
        poster={project.thumbnail}
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
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onClick={toggleVideoPlayback}
        style={{
          background: `url(${project.thumbnail}) center/cover no-repeat`,
        }}
      >
        {/* MP4 first for Safari iOS support */}
        {project.videoThumbnailMp4 && <source src={project.videoThumbnailMp4} type="video/mp4" />}
        {/* WebM as fallback for browsers that support it (smaller file size) */}
        {project.videoThumbnail && <source src={project.videoThumbnail} type="video/webm" />}
      </video>

      {shouldShowPlayButton && (
        <div
          className={getPlayButtonClassName()}
          onClick={startVideoManually}
          onTouchEnd={handlePlayButtonTouch}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              startVideoManually(e)
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Play video"
        >
          <div className="play-triangle" />
        </div>
      )}
    </div>
  )
}
