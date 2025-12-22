import App from '@/App'
import { render } from 'tests/utils'
import { describe, it } from 'vitest'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
  })
})
