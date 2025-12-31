import { render, screen } from 'tests/utils'
import { describe, expect, it } from 'vitest'

import { AboutMe } from 'components/AboutMe/AboutMe'

describe('AboutMe', () => {
  it('renders without crashing', () => {
    render(<AboutMe />)
  })

  it('displays the About Me header', () => {
    render(<AboutMe />)
    expect(screen.getByText(/ABOUT ME/i)).toBeInTheDocument()
  })
})
