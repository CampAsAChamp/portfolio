import { useState } from 'react'

/**
 * Custom hook for detecting browser environment and user agent information
 * @returns {{
 *   isInstagramBrowser: boolean,
 *   isFacebookBrowser: boolean,
 *   isIOSMobile: boolean,
 *   isAndroidMobile: boolean,
 *   isProblematicBrowser: boolean
 * }}
 */
export function useBrowserDetection() {
  const [browserInfo] = useState(() => {
    const userAgent = navigator.userAgent
    const isInstagram = userAgent.includes('Instagram')
    const isFacebook = userAgent.includes('FBAN') || userAgent.includes('FBAV')
    const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    const isAndroid = /Android/.test(userAgent)

    // Problematic browsers are in-app browsers on mobile devices
    const isProblematic = (isInstagram || isFacebook) && (isIOS || isAndroid)

    return {
      isInstagramBrowser: isInstagram,
      isFacebookBrowser: isFacebook,
      isIOSMobile: isIOS,
      isAndroidMobile: isAndroid,
      isProblematicBrowser: isProblematic,
    }
  })

  return browserInfo
}
