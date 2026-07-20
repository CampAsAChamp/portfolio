import { fireEvent, render, screen } from "@testing-library/react"
import { ArtProjectPicture } from "components/ArtProjects/ArtProjectPicture"
import { describe, expect, it, vi } from "vitest"

import { TEST_PROPS } from "../../helpers/constants"

describe("ArtProjectPicture", () => {
  const mockImgSrc = TEST_PROPS.MOCK_IMG_SRC
  const mockAltText = TEST_PROPS.MOCK_ALT_TEXT

  it("renders without crashing", () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} onOpen={vi.fn()} />)
  })

  it("displays the thumbnail image", () => {
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} onOpen={vi.fn()} />)
    const thumbnail = screen.getByAltText(mockAltText)
    expect(thumbnail).toBeTruthy()
    expect(thumbnail).toHaveAttribute("src", expect.stringContaining(mockImgSrc))
    expect(thumbnail).toHaveClass("art-grid-img")
  })

  it("calls onOpen with image details when thumbnail is clicked", () => {
    const onOpen = vi.fn()
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} onOpen={onOpen} />)

    fireEvent.click(screen.getByRole("button", { name: `View ${mockAltText}` }))

    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(onOpen).toHaveBeenCalledWith({ imgSrc: mockImgSrc, altText: mockAltText })
  })

  it("calls onOpen when Enter is pressed on the thumbnail button", () => {
    const onOpen = vi.fn()
    render(<ArtProjectPicture imgSrc={mockImgSrc} altText={mockAltText} onOpen={onOpen} />)

    fireEvent.keyDown(screen.getByRole("button", { name: `View ${mockAltText}` }), { key: "Enter" })

    expect(onOpen).toHaveBeenCalledWith({ imgSrc: mockImgSrc, altText: mockAltText })
  })
})
