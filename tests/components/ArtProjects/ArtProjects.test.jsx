import { describe, it } from 'vitest'

import { ArtProjects } from '../../../src/components/ArtProjects/ArtProjects'
import { render } from '../../test-utils'

describe('ArtProjects', () => {
  it('renders without crashing', () => {
    render(<ArtProjects />)
  })
})
