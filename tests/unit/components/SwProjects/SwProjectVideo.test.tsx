import { fireEvent, render, screen } from "@testing-library/react"
import { SwProjectVideo } from "components/SwProjects/SwProjectVideo"
import { REACT } from "data/technologies"
import { SoftwareProject } from "types/project.types"
import { beforeEach, describe, expect, it, vi } from "vitest"

const mockProject: SoftwareProject = {
  name: "Demo Video Project",
  technologies: [REACT],
  bulletPoints: [["Demo bullet"]],
  thumbnail: "/thumb.webp",
  videoThumbnail: "/video.webm",
  videoThumbnailMp4: "/video.mp4",
  isVideo: true,
}

describe("SwProjectVideo", () => {
  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
    HTMLMediaElement.prototype.pause = vi.fn()
  })

  it("renders video with poster and sources", () => {
    const { container } = render(<SwProjectVideo project={mockProject} canAutoPlay={false} />)

    const video = container.querySelector("video")
    expect(video).toBeTruthy()
    expect(video).toHaveAttribute("poster", mockProject.thumbnail)
    expect(container.querySelector('source[type="video/mp4"]')).toHaveAttribute("src", mockProject.videoThumbnailMp4)
    expect(container.querySelector('source[type="video/webm"]')).toHaveAttribute("src", mockProject.videoThumbnail)
  })

  it("shows play button when video is not playing", () => {
    render(<SwProjectVideo project={mockProject} canAutoPlay={false} />)
    expect(screen.getByRole("button", { name: "Play video" })).toBeInTheDocument()
  })

  it("starts playback when play button is clicked", () => {
    const onVideoPlay = vi.fn()
    render(<SwProjectVideo project={mockProject} canAutoPlay={false} onVideoPlay={onVideoPlay} />)

    fireEvent.click(screen.getByRole("button", { name: "Play video" }))

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()
  })

  it("calls onVideoError when play rejects", async () => {
    HTMLMediaElement.prototype.play = vi.fn().mockRejectedValue(new Error("blocked"))
    const onVideoError = vi.fn()
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    render(<SwProjectVideo project={mockProject} canAutoPlay={false} onVideoError={onVideoError} />)
    fireEvent.click(screen.getByRole("button", { name: "Play video" }))

    await vi.waitFor(() => {
      expect(onVideoError).toHaveBeenCalledTimes(1)
    })

    consoleError.mockRestore()
  })
})
