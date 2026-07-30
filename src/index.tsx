import React from "react"
import ReactDOM from "react-dom/client"
import { bootstrapScrollRestore } from "utils/scrollRestoration"

import { App } from "./App"
import { ErrorBoundary } from "./components/Common/ErrorBoundary"

bootstrapScrollRestore()

// Initialize theme before React renders to prevent flash of wrong theme
const COLOR_MODE_KEY = "color-mode"
const getInitialTheme = (): string => {
  const localStorageTheme = localStorage.getItem(COLOR_MODE_KEY)
  if (!localStorageTheme) {
    const osDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    return osDarkTheme ? "dark" : "light"
  }
  return localStorageTheme
}
document.documentElement.setAttribute(COLOR_MODE_KEY, getInitialTheme())

const rootElement = document.getElementById("root")
if (!rootElement) {
  throw new Error("Root element not found")
}

const root = ReactDOM.createRoot(rootElement)
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

/** Hide the static LCP prerender shell once React has painted the real landing page. */
function markAppReady(): void {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add("react-ready")
    })
  })
}

markAppReady()
