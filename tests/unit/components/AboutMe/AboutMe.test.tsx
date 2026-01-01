import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { AboutMe } from 'components/AboutMe/AboutMe'

describe('AboutMe', () => {
  beforeEach(() => {
    render(<AboutMe />)
  })

  it('renders without crashing', () => {
    expect(screen.getByText(/ABOUT ME/i)).toBeInTheDocument()
  })

  it('displays the About Me header', () => {
    expect(screen.getByText(/ABOUT ME/i)).toBeInTheDocument()
  })
})
