import React from 'react'

// Note: This must be a class component because React error boundaries
// require componentDidCatch and getDerivedStateFromError lifecycle methods,
// which are not available as hooks. This is the only intentional exception
// to the functional components rule.
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            textAlign: 'center',
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-body-text)',
          }}
        >
          <h1 style={{ fontSize: '48px', marginBottom: '20px', color: 'var(--color-purple)' }}>Oops!</h1>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Something went wrong</h2>
          <p style={{ fontSize: '16px', marginBottom: '30px', maxWidth: '600px' }}>
            We&apos;re sorry for the inconvenience. Please try refreshing the page, or come back later.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: 'var(--color-purple)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--rounded-button-corners-size)',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 4px 12px rgba(108, 99, 255, 0.4)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
            onFocus={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 4px 12px rgba(108, 99, 255, 0.4)'
            }}
            onBlur={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = 'none'
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '40px', textAlign: 'left', maxWidth: '800px' }}>
              <summary style={{ cursor: 'pointer', fontSize: '14px', marginBottom: '10px' }}>Error Details (dev only)</summary>
              <pre
                style={{
                  backgroundColor: '#f5f5f5',
                  padding: '15px',
                  borderRadius: '8px',
                  overflow: 'auto',
                  fontSize: '12px',
                }}
              >
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
