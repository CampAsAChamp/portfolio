import { BulletPoint as BulletPointType, Link, TextSegment } from 'types/content.types'

interface BulletPointProps {
  bulletPoint: BulletPointType
}

function isLink(segment: TextSegment): segment is Link {
  return typeof segment !== 'string'
}

export function BulletPoint({ bulletPoint }: BulletPointProps): React.ReactElement {
  return (
    <li>
      {bulletPoint.map((segment: TextSegment, index: number): React.ReactElement => {
        if (isLink(segment)) {
          return (
            <a key={index} href={segment.href} target={segment.target} rel={segment.rel}>
              {segment.text}
            </a>
          )
        }
        return <span key={index}>{segment}</span>
      })}
    </li>
  )
}
