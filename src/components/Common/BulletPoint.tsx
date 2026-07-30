import "styles/Common/BulletPoint.css"

import { BulletPoint as BulletPointType, InlineCode, Link, TextSegment } from "types/content.types"
import { parseBulletMarkdown } from "utils/parseBulletMarkdown"

interface BulletPointProps {
  bulletPoint: BulletPointType
}

function toSegments(bulletPoint: BulletPointType): TextSegment[] {
  return typeof bulletPoint === "string" ? parseBulletMarkdown(bulletPoint) : bulletPoint
}

function isLink(segment: TextSegment): segment is Link {
  return typeof segment !== "string" && "href" in segment
}

function isInlineCode(segment: TextSegment): segment is InlineCode {
  return typeof segment !== "string" && "code" in segment
}

export function BulletPoint({ bulletPoint }: BulletPointProps): React.ReactElement {
  const segments = toSegments(bulletPoint)

  return (
    <li>
      {segments.map((segment: TextSegment, index: number): React.ReactElement => {
        if (isLink(segment)) {
          return (
            <a key={index} href={segment.href} target={segment.target} rel={segment.rel}>
              {segment.text}
            </a>
          )
        }

        if (isInlineCode(segment)) {
          return (
            <code key={index} className="bullet-inline-code">
              {segment.code}
            </code>
          )
        }

        return <span key={index}>{segment}</span>
      })}
    </li>
  )
}
