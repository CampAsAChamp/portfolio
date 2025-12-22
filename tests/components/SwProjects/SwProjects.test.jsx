import { describe, it } from 'vitest'

import { SWProjects } from '../../../src/components/SwProjects/SwProjects'
import { render } from '../../test-utils'

describe('SWProjects', () => {
  it('renders without crashing', () => {
    render(<SWProjects />)
  })
})
