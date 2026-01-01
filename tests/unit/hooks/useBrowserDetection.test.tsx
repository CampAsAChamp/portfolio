import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useBrowserDetection } from 'hooks/useBrowserDetection'

import { BROWSER_DETECTION_CASES, BrowserDetectionResult, TEST_USER_AGENTS } from '../helpers/constants'
import { mockUserAgent } from '../helpers/mocks'

describe('useBrowserDetection', () => {
  const originalUserAgent = navigator.userAgent

  beforeEach(() => {
    // Reset navigator.userAgent to original
    mockUserAgent(originalUserAgent)
  })

  /**
   * Helper function to test user agent detection.
   * Reduces duplication by centralizing the test logic.
   */
  function testUserAgentDetection(testName: string, userAgent: string, expected: BrowserDetectionResult): void {
    it(testName, () => {
      mockUserAgent(userAgent)
      const { result } = renderHook(() => useBrowserDetection())

      expect(result.current.isInstagramBrowser).toBe(expected.isInstagramBrowser)
      expect(result.current.isFacebookBrowser).toBe(expected.isFacebookBrowser)
      expect(result.current.isIOSMobile).toBe(expected.isIOSMobile)
      expect(result.current.isAndroidMobile).toBe(expected.isAndroidMobile)
      expect(result.current.isProblematicBrowser).toBe(expected.isProblematicBrowser)
    })
  }

  // Test all major browser scenarios using the helper
  testUserAgentDetection('should detect desktop Chrome browser', TEST_USER_AGENTS.CHROME_DESKTOP, BROWSER_DETECTION_CASES.CHROME_DESKTOP)

  testUserAgentDetection('should detect Instagram browser on iOS', TEST_USER_AGENTS.INSTAGRAM_IOS, BROWSER_DETECTION_CASES.INSTAGRAM_IOS)

  testUserAgentDetection(
    'should detect Instagram browser on Android',
    TEST_USER_AGENTS.INSTAGRAM_ANDROID,
    BROWSER_DETECTION_CASES.INSTAGRAM_ANDROID,
  )

  testUserAgentDetection(
    'should detect Facebook browser (FBAN) on iOS',
    TEST_USER_AGENTS.FACEBOOK_IOS,
    BROWSER_DETECTION_CASES.FACEBOOK_IOS,
  )

  testUserAgentDetection(
    'should detect Facebook browser (FBAV) on Android',
    TEST_USER_AGENTS.FACEBOOK_ANDROID,
    BROWSER_DETECTION_CASES.FACEBOOK_ANDROID,
  )

  testUserAgentDetection('should detect iOS Safari (not problematic)', TEST_USER_AGENTS.IOS_SAFARI, BROWSER_DETECTION_CASES.IOS_SAFARI)

  testUserAgentDetection(
    'should detect Android Chrome (not problematic)',
    TEST_USER_AGENTS.ANDROID_CHROME,
    BROWSER_DETECTION_CASES.ANDROID_CHROME,
  )

  testUserAgentDetection(
    'should not flag Instagram on desktop as problematic',
    TEST_USER_AGENTS.INSTAGRAM_DESKTOP,
    BROWSER_DETECTION_CASES.INSTAGRAM_DESKTOP,
  )

  // Additional device-specific tests
  it('should detect iPad', () => {
    mockUserAgent(TEST_USER_AGENTS.IPAD_SAFARI)
    const { result } = renderHook(() => useBrowserDetection())

    expect(result.current.isIOSMobile).toBe(true)
    expect(result.current.isAndroidMobile).toBe(false)
  })

  it('should detect iPod', () => {
    mockUserAgent(TEST_USER_AGENTS.IPOD_SAFARI)
    const { result } = renderHook(() => useBrowserDetection())

    expect(result.current.isIOSMobile).toBe(true)
    expect(result.current.isAndroidMobile).toBe(false)
  })
})
