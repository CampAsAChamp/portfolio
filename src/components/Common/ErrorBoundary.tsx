import React, { ReactNode } from "react"

import "styles/Common/ErrorBoundary.css"

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

// Note: This must be a class component because React error boundaries
// require componentDidCatch and getDerivedStateFromError lifecycle methods,
// which are not available as hooks. This is the only intentional exception
// to the functional components rule.
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by boundary:", error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  private renderErrorUI(): ReactNode {
    return (
      <div className="error-boundary-container">
        <h1 className="error-boundary-title">Oops!</h1>
        <h2 className="error-boundary-subtitle">Something went wrong</h2>
        <p className="error-boundary-message">
          We&apos;re sorry for the inconvenience. Please try refreshing the page, or come back later.
        </p>
        <button className="error-boundary-button" onClick={() => window.location.reload()}>
          Refresh Page
        </button>
        {this.renderErrorDetails()}
      </div>
    )
  }

  private renderErrorDetails(): ReactNode {
    // Show detailed error info only in development mode (import.meta.env.DEV is Vite's boolean for dev mode)
    if (!import.meta.env.DEV || !this.state.error) {
      return null
    }

    return (
      <details className="error-boundary-details">
        <summary className="error-boundary-summary">Error Details (dev only)</summary>
        <pre className="error-boundary-pre">
          {this.state.error.toString()}
          {"\n\n"}
          {this.state.errorInfo?.componentStack}
        </pre>
      </details>
    )
  }

  render(): ReactNode {
    // If no error, render children normally (e.g., <App />, <Routes />, or any component tree wrapped by this boundary)
    // If error occurred, show the error UI instead
    return this.state.hasError ? this.renderErrorUI() : this.props.children
  }
}
