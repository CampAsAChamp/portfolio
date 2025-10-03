import React, { useEffect, useRef, useState } from 'react';

export function SwProjectVideo({
    project,
    canAutoPlay,
    onVideoPlay,
    onVideoPause,
    onVideoError
}) {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [isPlayButtonFading, setIsPlayButtonFading] = useState(false);
    const videoRef = useRef(null);

    // Handle Instagram browser specific behavior
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Additional event listeners for Instagram browser compatibility
        const handleTimeUpdate = () => {
            if (video.currentTime > 0 && !video.paused) {
                setIsVideoPlaying(true);
                setIsPlayButtonFading(false);
            }
        };

        const handleWaiting = () => {
            // Video is buffering, keep play button hidden if it was playing
            if (isVideoPlaying) {
                setIsPlayButtonFading(false);
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('waiting', handleWaiting);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('waiting', handleWaiting);
        };
    }, [isVideoPlaying]);

    const handleVideoPlay = (e) => {
        e.stopPropagation();
        setIsVideoPlaying(true);
        // Ensure play button is hidden when video starts playing
        setIsPlayButtonFading(false);
        onVideoPlay?.();
    };

    const handleVideoPause = (e) => {
        e.stopPropagation();
        setIsVideoPlaying(false);
        onVideoPause?.();
    };

    const handleVideoError = () => {
        onVideoError?.();
    };

    const toggleVideoPlayback = (event) => {
        event.stopPropagation();
        if (!videoRef.current) return;

        if (isVideoPlaying) {
            videoRef.current.pause();
            setIsVideoPlaying(false);
        } else {
            videoRef.current.play()
                .then(() => setIsVideoPlaying(true))
                .catch(() => onVideoError?.());
        }
    };

    const startVideoManually = () => {
        if (!videoRef.current) return;

        setIsPlayButtonFading(true);

        videoRef.current.play()
            .then(() => {
                setIsVideoPlaying(true);
                // Wait for fade animation to complete
                setTimeout(() => {
                    setIsPlayButtonFading(false);
                }, 300);
            })
            .catch(() => {
                setIsPlayButtonFading(false);
                onVideoError?.();
            });
    };

    const getPlayButtonClassName = () => {
        const baseClass = 'video-play-overlay';

        // Force hide button when video is playing (especially for Instagram browser)
        if (isVideoPlaying) {
            return `${baseClass} hidden`;
        }

        if (isPlayButtonFading) {
            return `${baseClass} fading`;
        }

        if (canAutoPlay && !isVideoPlaying) {
            return `${baseClass} fade-in`;
        }

        return baseClass;
    };

    // Fix play button visibility logic for Instagram browser
    // Show play button only when autoplay is disabled AND video is not playing
    const shouldShowPlayButton = !canAutoPlay && !isVideoPlaying;

    return (
        <div className="video-container">
            <video
                ref={videoRef}
                className="sw-projects-thumbnail"
                src={project.videoThumbnail}
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
                    background: `url(${project.thumbnail}) center/cover no-repeat`
                }}
            />

            {shouldShowPlayButton && (
                <div
                    className={getPlayButtonClassName()}
                    onClick={startVideoManually}
                >
                    <div className="play-triangle" />
                </div>
            )}
        </div>
    );
}
