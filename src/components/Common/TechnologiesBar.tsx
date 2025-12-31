import { getTechnologies } from '@/utils/technologiesUtils'

import { Svg } from 'components/Common/Svg'

interface TechnologiesBarProps {
  technologyNames: string[]
  fillColor?: string
}

export function TechnologiesBar({ technologyNames, fillColor }: TechnologiesBarProps): React.ReactElement {
  const technologies = getTechnologies(technologyNames)

  return (
    <div className="languages-bar ">
      {technologies.map((tech) => {
        return <Svg key={tech.name} className="languages-item" src={tech.image} fill={fillColor} title={`${tech.name} Icon`} />
      })}
    </div>
  )
}
