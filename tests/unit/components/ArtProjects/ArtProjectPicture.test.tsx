import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ArtProjectPicture } from "components/ArtProjects/ArtProjectPicture"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { expectModalClosed, expectModalOpen } from "../../helpers/assertions"
import { TEST_PROPS } from "../../helpers/constants"
import { setupModalMocks } from "../../helpers/mocks"

describe("ArtProjectPicture", () => {
  const mockImgSrc = TEST_PROPS.MOCK_IMG_SRC
  const mockAltText = TEST_PROPS.MOCK_ALT_TEXT

  beforeEach(() => {
    setupModalMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders without crashing", () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)
  })

  it("displays the thumbnail image", () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)
    const thumbnails = screen.getAllByAltText(mockAltText)
    const thumbnail = thumbnails.find((img) => img.classList.contains("art-grid-img")) as HTMLImageElement
    expect(thumbnail).toBeTruthy()
    expect(thumbnail.src).toContain(mockImgSrc)
  })

  /**
   * Helper to open the modal for testing.
   */
  function openModal(): void {
    const button = screen.getByRole("button", { name: `View ${mockAltText}` })
    fireEvent.click(button)
  }

  /**
   * Helper to get modal elements.
   */
  function getModalElements(): { modalBackground: HTMLElement | null; modalImg: HTMLElement | null } {
    return {
      modalBackground: document.getElementById("art-modal-background"),
      modalImg: document.getElementById("art-modal-img"),
    }
  }

  it("opens modal when thumbnail is clicked", () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    openModal()

    const { modalBackground, modalImg } = getModalElements()
    expectModalOpen(modalBackground, "art-modal-open")
    expectModalOpen(modalImg)
  })

  it("closes modal when background is clicked", async () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    openModal()

    const { modalBackground } = getModalElements()
    expectModalOpen(modalBackground, "art-modal-open")

    // Close modal by clicking background
    fireEvent.click(modalBackground!)

    // Wait for animation to complete
    await waitFor(() => {
      expectModalClosed(modalBackground, "art-modal-open")
    })
  })

  it("closes modal when X button is clicked", async () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    openModal()

    const { modalBackground } = getModalElements()
    expectModalOpen(modalBackground, "art-modal-open")

    // Close modal by clicking X button
    const closeButton = screen.getByRole("button", { name: "Close" })
    fireEvent.click(closeButton)

    // Wait for animation to complete
    await waitFor(() => {
      expectModalClosed(modalBackground, "art-modal-open")
    })
  })

  it("closes modal when ESC key is pressed", async () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    openModal()

    const { modalBackground } = getModalElements()
    expectModalOpen(modalBackground, "art-modal-open")

    // Press ESC key
    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Escape" })
      document.dispatchEvent(event)
    })

    // Wait for animation to complete
    await waitFor(() => {
      expectModalClosed(modalBackground, "art-modal-open")
    })
  })

  it("does not close modal when other keys are pressed", () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    openModal()

    const { modalBackground } = getModalElements()
    expectModalOpen(modalBackground, "art-modal-open")

    // Press Enter key
    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Enter" })
      document.dispatchEvent(event)
    })

    expectModalOpen(modalBackground)

    // Press Space key
    act(() => {
      const event = new KeyboardEvent("keydown", { key: " " })
      document.dispatchEvent(event)
    })

    expectModalOpen(modalBackground)
  })

  it("does not respond to ESC key when modal is closed", () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    const { modalBackground } = getModalElements()
    expectModalClosed(modalBackground)

    // Press ESC key when modal is closed
    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Escape" })
      document.dispatchEvent(event)
    })

    // Modal should remain closed
    expectModalClosed(modalBackground)
  })

  it("sets modal image source when opened", () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} />)

    openModal()

    const modalImg = document.getElementById("art-modal-img") as HTMLImageElement
    expect(modalImg).toBeTruthy()
    expect(modalImg.src).toContain(mockImgSrc)
    expect(modalImg.title).toBe(mockAltText)
  })
})
