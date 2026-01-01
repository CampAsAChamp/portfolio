import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ArtProjectPicture } from 'components/ArtProjects/ArtProjectPicture'

describe('ArtProjectPicture', () => {
  const mockImgSrc = 'test-image.jpg'
  const mockAltText = 'Test Art Project'

  beforeEach(() => {
    // Clean up any existing modal classes
    document.body.classList.remove('art-modal-open')

    /**
     * Mock document.startViewTransition for test environments that don't support it.
     *
     * NOTE: The ArtProjectPicture component doesn't actually use startViewTransition,
     * so this mock is unnecessary for this specific test file. However, it's included
     * as defensive setup in case the component is updated to use it in the future.
     *
     * The double type assertion "as unknown as typeof X" is a TypeScript testing pattern
     * that allows us to assign an incomplete mock to a strictly-typed API. This is necessary
     * because:
     * 1. vi.fn() returns a Vitest mock function type
     * 2. document.startViewTransition has a complex return type with specific properties
     * 3. TypeScript won't allow direct assignment between incompatible types
     * 4. Casting through 'unknown' tells TypeScript "trust me, I know what I'm doing"
     *
     * This is a common and acceptable pattern in testing when you know the mock is sufficient
     * for the test's needs, even if it doesn't implement the complete interface.
     */
    if (!document.startViewTransition) {
      document.startViewTransition = vi.fn((callback: () => void) => {
        callback()
        return {
          ready: Promise.resolve(),
          updateCallbackDone: Promise.resolve(),
          finished: Promise.resolve(),
          skipTransition: () => {},
        }
      }) as unknown as typeof document.startViewTransition
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
    const thumbnail = thumbnails.find((img) => img.classList.contains('art-grid-img')) as HTMLImageElement
    expect(thumbnail).toBeTruthy()
    expect(thumbnail.src).toContain(mockImgSrc)
  })

  it('opens modal when thumbnail is clicked', () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    const button = screen.getByRole('button', { name: `View ${mockAltText}` })
    fireEvent.click(button)

    const modalBackground = document.getElementById('art-modal-background')
    const modalImg = document.getElementById('art-modal-img')

    expect(modalBackground).toBeTruthy()
    expect(modalImg).toBeTruthy()
    expect(modalBackground!.classList.contains('show')).toBe(true)
    expect(modalImg!.classList.contains('show')).toBe(true)
    expect(document.body.classList.contains('art-modal-open')).toBe(true)
  })

  it('closes modal when background is clicked', async () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    // Open modal
    const button = screen.getByRole('button', { name: `View ${mockAltText}` })
    fireEvent.click(button)

    const modalBackground = document.getElementById('art-modal-background')
    expect(modalBackground).toBeTruthy()
    expect(modalBackground!.classList.contains('show')).toBe(true)

    // Close modal by clicking background
    fireEvent.click(modalBackground!)

    // Wait for animation to complete
    await waitFor(() => {
      expect(modalBackground!.classList.contains('show')).toBe(false)
      expect(document.body.classList.contains('art-modal-open')).toBe(false)
    })
  })

  it('closes modal when X button is clicked', async () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    // Open modal
    const button = screen.getByRole('button', { name: `View ${mockAltText}` })
    fireEvent.click(button)

    const modalBackground = document.getElementById('art-modal-background')
    expect(modalBackground).toBeTruthy()
    expect(modalBackground!.classList.contains('show')).toBe(true)

    // Close modal by clicking X button
    const closeButton = screen.getByRole('button', { name: 'Close' })
    fireEvent.click(closeButton)

    // Wait for animation to complete
    await waitFor(() => {
      expect(modalBackground!.classList.contains('show')).toBe(false)
      expect(document.body.classList.contains('art-modal-open')).toBe(false)
    })
  })

  it('closes modal when ESC key is pressed', async () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    // Open modal
    const button = screen.getByRole('button', { name: `View ${mockAltText}` })
    fireEvent.click(button)

    const modalBackground = document.getElementById('art-modal-background')
    expect(modalBackground).toBeTruthy()
    expect(modalBackground!.classList.contains('show')).toBe(true)

    // Press ESC key
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)
    })

    // Wait for animation to complete
    await waitFor(() => {
      expect(modalBackground!.classList.contains('show')).toBe(false)
      expect(document.body.classList.contains('art-modal-open')).toBe(false)
    })
  })

  it('does not close modal when other keys are pressed', () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    // Open modal
    const button = screen.getByRole('button', { name: `View ${mockAltText}` })
    fireEvent.click(button)

    const modalBackground = document.getElementById('art-modal-background')
    expect(modalBackground).toBeTruthy()
    expect(modalBackground!.classList.contains('show')).toBe(true)

    // Press Enter key
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' })
      document.dispatchEvent(event)
    })

    expect(modalBackground!.classList.contains('show')).toBe(true)

    // Press Space key
    act(() => {
      const event = new KeyboardEvent('keydown', { key: ' ' })
      document.dispatchEvent(event)
    })

    expect(modalBackground!.classList.contains('show')).toBe(true)
  })

  it('does not respond to ESC key when modal is closed', () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    const modalBackground = document.getElementById('art-modal-background')
    expect(modalBackground).toBeTruthy()
    expect(modalBackground!.classList.contains('show')).toBe(false)

    // Press ESC key when modal is closed
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(event)
    })

    // Modal should remain closed
    expect(modalBackground!.classList.contains('show')).toBe(false)
  })

  it('sets modal image source when opened', () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    const button = screen.getByRole('button', { name: `View ${mockAltText}` })
    fireEvent.click(button)

    const modalImg = document.getElementById('art-modal-img') as HTMLImageElement
    expect(modalImg).toBeTruthy()
    expect(modalImg.src).toContain(mockImgSrc)
    expect(modalImg.title).toBe(mockAltText)
  })
})
