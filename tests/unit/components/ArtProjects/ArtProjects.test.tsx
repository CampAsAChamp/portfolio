import { render } from '@testing-library/react'
import { describe, it } from 'vitest'

import { ArtProjects } from 'components/ArtProjects/ArtProjects'

describe('ArtProjects', () => {
  it('renders without crashing', () => {
    render(<ArtProjects />)
  })
})
