/**
 * Check if the View Transitions API is supported in the current browser.
 * @returns true if document.startViewTransition is available as a function
 */
export function supportsViewTransitions(): boolean {
  return typeof document.startViewTransition === "function"
}
