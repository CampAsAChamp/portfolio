import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ArtLightbox } from "components/ArtProjects/ArtLightbox"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { expectModalOpen } from "../../helpers/assertions"
import { TEST_PROPS } from "../../helpers/constants"
import { setupModalMocks } from "../../helpers/mocks"

describe("ArtLightbox", () => {
  const item = { imgSrc: TEST_PROPS.MOCK_IMG_SRC, altText: TEST_PROPS.MOCK_ALT_TEXT }

  beforeEach(() => {
    setupModalMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.classList.remove("art-modal-open")
  })

  it("renders nothing when item is null", () => {
    const { container } = render(<ArtLightbox item={null} onClose={vi.fn()} />)
    expect(container).toBeEmptyDOMElement()
  })

  it("opens lightbox content when item is provided", () => {
    render(<ArtLightbox item={item} onClose={vi.fn()} />)

    const modalBackground = document.getElementById("art-modal-background")
    const modalImg = document.getElementById("art-modal-img") as HTMLImageElement

    expectModalOpen(modalBackground, "art-modal-open")
    expectModalOpen(modalImg)
    expect(modalImg.src).toContain(item.imgSrc)
    expect(modalImg.title).toBe(item.altText)
  })

  it("calls onClose when background is clicked", async () => {
    const onClose = vi.fn()
    render(<ArtLightbox item={item} onClose={onClose} />)

    fireEvent.click(document.getElementById("art-modal-background")!)

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it("calls onClose when X button is clicked", async () => {
    const onClose = vi.fn()
    render(<ArtLightbox item={item} onClose={onClose} />)

    fireEvent.click(screen.getByRole("button", { name: "Close" }))

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn()
    render(<ArtLightbox item={item} onClose={onClose} />)

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    })

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it("does not call onClose for unrelated keys", () => {
    const onClose = vi.fn()
    render(<ArtLightbox item={item} onClose={onClose} />)

    act(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
    })

    expect(onClose).not.toHaveBeenCalled()
    expectModalOpen(document.getElementById("art-modal-background"), "art-modal-open")
  })
})
