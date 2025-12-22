import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

// Mock localStorage for tests
const localStorageMock = {
  getItem: (key) => {
    return localStorageMock[key] || null
  },
  setItem: (key, value) => {
    localStorageMock[key] = value
  },
  removeItem: (key) => {
    delete localStorageMock[key]
  },
  clear: () => {
    Object.keys(localStorageMock).forEach((key) => {
      if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
        delete localStorageMock[key]
      }
    })
  },
}

global.localStorage = localStorageMock

// Mock matchMedia for theme detection
global.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
})

// Custom render function that wraps components with any necessary providers
const customRender = (ui, options) => {
  return render(ui, { ...options })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Override the default render with our custom one
export { customRender as render }
