import { expect } from "vitest"

/**
 * Custom assertion helpers for testing common patterns.
 */

/**
 * Asserts that a modal is in the open state.
 *
 * @param modalElement - The modal element to check
 * @param bodyClass - Optional body class that should be present when modal is open
 */
export function expectModalOpen(modalElement: HTMLElement | null, bodyClass?: string): void {
  expect(modalElement).toBeTruthy()
  expect(modalElement!.classList.contains("show")).toBe(true)
  if (bodyClass) {
    expect(document.body.classList.contains(bodyClass)).toBe(true)
  }
}

/**
 * Asserts that a modal is in the closed state.
 *
 * @param modalElement - The modal element to check
 * @param bodyClass - Optional body class that should be absent when modal is closed
 */
export function expectModalClosed(modalElement: HTMLElement | null, bodyClass?: string): void {
  expect(modalElement).toBeTruthy()
  expect(modalElement!.classList.contains("show")).toBe(false)
  if (bodyClass) {
    expect(document.body.classList.contains(bodyClass)).toBe(false)
  }
}
