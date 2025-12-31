import { Technology } from 'types/technology.types'

import { Svg } from 'components/Common/Svg'

import { technologiesMap } from 'data/technologies'

interface TechnologiesBarProps {
  technologyNames: string[]
  fillColor?: string
}

export function TechnologiesBar({ technologyNames, fillColor }: TechnologiesBarProps): React.ReactElement {
  const technologies = technologyNames
    .map((name) => {
      return technologiesMap.get(name)
    })
    .filter((tech): tech is Technology => tech !== undefined)

  return (
    <div className="languages-bar ">
      {technologies.map((tech) => {
        return <Svg key={tech.name} className="languages-item" src={tech.image} fill={fillColor} title={`${tech.name} Icon`} />
      })}
    </div>
  )
}
