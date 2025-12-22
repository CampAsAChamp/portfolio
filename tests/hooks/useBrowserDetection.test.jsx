import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useBrowserDetection } from 'hooks/useBrowserDetection'

describe('useBrowserDetection', () => {
  const originalUserAgent = navigator.userAgent

  beforeEach(() => {
    // Reset navigator.userAgent mock
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    })
  })

  it('should detect desktop Chrome browser', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      writable: true,
    })

    const { result } = renderHook(() => useBrowserDetection())

    expect(result.current.isInstagramBrowser).toBe(false)
    expect(result.current.isFacebookBrowser).toBe(false)
    expect(result.current.isIOSMobile).toBe(false)
    expect(result.current.isAndroidMobile).toBe(false)
    expect(result.current.isProblematicBrowser).toBe(false)
  })

  it('should detect Instagram browser on iOS', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Instagram 195.0.0.31.123',
      writable: true,
    })

    const { result } = renderHook(() => useBrowserDetection())

    expect(result.current.isInstagramBrowser).toBe(true)
    expect(result.current.isFacebookBrowser).toBe(false)
    expect(result.current.isIOSMobile).toBe(true)
    expect(result.current.isAndroidMobile).toBe(false)
    expect(result.current.isProblematicBrowser).toBe(true)
  })

  it('should detect Instagram browser on Android', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Instagram 195.0.0.31.123',
      writable: true,
    })

    const { result } = renderHook(() => useBrowserDetection())

    expect(result.current.isInstagramBrowser).toBe(true)
    expect(result.current.isFacebookBrowser).toBe(false)
    expect(result.current.isIOSMobile).toBe(false)
    expect(result.current.isAndroidMobile).toBe(true)
    expect(result.current.isProblematicBrowser).toBe(true)
  })

  it('should detect Facebook browser (FBAN) on iOS', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/325.0.0.41.114]',
      writable: true,
    })

    const { result } = renderHook(() => useBrowserDetection())

    expect(result.current.isInstagramBrowser).toBe(false)
    expect(result.current.isFacebookBrowser).toBe(true)
    expect(result.current.isIOSMobile).toBe(true)
    expect(result.current.isAndroidMobile).toBe(false)
    expect(result.current.isProblematicBrowser).toBe(true)
  })

  it('should detect Facebook browser (FBAV) on Android', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/91.0.4472.120 Mobile Safari/537.36 [FBAV/325.0.0.41.114]',
      writable: true,
    })

    const { result } = renderHook(() => useBrowserDetection())

    expect(result.current.isInstagramBrowser).toBe(false)
    expect(result.current.isFacebookBrowser).toBe(true)
    expect(result.current.isIOSMobile).toBe(false)
    expect(result.current.isAndroidMobile).toBe(true)
    expect(result.current.isProblematicBrowser).toBe(true)
  })

  it('should detect iOS Safari (not problematic)', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1',
      writable: true,
    })

    const { result } = renderHook(() => useBrowserDetection())

    expect(result.current.isInstagramBrowser).toBe(false)
    expect(result.current.isFacebookBrowser).toBe(false)
    expect(result.current.isIOSMobile).toBe(true)
    expect(result.current.isAndroidMobile).toBe(false)
    expect(result.current.isProblematicBrowser).toBe(false)
  })

  it('should detect Android Chrome (not problematic)', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
      writable: true,
    })

    const { result } = renderHook(() => useBrowserDetection())

    expect(result.current.isInstagramBrowser).toBe(false)
    expect(result.current.isFacebookBrowser).toBe(false)
    expect(result.current.isIOSMobile).toBe(false)
    expect(result.current.isAndroidMobile).toBe(true)
    expect(result.current.isProblematicBrowser).toBe(false)
  })

  it('should detect iPad', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      writable: true,
    })

    const { result } = renderHook(() => useBrowserDetection())

    expect(result.current.isIOSMobile).toBe(true)
    expect(result.current.isAndroidMobile).toBe(false)
  })

  it('should detect iPod', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (iPod touch; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      writable: true,
    })

    const { result } = renderHook(() => useBrowserDetection())

    expect(result.current.isIOSMobile).toBe(true)
    expect(result.current.isAndroidMobile).toBe(false)
  })

  it('should not flag Instagram on desktop as problematic', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Instagram',
      writable: true,
    })

    const { result } = renderHook(() => useBrowserDetection())

    expect(result.current.isInstagramBrowser).toBe(true)
    expect(result.current.isIOSMobile).toBe(false)
    expect(result.current.isAndroidMobile).toBe(false)
    expect(result.current.isProblematicBrowser).toBe(false)
  })
})
