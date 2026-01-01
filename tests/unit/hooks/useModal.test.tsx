import { act, renderHook } from "@testing-library/react"
import { useModal } from "hooks/useModal"
import { beforeEach, describe, expect, it } from "vitest"

describe("useModal", () => {
  beforeEach(() => {
    // Reset body style
    document.body.style.position = ""
  })

  it("should initialize with closed state by default", () => {
    const { result } = renderHook(() => useModal())

    expect(result.current.isOpen).toBe(false)
    expect(document.body.style.position).toBe("")
  })

  it("should initialize with provided initial state", () => {
    const { result } = renderHook(() => useModal(true))

    expect(result.current.isOpen).toBe(true)
  })

  it("should open modal and lock body scroll", () => {
    const { result } = renderHook(() => useModal())

    act(() => {
      result.current.open()
    })

    expect(result.current.isOpen).toBe(true)
    expect(document.body.style.position).toBe("fixed")
  })

  it("should close modal and restore body scroll", () => {
    const { result } = renderHook(() => useModal(true))

    // Set body to fixed (simulating open state)
    document.body.style.position = "fixed"

    act(() => {
      result.current.close()
    })

    expect(result.current.isOpen).toBe(false)
    expect(document.body.style.position).toBe("")
  })

  it("should toggle modal from closed to open", () => {
    const { result } = renderHook(() => useModal())

    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isOpen).toBe(true)
    expect(document.body.style.position).toBe("fixed")
  })

  it("should toggle modal from open to closed", () => {
    const { result } = renderHook(() => useModal(true))

    document.body.style.position = "fixed"

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isOpen).toBe(false)
    expect(document.body.style.position).toBe("")
  })

  it("should toggle multiple times", () => {
    const { result } = renderHook(() => useModal())

    // Toggle open
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isOpen).toBe(true)
    expect(document.body.style.position).toBe("fixed")

    // Toggle closed
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isOpen).toBe(false)
    expect(document.body.style.position).toBe("")

    // Toggle open again
    act(() => {
      result.current.toggle()
    })
    expect(result.current.isOpen).toBe(true)
    expect(document.body.style.position).toBe("fixed")
  })

  it("should maintain consistent state with multiple open calls", () => {
    const { result } = renderHook(() => useModal())

    act(() => {
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)
  })

  it("should maintain consistent state with multiple close calls", () => {
    const { result } = renderHook(() => useModal(true))

    act(() => {
      result.current.close()
    })
    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.close()
    })
    expect(result.current.isOpen).toBe(false)
  })

  it("should close modal when ESC key is pressed", () => {
    const { result } = renderHook(() => useModal())

    // Open the modal
    act(() => {
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)

    // Simulate ESC key press
    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Escape" })
      document.dispatchEvent(event)
    })

    expect(result.current.isOpen).toBe(false)
    expect(document.body.style.position).toBe("")
  })

  it("should not close modal when other keys are pressed", () => {
    const { result } = renderHook(() => useModal())

    // Open the modal
    act(() => {
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)

    // Simulate other key presses
    act(() => {
      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" })
      document.dispatchEvent(enterEvent)
    })
    expect(result.current.isOpen).toBe(true)

    act(() => {
      const spaceEvent = new KeyboardEvent("keydown", { key: " " })
      document.dispatchEvent(spaceEvent)
    })
    expect(result.current.isOpen).toBe(true)
  })

  it("should not respond to ESC key when modal is closed", () => {
    const { result } = renderHook(() => useModal())

    expect(result.current.isOpen).toBe(false)

    // Simulate ESC key press when modal is closed
    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Escape" })
      document.dispatchEvent(event)
    })

    expect(result.current.isOpen).toBe(false)
  })

  it("should clean up ESC key listener when modal is closed", () => {
    const { result } = renderHook(() => useModal())

    // Open the modal
    act(() => {
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)

    // Close the modal
    act(() => {
      result.current.close()
    })
    expect(result.current.isOpen).toBe(false)

    // Simulate ESC key press after closing - should not cause any issues
    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Escape" })
      document.dispatchEvent(event)
    })

    expect(result.current.isOpen).toBe(false)
  })

  it("should clean up ESC key listener when component unmounts", () => {
    const { result, unmount } = renderHook(() => useModal())

    // Open the modal
    act(() => {
      result.current.open()
    })
    expect(result.current.isOpen).toBe(true)

    // Unmount the component
    unmount()

    // Simulate ESC key press after unmounting - should not cause any issues
    act(() => {
      const event = new KeyboardEvent("keydown", { key: "Escape" })
      document.dispatchEvent(event)
    })

    // No errors should occur
  })
})
