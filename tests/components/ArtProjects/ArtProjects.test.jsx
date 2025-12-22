import { render } from 'tests/utils'
import { describe, it } from 'vitest'

import { ArtProjects } from 'components/ArtProjects/ArtProjects'

describe('ArtProjects', () => {
  it('renders without crashing', () => {
    render(<ArtProjects />)
  })
})
