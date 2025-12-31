import { ReactElement } from 'react'

import '@testing-library/jest-dom'
import { RenderOptions, RenderResult, render } from '@testing-library/react'
import { vi } from 'vitest'

// Mock react-inlinesvg to avoid async warnings in tests
vi.mock('react-inlinesvg', () => ({
  default: ({ src, alt, title, ...props }: { src: string; alt?: string; title?: string; [key: string]: unknown }) => {
    return <svg data-src={src} aria-label={alt || title} {...props} />
  },
}))

// Mock localStorage for tests
interface LocalStorageMockType {
  [key: string]: string | ((key: string) => string | null) | ((key: string, value: string) => void) | ((key: string) => void) | (() => void)
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
;(global as any).localStorage = localStorageMock as Storage

// Mock matchMedia for theme detection
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

// Custom render function that wraps components with any necessary providers
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>): RenderResult => {
  return render(ui, { ...options })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Override the default render with our custom one
export { customRender as render }
