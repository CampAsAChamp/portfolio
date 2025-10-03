import React, { useRef, useState } from 'react';

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

    // Check if we're in Instagram browser
    const isInstagramBrowser = typeof navigator !== 'undefined' &&
        navigator.userAgent.includes('Instagram');

    const handleVideoPlay = (e) => {
        e.stopPropagation();
        setIsVideoPlaying(true);
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

    const startVideoManually = (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (!videoRef.current) return;

        // For Instagram browser, use simpler approach
        if (isInstagramBrowser) {
            videoRef.current.play()
                .then(() => {
                    setIsVideoPlaying(true);
                })
                .catch(() => {
                    onVideoError?.();
                });
            return;
        }

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

        // Simpler styling for Instagram browser
        if (isInstagramBrowser) {
            return `${baseClass} instagram-simple`;
        }

        if (isPlayButtonFading) {
            return `${baseClass} fading`;
        }

        if (canAutoPlay && !isVideoPlaying) {
            return `${baseClass} fade-in`;
        }

        return baseClass;
    };

    const shouldShowPlayButton = !canAutoPlay || !isVideoPlaying;

    return (
        <div className="video-container">
            <video
                ref={videoRef}
                className="sw-projects-thumbnail"
                src={project.videoThumbnail}
                poster={project.thumbnail}
                alt={project.name}
                title={project.name}
                autoPlay={canAutoPlay && !isInstagramBrowser}
                loop={canAutoPlay && !isInstagramBrowser}
                muted
                playsInline
                disablePictureInPicture
                controls={isInstagramBrowser ? true : false}
                preload="metadata"
                onError={handleVideoError}
                onLoadStart={(e) => e.stopPropagation()}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onClick={isInstagramBrowser ? undefined : toggleVideoPlayback}
                style={{
                    background: `url(${project.thumbnail}) center/cover no-repeat`
                }}
            />

            {shouldShowPlayButton && !isInstagramBrowser && (
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
