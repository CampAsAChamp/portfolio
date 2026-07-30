// Shared content types for structured text with links

export interface Link {
  text: string
  href: string
  target?: string
  rel?: string
}

export interface InlineCode {
  code: string
}

export type TextSegment = string | Link | InlineCode

/** Plain markdown-lite string or pre-parsed segments (generated experience data). */
export type BulletPoint = string | TextSegment[]
