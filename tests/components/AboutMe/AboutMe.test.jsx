import { describe, expect, it } from 'vitest'

import { AboutMe } from '../../../src/components/AboutMe/AboutMe'
import { render, screen } from '../../test-utils'

describe('AboutMe', () => {
  it('renders without crashing', () => {
    render(<AboutMe />)
  })

  it('displays the About Me header', () => {
    render(<AboutMe />)
    expect(screen.getByText(/ABOUT ME/i)).toBeInTheDocument()
  })
})
