import ScrollAnimation from 'react-animate-on-scroll'
import { Technology } from 'types/technology.types'

import { Svg } from 'components/Common/Svg'

import { COLORS } from 'data/colors'
import { technologiesMap } from 'data/technologies'

interface SkillsRowProps {
  technologyNames: string[]
  rowDelay?: number
}

export function SkillsRow({ technologyNames, rowDelay = 0 }: SkillsRowProps): React.ReactElement {
  const technologies = technologyNames
    .map((name) => {
      return technologiesMap.get(name)
    })
    .filter((tech): tech is Technology => tech !== undefined)

  return (
    <div className="skills-row">
      {technologies.map((tech, index) => {
        return (
          <ScrollAnimation animateIn="animate__fadeInUp" delay={rowDelay + index * 50} animateOnce key={tech.name}>
            <div className="skills-icon-container">
              <a href={tech.link}>
                <Svg className="skills-icon hvr-grow" src={tech.image} fill={COLORS.PURPLE} title={`${tech.name} Icon`} />
              </a>
              <div className="skills-caption">{tech.name}</div>
            </div>
          </ScrollAnimation>
        )
      })}
    </div>
  )
}
