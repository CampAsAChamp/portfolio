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

/**
 * Asserts that an element has the specified animate.css animation class.
 *
 * @param element - The element to check
 * @param animationClass - The animate.css class name (e.g., 'animate__fadeIn')
 */
export function expectElementHasAnimation(element: HTMLElement | null, animationClass: string): void {
  expect(element).toBeTruthy()
  expect(element!.classList.contains("animate__animated")).toBe(true)
  expect(element!.classList.contains(animationClass)).toBe(true)
}
