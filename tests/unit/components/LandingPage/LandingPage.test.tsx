import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { LandingPage } from 'components/LandingPage/LandingPage'

describe('LandingPage', () => {
  beforeEach(() => {
    render(<LandingPage />)
  })

  it('renders without crashing', () => {
    expect(screen.getByRole('heading', { name: /NICK/i })).toBeInTheDocument()
  })

  it('displays the name', () => {
    expect(screen.getByRole('heading', { name: /NICK/i })).toBeInTheDocument()
  })

  it('displays the contact me button', () => {
    expect(screen.getByRole('button', { name: /Contact Me/i })).toBeInTheDocument()
  })
})
