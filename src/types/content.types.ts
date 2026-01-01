// Shared content types for structured text with links

export interface Link {
  text: string
  href: string
  target?: string
  rel?: string
}

export type TextSegment = string | Link

export type BulletPoint = TextSegment[]
