/**
 * Type declarations for react-animate-on-scroll library
 *
 * This file provides TypeScript type definitions for the react-animate-on-scroll package,
 * which doesn't include its own TypeScript types. This allows us to use the library with
 * full type safety and IDE autocomplete support.
 *
 * The library is used throughout the codebase to add scroll-triggered animations to elements,
 * commonly with animate.css classes like 'animate__fadeInUp' and 'animate__springIn'.
 */

/**
 * The 'declare module' syntax tells TypeScript what types to use when importing from this package.
 *
 * When you write: import ScrollAnimation from 'react-animate-on-scroll'
 * TypeScript will use the types defined inside this declaration.
 *
 * This is necessary because the react-animate-on-scroll package is written in JavaScript
 * and doesn't include TypeScript type definitions. Without this declaration, TypeScript
 * would show an error: "Could not find a declaration file for module 'react-animate-on-scroll'"
 */
declare module "react-animate-on-scroll" {
  import { Component, ReactNode } from "react"

  export interface ScrollAnimationProps {
    // Core animation properties (most commonly used)
    animateIn?: string
    animateOnce?: boolean
    delay?: number

    // Additional animation properties
    animateOut?: string
    duration?: number
    offset?: number

    // Behavior properties
    initiallyVisible?: boolean
    animatePreScroll?: boolean
    scrollableParentSelector?: string

    // Style and layout properties
    style?: React.CSSProperties
    className?: string

    // React children
    children?: ReactNode
  }

  export default class ScrollAnimation extends Component<ScrollAnimationProps> {}
}
