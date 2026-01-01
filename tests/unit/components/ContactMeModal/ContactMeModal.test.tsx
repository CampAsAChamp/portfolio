import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ContactMeModal } from 'components/ContactMeModal/ContactMeModal'

describe('ContactMeModal', () => {
  let mockClose: () => void

  beforeEach(() => {
    mockClose = vi.fn()
    render(<ContactMeModal isOpen={true} close={mockClose} />)
  })

  it('renders when isOpen is true', () => {
    expect(screen.getByText("Let's Connect!")).toBeInTheDocument()
    expect(screen.getByText("I'd love to hear from you")).toBeInTheDocument()
  })

  it('displays email link', () => {
    const emailLink = screen.getByRole('link', { name: /nickschneider101@gmail.com/i })
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:nickschneider101@gmail.com')
  })

  it('displays social links', () => {
    const githubLink = screen.getByRole('link', { name: /GitHub Profile/i })
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute('href', 'https://github.com/CampAsAChamp/')

    const linkedInLink = screen.getByRole('link', { name: /LinkedIn Profile/i })
    expect(linkedInLink).toBeInTheDocument()
    expect(linkedInLink).toHaveAttribute('href', 'https://www.linkedin.com/in/nick-schneider-swe/')
  })

  it('calls close when close button is clicked', () => {
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it('calls close when background is clicked', () => {
    const background = screen.getByRole('button', { name: /Close modal/i })
    fireEvent.click(background)

    expect(mockClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when modal content is clicked', () => {
    const modalContent = document.getElementById('contact-me-modal-content')
    expect(modalContent).toBeTruthy()
    fireEvent.click(modalContent!)

    expect(mockClose).not.toHaveBeenCalled()
  })
})
