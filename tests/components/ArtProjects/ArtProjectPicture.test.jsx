import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ArtProjectPicture } from 'components/ArtProjects/ArtProjectPicture'

describe('ArtProjectPicture', () => {
  const mockImgSrc = 'test-image.jpg'
  const mockAltText = 'Test Art Project'

  beforeEach(() => {
    // Clean up any existing modal classes
    document.body.classList.remove('art-modal-open')

    // Mock document.startViewTransition for browsers that don't support it
    if (!document.startViewTransition) {
      document.startViewTransition = vi.fn((callback) => {
        callback()
        return {
          ready: Promise.resolve(),
          updateCallbackDone: Promise.resolve(),
          finished: Promise.resolve(),
        }
      })
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders without crashing', () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)
  })

  it('displays the thumbnail image', () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)
    const thumbnails = screen.getAllByAltText(mockAltText)
    const thumbnail = thumbnails.find((img) => img.classList.contains('art-grid-img'))
    expect(thumbnail).toBeTruthy()
    expect(thumbnail.src).toContain(mockImgSrc)
  })

  it('opens modal when thumbnail is clicked', () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    const button = screen.getByRole('button', { name: `View ${mockAltText}` })
    fireEvent.click(button)

    const modalBackground = document.getElementById('art-modal-background')
    const modalImg = document.getElementById('art-modal-img')

    expect(modalBackground.classList.contains('show')).toBe(true)
    expect(modalImg.classList.contains('show')).toBe(true)
    expect(document.body.classList.contains('art-modal-open')).toBe(true)
  })

  it('closes modal when background is clicked', async () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    // Open modal
    const button = screen.getByRole('button', { name: `View ${mockAltText}` })
    fireEvent.click(button)

    const modalBackground = document.getElementById('art-modal-background')
    expect(modalBackground.classList.contains('show')).toBe(true)

    // Close modal by clicking background
    fireEvent.click(modalBackground)

    // Wait for animation to complete
    await waitFor(() => {
      expect(modalBackground.classList.contains('show')).toBe(false)
      expect(document.body.classList.contains('art-modal-open')).toBe(false)
    })
  })

  it('closes modal when X button is clicked', async () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    // Open modal
    const button = screen.getByRole('button', { name: `View ${mockAltText}` })
    fireEvent.click(button)

    const modalBackground = document.getElementById('art-modal-background')
    expect(modalBackground.classList.contains('show')).toBe(true)

    // Close modal by clicking X button
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // Wait for animation to complete
    await waitFor(() => {
      expect(modalBackground.classList.contains('show')).toBe(false)
      expect(document.body.classList.contains('art-modal-open')).toBe(false)
    })
  })

  it('closes modal when ESC key is pressed', async () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    // Open modal
    const button = screen.getByRole('button', { name: `View ${mockAltText}` })
    fireEvent.click(button)

    const modalBackground = document.getElementById('art-modal-background')
    expect(modalBackground.classList.contains('show')).toBe(true)

    // Press ESC key
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)
    })

    // Wait for animation to complete
    await waitFor(() => {
      expect(modalBackground.classList.contains('show')).toBe(false)
      expect(document.body.classList.contains('art-modal-open')).toBe(false)
    })
  })

  it('does not close modal when other keys are pressed', () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    // Open modal
    const button = screen.getByRole('button', { name: `View ${mockAltText}` })
    fireEvent.click(button)

    const modalBackground = document.getElementById('art-modal-background')
    expect(modalBackground.classList.contains('show')).toBe(true)

    // Press Enter key
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(event)
    })

    expect(modalBackground.classList.contains('show')).toBe(true)

    // Press Space key
    act(() => {
      const event = new KeyboardEvent('keydown', { key: ' ' })
      document.dispatchEvent(event)
    })

    expect(modalBackground.classList.contains('show')).toBe(true)
  })

  it('does not respond to ESC key when modal is closed', () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    const modalBackground = document.getElementById('art-modal-background')
    expect(modalBackground.classList.contains('show')).toBe(false)

    // Press ESC key when modal is closed
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)
    })

    // Modal should remain closed
    expect(modalBackground.classList.contains('show')).toBe(false)
  })

  it('sets modal image source when opened', () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    const button = screen.getByRole('button', { name: `View ${mockAltText}` })
    fireEvent.click(button)

    const modalImg = document.getElementById('art-modal-img')
    expect(modalImg.src).toContain(mockImgSrc)
    expect(modalImg.title).toBe(mockAltText)
  })
})
