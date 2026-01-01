/**
 * Shared test constants used across multiple test files.
 * Centralizing these constants ensures consistency and makes updates easier.
 */

/**
 * Common user agent strings for browser detection testing.
 */
export const TEST_USER_AGENTS = {
  // Desktop browsers
  CHROME_DESKTOP: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",

  // Instagram browsers
  INSTAGRAM_IOS: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Instagram 195.0.0.31.123",
  INSTAGRAM_ANDROID: "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Instagram 195.0.0.31.123",
  INSTAGRAM_DESKTOP:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Instagram",

  // Facebook browsers
  FACEBOOK_IOS:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/325.0.0.41.114]",
  FACEBOOK_ANDROID:
    "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.120 Mobile Safari/537.36 [FBAV/325.0.0.41.114]",

  // Mobile Safari
  IOS_SAFARI:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1",
  IPAD_SAFARI:
    "Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
  IPOD_SAFARI:
    "Mozilla/5.0 (iPod touch; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",

  // Android Chrome
  ANDROID_CHROME:
    "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
} as const

/**
 * Common mock props for testing components.
 */
export const TEST_PROPS = {
  // Mock image data
  MOCK_IMG_SRC: "test-image.jpg",
  MOCK_ALT_TEXT: "Test Alt Text",

  // Mock dimensions
  MOCK_CLICK_X: 100,
  MOCK_CLICK_Y: 100,
} as const

/**
 * Common keyboard keys used in tests.
 */
export const TEST_KEYS = {
  ENTER: "Enter",
  ESCAPE: "Escape",
  SPACE: " ",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
} as const

/**
 * Arrow keys array for parameterized testing.
 */
export const ARROW_KEYS = [TEST_KEYS.ARROW_UP, TEST_KEYS.ARROW_DOWN, TEST_KEYS.ARROW_LEFT, TEST_KEYS.ARROW_RIGHT]

/**
 * Expected browser detection results for test scenarios.
 */
export interface BrowserDetectionResult {
  isInstagramBrowser: boolean
  isFacebookBrowser: boolean
  isIOSMobile: boolean
  isAndroidMobile: boolean
  isProblematicBrowser: boolean
}

/**
 * Predefined browser detection test cases.
 */
export const BROWSER_DETECTION_CASES = {
  CHROME_DESKTOP: {
    isInstagramBrowser: false,
    isFacebookBrowser: false,
    isIOSMobile: false,
    isAndroidMobile: false,
    isProblematicBrowser: false,
  },
  INSTAGRAM_IOS: {
    isInstagramBrowser: true,
    isFacebookBrowser: false,
    isIOSMobile: true,
    isAndroidMobile: false,
    isProblematicBrowser: true,
  },
  INSTAGRAM_ANDROID: {
    isInstagramBrowser: true,
    isFacebookBrowser: false,
    isIOSMobile: false,
    isAndroidMobile: true,
    isProblematicBrowser: true,
  },
  FACEBOOK_IOS: {
    isInstagramBrowser: false,
    isFacebookBrowser: true,
    isIOSMobile: true,
    isAndroidMobile: false,
    isProblematicBrowser: true,
  },
  FACEBOOK_ANDROID: {
    isInstagramBrowser: false,
    isFacebookBrowser: true,
    isIOSMobile: false,
    isAndroidMobile: true,
    isProblematicBrowser: true,
  },
  IOS_SAFARI: {
    isInstagramBrowser: false,
    isFacebookBrowser: false,
    isIOSMobile: true,
    isAndroidMobile: false,
    isProblematicBrowser: false,
  },
  ANDROID_CHROME: {
    isInstagramBrowser: false,
    isFacebookBrowser: false,
    isIOSMobile: false,
    isAndroidMobile: true,
    isProblematicBrowser: false,
  },
  INSTAGRAM_DESKTOP: {
    isInstagramBrowser: true,
    isFacebookBrowser: false,
    isIOSMobile: false,
    isAndroidMobile: false,
    isProblematicBrowser: false,
  },
}
