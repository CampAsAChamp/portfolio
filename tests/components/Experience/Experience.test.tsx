import { render } from '@testing-library/react'
import { describe, it } from 'vitest'

import { Experience } from 'components/Experience/Experience'

describe('Experience', () => {
  it('renders without crashing', () => {
    render(<Experience />)
  })
})
