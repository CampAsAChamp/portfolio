import { render } from 'tests/utils'
import { describe, it } from 'vitest'

import { Experience } from 'components/Experience/Experience'

describe('Experience', () => {
  it('renders without crashing', () => {
    render(<Experience />)
  })
})
