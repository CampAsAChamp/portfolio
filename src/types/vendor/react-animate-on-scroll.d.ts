declare module 'react-animate-on-scroll' {
  import { Component, ReactNode } from 'react'

  export interface ScrollAnimationProps {
    animateIn?: string
    animateOut?: string
    offset?: number
    duration?: number
    delay?: number
    initiallyVisible?: boolean
    animateOnce?: boolean
    animatePreScroll?: boolean
    style?: React.CSSProperties
    scrollableParentSelector?: string
    className?: string
    children?: ReactNode
  }

  export default class ScrollAnimation extends Component<ScrollAnimationProps> {}
}
