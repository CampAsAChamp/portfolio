import { Locator, Page } from "@playwright/test"

import { pollForCondition } from "./wait-helpers"

/**
 * Helper functions for video testing with proper waits
 */

export enum VideoReadyState {
  HAVE_NOTHING = 0,
  HAVE_METADATA = 1,
  HAVE_CURRENT_DATA = 2,
  HAVE_FUTURE_DATA = 3,
  HAVE_ENOUGH_DATA = 4,
}

/**
 * Wait for video to be ready to play
 */
export async function waitForVideoReady(locator: Locator, minReadyState = VideoReadyState.HAVE_CURRENT_DATA): Promise<void> {
  await locator.evaluate((video: HTMLVideoElement, minState) => {
    return new Promise<void>((resolve, reject) => {
      if (video.readyState >= (minState as number)) {
        resolve()
        return
      }

      const onCanPlay = (): void => {
        if (video.readyState >= (minState as number)) {
          video.removeEventListener("canplay", onCanPlay)
          video.removeEventListener("error", onError)
          resolve()
        }
      }

      const onError = (): void => {
        video.removeEventListener("canplay", onCanPlay)
        video.removeEventListener("error", onError)
        reject(new Error("Video failed to load"))
      }

      video.addEventListener("canplay", onCanPlay)
      video.addEventListener("error", onError)

      // Safety timeout
      setTimeout(() => {
        video.removeEventListener("canplay", onCanPlay)
        video.removeEventListener("error", onError)
        resolve()
      }, 10000)
    })
  }, minReadyState)
}

/**
 * Check if video is playing
 */
export async function isVideoPlaying(locator: Locator): Promise<boolean> {
  return await locator.evaluate((video: HTMLVideoElement) => {
    return !video.paused && !video.ended && video.readyState >= 2
  })
}

/**
 * Check if video is paused
 */
export async function isVideoPaused(locator: Locator): Promise<boolean> {
  return await locator.evaluate((video: HTMLVideoElement) => {
    return video.paused
  })
}

/**
 * Get video ready state
 */
export async function getVideoReadyState(locator: Locator): Promise<number> {
  return await locator.evaluate((video: HTMLVideoElement) => {
    return video.readyState
  })
}

/**
 * Wait for video to start playing
 */
export async function waitForVideoPlaying(locator: Locator, timeout = 10000): Promise<void> {
  await pollForCondition(
    () => isVideoPlaying(locator),
    (playing) => playing === true,
    { timeout, interval: 200 },
  )
}

/**
 * Wait for video to pause
 */
export async function waitForVideoPaused(locator: Locator, timeout = 3000): Promise<void> {
  await pollForCondition(
    () => isVideoPaused(locator),
    (paused) => paused === true,
    { timeout, interval: 100 },
  )
}

/**
 * Check video attributes
 */
export async function getVideoAttributes(locator: Locator): Promise<{
  autoplay: boolean
  muted: boolean
  loop: boolean
  playsinline: boolean
  controls: boolean
}> {
  return await locator.evaluate((video: HTMLVideoElement) => {
    return {
      autoplay: video.hasAttribute("autoplay"),
      muted: video.muted,
      loop: video.loop,
      playsinline: video.hasAttribute("playsinline"),
      controls: video.controls,
    }
  })
}

/**
 * Play video programmatically
 */
export async function playVideo(locator: Locator): Promise<void> {
  await locator.evaluate((video: HTMLVideoElement) => {
    return video.play()
  })
}

/**
 * Pause video programmatically
 */
export async function pauseVideo(locator: Locator): Promise<void> {
  await locator.evaluate((video: HTMLVideoElement) => {
    video.pause()
  })
}

/**
 * Click a video via the DOM to avoid play-overlay / animation hit-target flakes.
 * Dispatches a bubbling MouseEvent so React's onClick handler runs reliably (incl. WebKit).
 */
export async function clickVideo(locator: Locator): Promise<void> {
  await locator.evaluate((video: HTMLVideoElement) => {
    video.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }))
  })
}

/**
 * Ensure the video is actually playing (handles WebKit headless autoplay quirks).
 * Fires the real play() API so media events sync React onPlay state.
 */
export async function ensureVideoPlaying(locator: Locator, timeout = 10000): Promise<void> {
  const deadline = Date.now() + timeout

  while (Date.now() < deadline) {
    try {
      await locator.evaluate(async (video: HTMLVideoElement) => {
        if (video.paused || video.ended) {
          await video.play()
        }
      })
      if (await isVideoPlaying(locator)) return
    } catch {
      // WebKit may AbortError play() when the element is briefly detached / interrupted.
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  await waitForVideoPlaying(locator, Math.max(0, deadline - Date.now()))
}

/**
 * Pause via the media element so React onPause runs even when overlay click is flaky.
 */
export async function ensureVideoPaused(locator: Locator, timeout = 5000): Promise<void> {
  await locator.evaluate((video: HTMLVideoElement) => {
    if (!video.paused) video.pause()
  })
  await waitForVideoPaused(locator, timeout)
}

/**
 * Disable play-overlay CSS animation so Playwright actions aren't blocked by pulse motion.
 * Also disables pointer-events so video clicks aren't intercepted by a fading overlay.
 */
export async function disablePlayOverlayAnimation(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      .video-play-overlay { animation: none !important; }
      .video-play-overlay.fading { pointer-events: none !important; }
    `,
  })
}

/**
 * Check if browser/context is Instagram in-app browser
 */
export async function isInstagramBrowser(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    return userAgent.includes("instagram")
  })
}

/**
 * Check if browser/context is Facebook in-app browser
 */
export async function isFacebookBrowser(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    return userAgent.includes("fbav") || userAgent.includes("fb_iab")
  })
}

/**
 * Simulate Instagram in-app browser by overriding navigator.userAgent before page load.
 * HTTP headers alone do not affect useBrowserDetection(), which reads navigator.userAgent.
 */
export async function setInstagramUserAgent(page: Page): Promise<void> {
  const instagramUserAgent =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 203.0.0.29.118"

  await page.addInitScript((userAgent) => {
    Object.defineProperty(navigator, "userAgent", {
      get: () => userAgent,
    })
  }, instagramUserAgent)
}

/**
 * Get video current time
 */
export async function getVideoCurrentTime(locator: Locator): Promise<number> {
  return await locator.evaluate((video: HTMLVideoElement) => {
    return video.currentTime
  })
}

/**
 * Get video duration
 */
export async function getVideoDuration(locator: Locator): Promise<number> {
  return await locator.evaluate((video: HTMLVideoElement) => {
    return video.duration
  })
}

/**
 * Check if video has loaded metadata
 */
export async function hasVideoMetadata(locator: Locator): Promise<boolean> {
  return await locator.evaluate((video: HTMLVideoElement) => {
    return video.readyState >= (VideoReadyState.HAVE_METADATA as number)
  })
}
