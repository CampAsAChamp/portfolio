import { describe, expect, it } from 'vitest'

import { Navbar } from '../../../src/components/NavBar/Navbar'
import { render, screen } from '../../test-utils'

describe('Navbar', () => {
  it('renders without crashing', () => {
    render(<Navbar />)
  })

  it('displays navigation links', () => {
    render(<Navbar />)
    expect(screen.getByText(/About Me/i)).toBeInTheDocument()
    expect(screen.getByText(/Experience/i)).toBeInTheDocument()
    expect(screen.getByText(/Skills/i)).toBeInTheDocument()
    expect(screen.getByText(/Projects/i)).toBeInTheDocument()
    expect(screen.getByText(/Art & Design/i)).toBeInTheDocument()
  })
})
