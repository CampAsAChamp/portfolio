import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock react-inlinesvg to avoid async warnings in tests
vi.mock('react-inlinesvg', () => ({
  default: ({ src, alt, title, ...props }: { src: string; alt?: string; title?: string; [key: string]: unknown }) => {
    return <svg data-src={src} aria-label={alt || title} {...props} />
  },
}))

/**
 * Type definition for localStorage mock used in tests.
 *
 * This interface allows the mock to store both:
 * 1. Data as string key-value pairs (simulating stored items)
 * 2. Methods for interacting with the mock (getItem, setItem, removeItem, clear)
 *
 * The index signature uses a union type to allow both stored data and method signatures.
 * This is necessary because the mock object stores data directly as properties (e.g., mock['theme'] = 'dark')
 * while also providing the standard localStorage API methods.
 */
interface LocalStorageMockType {
  [key: string]:
    | string // Stored data values
    | ((key: string) => string | null) // getItem signature
    | ((key: string, value: string) => void) // setItem signature
    | ((key: string) => void) // removeItem signature
    | (() => void) // clear signature
}

const localStorageMock: LocalStorageMockType = {
  getItem: (key: string): string | null => {
    const value = localStorageMock[key]
    return typeof value === 'string' ? value : null
  },
  setItem: (key: string, value: string): void => {
    localStorageMock[key] = value
  },
  removeItem: (key: string): void => {
    delete localStorageMock[key]
  },
  clear: (): void => {
    Object.keys(localStorageMock).forEach((key) => {
      if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
        delete localStorageMock[key]
      }
    })
  },
}

/**
 * Assign our localStorage mock to the global object for test environment.
 *
 * What this does:
 * - Replaces the global localStorage with our mock implementation
 * - Makes localStorage available in all tests without explicit setup
 * - Allows tests to use localStorage.getItem(), setItem(), etc. like in a browser
 *
 * Why we use 'any':
 * - The 'global' object in Node.js test environments doesn't have TypeScript types for browser APIs
 * - TypeScript doesn't know that we can add browser properties (like localStorage) to the Node.js global
 * - Casting to 'any' bypasses TypeScript's type checking, allowing us to dynamically add this property
 * - This is acceptable in test setup files where we're intentionally bridging Node.js and browser environments
 *
 * The eslint-disable comment suppresses warnings about using 'any' since it's intentional here.
 * Defensive semicolon: The leading ';' prevents ASI issues when a line starts with '('.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
;(global as any).localStorage = localStorageMock as Storage

/**
 * Assign a matchMedia mock to the global object for testing media queries.
 *
 * What this does:
 * - Provides a mock implementation of window.matchMedia for tests
 * - Allows components to check for media queries (like dark mode: prefers-color-scheme)
 * - Returns a minimal MediaQueryList with matches=false by default (light mode)
 *
 * Why we use 'any':
 * - Same reason as localStorage above - Node.js global doesn't have browser API types
 * - We need to add window.matchMedia to the test environment, which doesn't exist in Node.js
 * - Casting to 'any' allows us to dynamically add this browser API to the global object
 *
 * The eslint-disable comment suppresses warnings about using 'any' since it's intentional here.
 * Defensive semicolon: The leading ';' prevents ASI issues when a line starts with '('.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
;(global as any).matchMedia = (query: string): MediaQueryList =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList

/**
 * Note: This file previously contained a custom render wrapper, but it was removed
 * since it didn't provide any actual wrapping (no providers, contexts, etc.).
 *
 * Test files should now import directly from '@testing-library/react' instead of 'tests/utils'.
 * This file remains for the global test setup (localStorage mock, matchMedia mock, etc.).
 */
