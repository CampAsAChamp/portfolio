import { fireEvent, render, screen } from "@testing-library/react"
import { ErrorBoundary } from "components/Common/ErrorBoundary"
import { afterEach, describe, expect, it, vi } from "vitest"

function ProblemChild(): React.ReactElement {
  throw new Error("boom")
}

describe("ErrorBoundary", () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>,
    )

    expect(screen.getByText("All good")).toBeInTheDocument()
  })

  it("renders fallback UI when a child throws", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    )

    expect(screen.getByText("Oops!")).toBeInTheDocument()
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Refresh Page" })).toBeInTheDocument()
  })

  it("reloads the page when refresh is clicked", () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    const reload = vi.fn()
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, reload },
    })

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    )

    fireEvent.click(screen.getByRole("button", { name: "Refresh Page" }))
    expect(reload).toHaveBeenCalledTimes(1)
  })
})
