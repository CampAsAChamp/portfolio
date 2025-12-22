import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTheme } from 'hooks/useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('color-mode')
    vi.clearAllMocks()
  })

  it('should initialize with light theme by default', () => {
    // Mock matchMedia to return false (light mode)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => useTheme())

    expect(result.current.isDarkMode).toBe(false)
    expect(document.documentElement.getAttribute('color-mode')).toBe('light')
  })

  it('should initialize with dark theme from system preference', () => {
    // Mock matchMedia to return true (dark mode)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

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
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => useTheme())

    // Start in light mode
    expect(result.current.isDarkMode).toBe(false)

    // Toggle to dark
    act(() => {
      result.current.toggleTheme({ clientX: 100, clientY: 100 })
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
      result.current.toggleTheme({ clientX: 100, clientY: 100 })
    })

    expect(result.current.isDarkMode).toBe(false)
    expect(document.documentElement.getAttribute('color-mode')).toBe('light')
    expect(localStorage.getItem('color-mode')).toBe('light')
  })

  it('should toggle theme with View Transitions API', () => {
    // Mock View Transitions API
    const mockTransition = vi.fn((callback) => {
      callback()
      return Promise.resolve()
    })
    document.startViewTransition = mockTransition

    // Mock matchMedia to return false (light mode)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => useTheme())

    // Toggle theme
    act(() => {
      result.current.toggleTheme({ clientX: 100, clientY: 200 })
    })

    expect(mockTransition).toHaveBeenCalled()
    expect(result.current.isDarkMode).toBe(true)
    expect(document.documentElement.style.getPropertyValue('--x')).toBe('100px')
    expect(document.documentElement.style.getPropertyValue('--y')).toBe('200px')
    expect(document.documentElement.style.getPropertyValue('--r')).toBeTruthy()
  })

  it('should set CSS custom properties for animation', () => {
    document.startViewTransition = vi.fn((callback) => {
      callback()
      return Promise.resolve()
    })

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme({ clientX: 50, clientY: 75 })
    })

    expect(document.documentElement.style.getPropertyValue('--x')).toBe('50px')
    expect(document.documentElement.style.getPropertyValue('--y')).toBe('75px')
  })

  it('should persist theme across multiple toggles', () => {
    document.startViewTransition = undefined

    // Mock matchMedia to return false (light mode)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const { result } = renderHook(() => useTheme())

    // Toggle multiple times
    act(() => {
      result.current.toggleTheme({ clientX: 0, clientY: 0 })
    })
    expect(result.current.isDarkMode).toBe(true)

    act(() => {
      result.current.toggleTheme({ clientX: 0, clientY: 0 })
    })
    expect(result.current.isDarkMode).toBe(false)

    act(() => {
      result.current.toggleTheme({ clientX: 0, clientY: 0 })
    })
    expect(result.current.isDarkMode).toBe(true)

    expect(localStorage.getItem('color-mode')).toBe('dark')
  })
})
