import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { Navbar } from 'components/NavBar/Navbar'

describe('Navbar', () => {
  beforeEach(() => {
    render(<Navbar />)
  })

  it('renders without crashing', () => {
    expect(screen.getByText(/About Me/i)).toBeInTheDocument()
  })

  it('displays navigation links', () => {
    expect(screen.getByText(/About Me/i)).toBeInTheDocument()
    expect(screen.getByText(/Experience/i)).toBeInTheDocument()
    expect(screen.getByText(/Skills/i)).toBeInTheDocument()
    expect(screen.getByText(/Projects/i)).toBeInTheDocument()
    expect(screen.getByText(/Art & Design/i)).toBeInTheDocument()
  })
})
