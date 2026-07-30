import { InlineCode, Link, TextSegment } from "types/content.types"

const LINK_RE = /\[(?<label>[^\]]+)\]\((?<href>https?:\/\/[^)\s]+)\)/
const CODE_RE = /`(?<code>[^`]+)`/

interface LinkMatch {
  type: "link"
  index: number
  length: number
  label: string
  href: string
}

interface CodeMatch {
  type: "code"
  index: number
  length: number
  code: string
}

type SpecialMatch = LinkMatch | CodeMatch

function findLinkMatch(input: string, from: number): LinkMatch | null {
  const slice = input.slice(from)
  const match = LINK_RE.exec(slice)
  if (!match?.groups?.label || !match.groups.href) {
    return null
  }

  return {
    type: "link",
    index: from + match.index,
    length: match[0].length,
    label: match.groups.label,
    href: match.groups.href,
  }
}

function findCodeMatch(input: string, from: number): CodeMatch | null {
  const slice = input.slice(from)
  const match = CODE_RE.exec(slice)
  if (!match?.groups?.code) {
    return null
  }

  return {
    type: "code",
    index: from + match.index,
    length: match[0].length,
    code: match.groups.code,
  }
}

function findNextMatch(input: string, from: number): SpecialMatch | null {
  const linkMatch = findLinkMatch(input, from)
  const codeMatch = findCodeMatch(input, from)

  if (!linkMatch && !codeMatch) {
    return null
  }

  if (!linkMatch) {
    return codeMatch
  }

  if (!codeMatch) {
    return linkMatch
  }

  return linkMatch.index <= codeMatch.index ? linkMatch : codeMatch
}

function externalLink(text: string, href: string): Link {
  return {
    text,
    href,
    target: "_blank",
    rel: "noopener noreferrer",
  }
}

function inlineCode(code: string): InlineCode {
  return { code }
}

/**
 * Parse markdown-lite bullet text into render segments.
 * Supports `[label](https://url)` links and `` `inline code` ``.
 */
export function parseBulletMarkdown(input: string): TextSegment[] {
  const segments: TextSegment[] = []
  let cursor = 0

  while (cursor < input.length) {
    const match = findNextMatch(input, cursor)
    if (!match) {
      break
    }

    if (match.index > cursor) {
      segments.push(input.slice(cursor, match.index))
    }

    if (match.type === "link") {
      segments.push(externalLink(match.label, match.href))
    } else {
      segments.push(inlineCode(match.code))
    }

    cursor = match.index + match.length
  }

  if (cursor < input.length) {
    segments.push(input.slice(cursor))
  }

  if (segments.length === 0) {
    segments.push(input)
  }

  return segments
}
