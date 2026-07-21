import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { SwProjectVideo } from "components/SwProjects/SwProjectVideo"
import { REACT } from "data/technologies"
import { SoftwareProject } from "types/project.types"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

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
  let observerCallback: IntersectionObserverCallback | null = null
  let observeMock: ReturnType<typeof vi.fn>
  let disconnectMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
    HTMLMediaElement.prototype.pause = vi.fn()
    HTMLMediaElement.prototype.load = vi.fn()

    observeMock = vi.fn()
    disconnectMock = vi.fn()
    observerCallback = null

    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          observerCallback = callback
        }
        observe = observeMock
        unobserve = vi.fn()
        disconnect = disconnectMock
        root = null
        rootMargin = ""
        thresholds: number[] = []
        takeRecords = (): IntersectionObserverEntry[] => []
      },
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("renders video with poster and sources, deferred preload", () => {
    const { container } = render(<SwProjectVideo project={mockProject} canAutoPlay={false} />)

    const video = container.querySelector("video")
    expect(video).toBeTruthy()
    expect(video).toHaveAttribute("poster", mockProject.thumbnail)
    expect(video).toHaveAttribute("preload", "none")
    expect(container.querySelector('source[type="video/mp4"]')).toHaveAttribute("src", mockProject.videoThumbnailMp4)
    expect(container.querySelector('source[type="video/webm"]')).toHaveAttribute("src", mockProject.videoThumbnail)
    expect(observeMock).toHaveBeenCalled()
  })

  it("enables metadata preload when near the viewport", async () => {
    const { container } = render(<SwProjectVideo project={mockProject} canAutoPlay={false} />)

    expect(container.querySelector("video")).toHaveAttribute("preload", "none")

    observerCallback?.(
      [{ isIntersecting: true, target: container.firstChild as Element } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )

    await waitFor(() => {
      expect(container.querySelector("video")).toHaveAttribute("preload", "metadata")
    })
    expect(HTMLMediaElement.prototype.load).toHaveBeenCalled()
    expect(disconnectMock).toHaveBeenCalled()
  })

  it("shows play button when video is not playing", () => {
    render(<SwProjectVideo project={mockProject} canAutoPlay={false} />)
    expect(screen.getByRole("button", { name: "Play video" })).toBeInTheDocument()
  })

  it("starts playback when play button is clicked", async () => {
    const onVideoPlay = vi.fn()
    render(<SwProjectVideo project={mockProject} canAutoPlay={false} onVideoPlay={onVideoPlay} />)

    fireEvent.click(screen.getByRole("button", { name: "Play video" }))

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled()

    // play() resolves asynchronously and then clears the fade overlay after 300ms
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: "Play video" })).not.toBeInTheDocument()
    })
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
