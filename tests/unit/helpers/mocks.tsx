import React from "react"
import { vi } from "vitest"

/**
 * Mock functions for testing browser APIs and DOM behaviors.
 */

/**
 * Creates a mock KeyboardEvent for testing keyboard interactions.
 *
 * @param key - The key that was pressed (e.g., 'Enter', 'Escape', ' ')
 * @param additionalProps - Additional properties to merge into the event
 * @returns A mock KeyboardEvent object
 */
export function createKeyboardEvent(
  key: string,
  additionalProps: Partial<React.KeyboardEvent<Element>> = {},
): React.KeyboardEvent<Element> {
  return {
    key,
    preventDefault: vi.fn(),
    ...additionalProps,
  } as unknown as React.KeyboardEvent<Element>
}

/**
 * Creates a mock MouseEvent for testing click interactions.
 *
 * @param clientX - The X coordinate of the mouse click
 * @param clientY - The Y coordinate of the mouse click
 * @param additionalProps - Additional properties to merge into the event
 * @returns A mock MouseEvent object
 */
export function createMouseEvent(
  clientX = 0,
  clientY = 0,
  additionalProps: Partial<React.MouseEvent<Element>> = {},
): React.MouseEvent<Element> {
  return {
    clientX,
    clientY,
    ...additionalProps,
  } as React.MouseEvent<Element>
}

/**
 * Mocks document.startViewTransition for testing the View Transitions API.
 *
 * This creates a complete mock with all required properties (ready, updateCallbackDone,
 * finished, skipTransition) that the API expects.
 *
 * @param callback - Optional callback to execute when startViewTransition is called
 * @returns The mock function (useful for assertions)
 */
export function mockStartViewTransition(callback?: (updateCallback: () => void) => void): ReturnType<typeof vi.fn> {
  const mockFn = vi.fn((updateCallback: () => void) => {
    if (callback) {
      callback(updateCallback)
    } else {
      updateCallback()
    }
    return {
      ready: Promise.resolve(),
      updateCallbackDone: Promise.resolve(),
      finished: Promise.resolve(),
      skipTransition: (): void => {},
    }
  })

  document.startViewTransition = mockFn as unknown as typeof document.startViewTransition
  return mockFn
}

/**
 * Mocks window.matchMedia for testing media queries (like dark mode detection).
 *
 * @param matches - Whether the media query should match (default: false)
 * @returns The mock function (useful for assertions)
 */
export function mockMatchMedia(matches = false): ReturnType<typeof vi.fn> {
  const mockFn = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  window.matchMedia = mockFn as unknown as typeof window.matchMedia
  return mockFn
}

/**
 * Mocks navigator.userAgent for browser detection testing.
 *
 * @param userAgentString - The user agent string to use
 */
export function mockUserAgent(userAgentString: string): void {
  Object.defineProperty(navigator, "userAgent", {
    value: userAgentString,
    writable: true,
    configurable: true,
  })
}

/**
 * Sets up common mocks needed for modal testing.
 * This includes View Transitions API and cleaning up modal-related DOM state.
 */
export function setupModalMocks(): void {
  // Clean up any existing modal classes
  document.body.classList.remove("art-modal-open")

  // Mock startViewTransition if not available
  if (!document.startViewTransition) {
    mockStartViewTransition()
  }
}

/**
 * Sets up common browser API mocks (matchMedia and startViewTransition).
 * Useful for hooks that depend on these APIs.
 *
 * @param matchesMediaQuery - Whether matchMedia should return matches: true (default: false)
 */
export function setupBrowserMocks(matchesMediaQuery = false): void {
  mockMatchMedia(matchesMediaQuery)
  mockStartViewTransition()
}
