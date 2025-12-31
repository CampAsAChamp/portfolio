import { render } from '@testing-library/react'
import { describe, it } from 'vitest'

import { SWProjects } from 'components/SwProjects/SwProjects'

describe('SWProjects', () => {
  it('renders without crashing', () => {
    render(<SWProjects />)
  })
})
