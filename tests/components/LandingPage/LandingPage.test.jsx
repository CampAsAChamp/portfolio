import { describe, expect, it } from 'vitest'

import { LandingPage } from '../../../src/components/LandingPage/LandingPage'
import { render, screen } from '../../test-utils'

describe('LandingPage', () => {
  it('renders without crashing', () => {
    render(<LandingPage />)
  })

  it('displays the name', () => {
    render(<LandingPage />)
    expect(screen.getByRole('heading', { name: /NICK/i })).toBeInTheDocument()
  })

  it('displays the contact me button', () => {
    render(<LandingPage />)
    expect(screen.getByRole('button', { name: /Contact Me/i })).toBeInTheDocument()
  })
})
