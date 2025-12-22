import React from 'react'

import ScrollAnimation from 'react-animate-on-scroll'

import { Svg } from 'components/Common/Svg'

import { COLORS } from 'data/colors'
import { technologiesMap } from 'data/technologies'

export function SkillsRow(props) {
  const { technologyNames, rowDelay = 0 } = props

  const technologies = technologyNames.map((name) => {
    return technologiesMap.get(name)
  })

  return (
    <div className="skills-row">
      {technologies.map((tech, index) => {
        return (
          <ScrollAnimation animateIn="animate__fadeInUp" delay={rowDelay + index * 50} animateOnce key={tech.name}>
            <div className="skills-icon-container">
              <a href={tech.link}>
                <Svg
                  className="skills-icon hvr-grow"
                  src={tech.image}
                  fill={COLORS.PURPLE}
                  title={`${tech.name} Icon`}
                  alt={`${tech.name} Icon`}
                />
              </a>
              <div className="skills-caption">{tech.name}</div>
            </div>
          </ScrollAnimation>
        )
      })}
    </div>
  )
}
