/**
 * Parse a portfolio variant string with optional markdown links into
 * code-generation fragments for experiences.ts.
 *
 * Supports `[label](https://url)` → createExternalLink("label", "url").
 */

import { arr, call, lit, type TsExpr } from "experience-sync/lib/tsExpr"

/** Plain text run between markdown links. */
export interface PlainTextSegment {
  type: "text"
  value: string
}

/** Markdown link `[text](href)` captured for codegen. */
export interface LinkSegment {
  type: "link"
  text: string
  href: string
}

/** One piece of a portfolio variant after markdown parsing. */
export type MarkdownSegment = PlainTextSegment | LinkSegment

function plainTextSegment(value: string): PlainTextSegment {
  return { type: "text", value }
}

function linkSegment(text: string, href: string): LinkSegment {
  return { type: "link", text, href }
}

/** Map a parsed segment to the TS expression printed into experiences.ts. */
function segmentToTsExpr(segment: MarkdownSegment): TsExpr {
  switch (segment.type) {
    case "text":
      return lit(segment.value)
    case "link":
      return call("createExternalLink", lit(segment.text), lit(segment.href))
  }
}

// Markdown link: [label](https://url) with named captures
//  \[ (?<label> [^\]]+ ) \]  — link text (anything except `]`)
//  \( (?<href> https?:\/\/ [^)\s]+ ) \)  — http(s) URL until `)` or whitespace
const LINK_RE = /\[(?<label>[^\]]+)\]\((?<href>https?:\/\/[^)\s]+)\)/g

/**
 * Split a portfolio variant into text/link segments for code generation.
 * Supports `[label](https://url)` → `createExternalLink("label", "url")`.
 */
export function parseMarkdownSegments(input: string): MarkdownSegment[] {
  const segments: MarkdownSegment[] = []
  // Cursor into `input`: advanced past each link so we can slice plain text between matches.
  let cursor = 0

  // Iterate link matches; indexes alone don't know where the links are.
  for (const match of input.matchAll(LINK_RE)) {
    const label = match.groups?.label
    const href = match.groups?.href
    if (label == null || href == null) {
      continue
    }

    const linkStart = match.index ?? 0
    if (linkStart > cursor) {
      segments.push(plainTextSegment(input.slice(cursor, linkStart)))
    }
    segments.push(linkSegment(label, href))
    cursor = linkStart + match[0].length
  }

  // Trailing plain text after the last link (or the whole string when there were no links).
  if (cursor < input.length) {
    segments.push(plainTextSegment(input.slice(cursor)))
  }

  // Empty input: no matches and nothing to slice, so still return one text segment.
  if (segments.length === 0) {
    segments.push(plainTextSegment(input))
  }

  return segments
}

/** Strip markdown links to plain text (for LinkedIn/resume fallbacks). */
export function stripMarkdownLinks(input: string): string {
  return input.replace(LINK_RE, "$<label>")
}

/** Build a TS array expression for one bullet from markdown segments. */
export function bulletToTsExpr(portfolioVariant: string): TsExpr {
  const segments: MarkdownSegment[] = parseMarkdownSegments(portfolioVariant)
  return arr(segments.map(segmentToTsExpr))
}
