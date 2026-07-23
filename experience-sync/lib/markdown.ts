/**
 * Parse a portfolio variant string with optional markdown links into
 * code-generation fragments for experiences.ts.
 *
 * Supports `[label](https://url)` → createExternalLink("label", "url").
 */

import { arr, call, lit, type TsExpr } from "experience-sync/lib/tsExpr"

export type TextSegmentLiteral = { type: "text"; value: string } | { type: "link"; text: string; href: string }

const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g

/**
 * Split a portfolio variant into text/link segments for code generation.
 * Supports `[label](https://url)` → `createExternalLink("label", "url")`.
 */
export function parseMarkdownSegments(input: string): TextSegmentLiteral[] {
  const segments: TextSegmentLiteral[] = []
  let lastIndex = 0
  LINK_RE.lastIndex = 0

  let match: RegExpExecArray | null
  while ((match = LINK_RE.exec(input)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", value: input.slice(lastIndex, match.index) })
    }
    segments.push({ type: "link", text: match[1]!, href: match[2]! })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < input.length) {
    segments.push({ type: "text", value: input.slice(lastIndex) })
  }

  if (segments.length === 0) {
    segments.push({ type: "text", value: input })
  }

  return segments
}

/** Strip markdown links to plain text (for LinkedIn/resume fallbacks). */
export function stripMarkdownLinks(input: string): string {
  return input.replace(LINK_RE, "$1")
}

/** Build a TS array expression for one bullet (`TextSegment[]`). */
export function bulletToTsExpr(portfolioVariant: string): TsExpr {
  const segments = parseMarkdownSegments(portfolioVariant)
  return arr(
    segments.map((seg) => {
      if (seg.type === "text") {
        return lit(seg.value)
      }
      return call("createExternalLink", lit(seg.text), lit(seg.href))
    }),
  )
}
