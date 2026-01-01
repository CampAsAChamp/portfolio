import { BulletPoint as BulletPointType } from "types/content.types"

import { BulletPoint } from "./BulletPoint"

interface BulletPointListProps {
  bulletPoints: BulletPointType[]
}

export function BulletPointList({ bulletPoints }: BulletPointListProps): React.ReactElement {
  return (
    <ul>
      {bulletPoints.map((bulletPoint, idx) => (
        <BulletPoint key={idx} bulletPoint={bulletPoint} />
      ))}
    </ul>
  )
}
