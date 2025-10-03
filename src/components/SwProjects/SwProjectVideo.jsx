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
