import { describe, it } from 'vitest'

import { Experience } from '../../../src/components/Experience/Experience'
import { render } from '../../test-utils'

describe('Experience', () => {
  it('renders without crashing', () => {
    render(<Experience />)
  })
})
