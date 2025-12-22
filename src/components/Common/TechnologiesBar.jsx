import React from 'react'

import { Svg } from 'components/Common/Svg'

import { technologiesMap } from 'data/technologies'

export function TechnologiesBar(props) {
  // Technologies is an array of strings listing the name of each technology
  const { technologyNames, fillColor } = props

  const technologies = technologyNames.map((name) => {
    return technologiesMap.get(name)
  })

  return (
    <div className="languages-bar ">
      {technologies.map((tech) => {
        return (
          <Svg
            key={tech.name}
            className="languages-item"
            src={tech.image}
            fill={fillColor}
            title={`${tech.name} Icon`}
            alt={`${tech.name} Icon`}
          />
        )
      })}
    </div>
  )
}
