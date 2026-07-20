import { Svg } from "components/Common/Svg"
import { COLORS } from "data/colors"
import type { TechnologyName } from "data/technologies"
import ScrollAnimation from "react-animate-on-scroll"
import { getTechnologies } from "utils/technologiesUtils"

interface SkillsRowProps {
  technologyNames: TechnologyName[]
  rowDelay?: number
}

export function SkillsRow({ technologyNames, rowDelay = 0 }: SkillsRowProps): React.ReactElement {
  const technologies = getTechnologies(technologyNames)

  return (
    <div className="skills-row">
      {technologies.map((tech, index) => {
        return (
          <ScrollAnimation animateIn="animate__fadeInUp" delay={rowDelay + index * 100} animateOnce key={tech.name}>
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
