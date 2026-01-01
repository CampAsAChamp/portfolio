import App from '@/App'
import { render } from '@testing-library/react'
import { describe, it } from 'vitest'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
  })
})
