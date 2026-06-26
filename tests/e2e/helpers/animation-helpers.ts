import { Locator, Page } from "@playwright/test"

/**
 * Helper functions for waiting and verifying animations
 */

/**
 * Wait for CSS animation to complete on element
 */
export async function waitForCSSAnimation(locator: Locator): Promise<void> {
  await locator.evaluate((element) => {
    return new Promise<void>((resolve) => {
      const animations = element.getAnimations()

      if (animations.length === 0) {
        resolve()
        return
      }

      void Promise.all(animations.map((anim) => anim.finished)).then(() => resolve())
    })
  })
}

/**
 * Wait for CSS transition to complete on element
 */
export async function waitForCSSTransition(locator: Locator): Promise<void> {
  await locator.evaluate((element) => {
    return new Promise<void>((resolve) => {
      const onTransitionEnd = (): void => {
        element.removeEventListener("transitionend", onTransitionEnd)
        resolve()
      }

      // Check if already transitioning
      const styles = window.getComputedStyle(element)
      if (styles.transition === "none" || styles.transition === "") {
        resolve()
        return
      }

      element.addEventListener("transitionend", onTransitionEnd)

      // Safety timeout
      setTimeout(() => {
        element.removeEventListener("transitionend", onTransitionEnd)
        resolve()
      }, 5000)
    })
  })
}

/**
 * Check if element has animation class
 */
export async function hasAnimationClass(locator: Locator, classPattern: string): Promise<boolean> {
  const classes = await locator.getAttribute("class")
  if (!classes) return false

  const classList = classes.split(" ")
  return classList.some((cls) => cls.includes(classPattern))
}

/**
 * Wait for animate.css animation to complete
 */
export async function waitForAnimateCSSComplete(locator: Locator): Promise<void> {
  await locator.evaluate((element) => {
    return new Promise<void>((resolve) => {
      const onAnimationEnd = (): void => {
        element.removeEventListener("animationend", onAnimationEnd)
        resolve()
      }

      element.addEventListener("animationend", onAnimationEnd)

      // Safety timeout
      setTimeout(() => {
        element.removeEventListener("animationend", onAnimationEnd)
        resolve()
      }, 5000)
    })
  })
}

/**
 * Wait for staggered animations to complete for multiple elements
 */
export async function waitForStaggeredAnimations(locators: Locator[], delayMs = 100): Promise<void> {
  for (const locator of locators) {
    await waitForCSSAnimation(locator)
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
}

/**
 * Wait for scroll animation to trigger
 * Scrolls element into view and waits for animation classes to be applied
 */
export async function waitForScrollAnimation(page: Page, locator: Locator): Promise<void> {
  // Scroll element into view
  await locator.scrollIntoViewIfNeeded()

  // Wait for intersection observer to trigger (typically 10% viewport)
  await page.waitForTimeout(200)

  // Wait for animation to start
  await page.waitForFunction(
    (element) => {
      if (!element) return false
      const animations = element.getAnimations()
      return animations.length > 0
    },
    await locator.elementHandle(),
  )
}

/**
 * Check if element is currently animating
 */
export async function isAnimating(locator: Locator): Promise<boolean> {
  return await locator.evaluate((element) => {
    const animations = element.getAnimations()
    return animations.some((anim) => anim.playState === "running")
  })
}

/**
 * Wait for element animation state to be finished
 */
export async function waitForAnimationState(locator: Locator, state: "running" | "finished" | "paused"): Promise<void> {
  await locator.evaluate((element, targetState) => {
    return new Promise<void>((resolve) => {
      const checkState = (): void => {
        const animations = element.getAnimations()
        if (animations.length === 0) {
          resolve()
          return
        }

        const allInState = animations.every((anim) => anim.playState === targetState)
        if (allInState) {
          resolve()
        } else {
          setTimeout(checkState, 50)
        }
      }
      checkState()
    })
  }, state)
}
