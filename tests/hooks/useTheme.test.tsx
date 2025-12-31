import React from 'react'

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTheme } from 'hooks/useTheme'

/**
 * Tests for the useTheme hook.
 *
 * Note: This test suite uses the "as unknown as typeof X" pattern for mocking browser APIs.
 * The first occurrence of each mock (matchMedia, startViewTransition) has detailed comments
 * explaining why this pattern is necessary. Subsequent uses follow the same pattern.
 */
describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('color-mode')
    vi.clearAllMocks()
  })

  it('should initialize with light theme by default', () => {
    /**
     * Mock window.matchMedia for testing media queries (like dark mode detection).
     *
     * The double type assertion "as unknown as typeof window.matchMedia" is necessary because:
     * 1. vi.fn().mockImplementation() returns a Vitest mock type
     * 2. window.matchMedia has a specific MediaQueryList return type
     * 3. Our mock only implements the properties we need (matches, media, addEventListener, removeEventListener)
     * 4. TypeScript won't allow direct assignment, so we cast through 'unknown' as an escape hatch
     *
     * This is a standard testing pattern - we provide a minimal mock that's sufficient for the test,
     * rather than implementing the entire MediaQueryList interface.
     */
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useTheme())

    expect(result.current.isDarkMode).toBe(false)
    expect(document.documentElement.getAttribute('color-mode')).toBe('light')
  })

  it('should initialize with dark theme from system preference', () => {
    // Mock matchMedia to return true (dark mode)
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useTheme())

    expect(result.current.isDarkMode).toBe(true)
    expect(document.documentElement.getAttribute('color-mode')).toBe('dark')
  })

  it('should initialize with theme from localStorage', () => {
    localStorage.setItem('color-mode', 'dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.isDarkMode).toBe(true)
    expect(document.documentElement.getAttribute('color-mode')).toBe('dark')
  })

  it('should toggle theme from light to dark without View Transitions API', () => {
    // Mock no View Transitions API support
    document.startViewTransition = undefined

    // Mock matchMedia to return false (light mode)
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useTheme())

    // Start in light mode
    expect(result.current.isDarkMode).toBe(false)

    // Toggle to dark
    act(() => {
      result.current.toggleTheme({ clientX: 100, clientY: 100 } as React.MouseEvent)
    })

    expect(result.current.isDarkMode).toBe(true)
    expect(document.documentElement.getAttribute('color-mode')).toBe('dark')
    expect(localStorage.getItem('color-mode')).toBe('dark')
  })

  it('should toggle theme from dark to light without View Transitions API', () => {
    localStorage.setItem('color-mode', 'dark')
    document.startViewTransition = undefined

    const { result } = renderHook(() => useTheme())

    // Start in dark mode
    expect(result.current.isDarkMode).toBe(true)

    // Toggle to light
    act(() => {
      result.current.toggleTheme({ clientX: 100, clientY: 100 } as React.MouseEvent)
    })

    expect(result.current.isDarkMode).toBe(false)
    expect(document.documentElement.getAttribute('color-mode')).toBe('light')
    expect(localStorage.getItem('color-mode')).toBe('light')
  })

  it('should toggle theme with View Transitions API', () => {
    /**
     * Mock document.startViewTransition for testing the View Transitions API.
     *
     * Note: This mock is incomplete - it's missing the full return type properties
     * (ready, updateCallbackDone, finished, skipTransition). It just returns Promise.resolve()
     * directly, which works for this test because the useTheme hook doesn't use those properties.
     *
     * The double type assertion "as unknown as typeof document.startViewTransition" allows us
     * to assign this simplified mock to the strictly-typed API. This is acceptable because
     * we know the mock is sufficient for the specific functionality being tested.
     */
    const mockTransition = vi.fn((callback: () => void) => {
      callback()
      return Promise.resolve()
    })
    document.startViewTransition = mockTransition as unknown as typeof document.startViewTransition

    // Mock matchMedia to return false (light mode)
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useTheme())

    // Toggle theme
    act(() => {
      result.current.toggleTheme({ clientX: 100, clientY: 200 } as React.MouseEvent)
    })

    expect(mockTransition).toHaveBeenCalled()
    expect(result.current.isDarkMode).toBe(true)
    expect(document.documentElement.style.getPropertyValue('--x')).toBe('100px')
    expect(document.documentElement.style.getPropertyValue('--y')).toBe('200px')
    expect(document.documentElement.style.getPropertyValue('--r')).toBeTruthy()
  })

  it('should set CSS custom properties for animation', () => {
    document.startViewTransition = vi.fn((callback: () => void) => {
      callback()
      return Promise.resolve()
    }) as unknown as typeof document.startViewTransition

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme({ clientX: 50, clientY: 75 } as React.MouseEvent)
    })

    expect(document.documentElement.style.getPropertyValue('--x')).toBe('50px')
    expect(document.documentElement.style.getPropertyValue('--y')).toBe('75px')
  })

  it('should set correct animation name matching the CSS keyframe', () => {
    document.startViewTransition = vi.fn((callback: () => void) => {
      callback()
      return Promise.resolve()
    }) as unknown as typeof document.startViewTransition

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme({ clientX: 100, clientY: 100 } as React.MouseEvent)
    })

    // Verify the animation name matches the CSS keyframe name (reveal-theme)
    // This prevents regressions where the JS uses 'revealTheme' but CSS has 'reveal-theme'
    expect(document.documentElement.style.getPropertyValue('--theme-transition-animation')).toBe('reveal-theme')
  })

  it('should persist theme across multiple toggles', () => {
    document.startViewTransition = undefined

    // Mock matchMedia to return false (light mode)
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia

    const { result } = renderHook(() => useTheme())

    // Toggle multiple times
    act(() => {
      result.current.toggleTheme({ clientX: 0, clientY: 0 } as React.MouseEvent)
    })
    expect(result.current.isDarkMode).toBe(true)

    act(() => {
      result.current.toggleTheme({ clientX: 0, clientY: 0 } as React.MouseEvent)
    })
    expect(result.current.isDarkMode).toBe(false)

    act(() => {
      result.current.toggleTheme({ clientX: 0, clientY: 0 } as React.MouseEvent)
    })
    expect(result.current.isDarkMode).toBe(true)

    expect(localStorage.getItem('color-mode')).toBe('dark')
  })
})
