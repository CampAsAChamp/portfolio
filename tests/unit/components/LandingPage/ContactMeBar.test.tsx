import React from "react"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { ContactMeBar } from "components/LandingPage/ContactMeBar"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("components/ContactMeModal/ContactMeModal", () => ({
  ContactMeModal: ({ isOpen }: { isOpen: boolean }): React.ReactElement => (
    <div data-testid="contact-modal" data-open={isOpen ? "true" : "false"} />
  ),
}))

describe("ContactMeBar", () => {
  let mockOpen: () => void
  let mockClose: () => void

  beforeEach(() => {
    mockOpen = vi.fn()
    mockClose = vi.fn()
  })

  it("does not set inline view-transition-name on initial mount", () => {
    render(<ContactMeBar isOpen={false} open={mockOpen} close={mockClose} />)

    const button = document.getElementById("contact-me-button") as HTMLButtonElement
    expect(button.style.viewTransitionName).toBe("")
  })

  it("clears inline view-transition-name after the modal closes", () => {
    const { rerender } = render(<ContactMeBar isOpen={false} open={mockOpen} close={mockClose} />)
    const button = document.getElementById("contact-me-button") as HTMLButtonElement

    rerender(<ContactMeBar isOpen={true} open={mockOpen} close={mockClose} />)
    expect(button.style.viewTransitionName).toBe("none")

    rerender(<ContactMeBar isOpen={false} open={mockOpen} close={mockClose} />)
    expect(button.style.viewTransitionName).toBe("")
  })

  it("mounts the modal before calling open on first click", async () => {
    mockOpen = vi.fn(() => {
      expect(screen.getByTestId("contact-modal")).toHaveAttribute("data-open", "false")
    })
    render(<ContactMeBar isOpen={false} open={mockOpen} close={mockClose} />)

    fireEvent.click(screen.getByRole("button", { name: /Contact Me/i }))
    await waitFor(() => expect(mockOpen).toHaveBeenCalledOnce())
  })
})
