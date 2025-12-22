import { describe, it } from 'vitest'

import App from '../src/App'
import { render } from './test-utils'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
  })
})
