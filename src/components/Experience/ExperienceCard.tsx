import parse from 'html-react-parser'
import ScrollAnimation from 'react-animate-on-scroll'
import { Experience } from 'types/experience.types'

import { TechnologiesBar } from 'components/Common/TechnologiesBar'

interface ExperienceCardProps {
  experience: Experience
  index: number
}

export function ExperienceCard({ experience, index }: ExperienceCardProps): React.ReactElement {
  return (
    <ScrollAnimation animateIn="animate__springIn" animateOnce>
      <div className="card" id={`card${index}`}>
        <div className="experience-title-container">
          <div className="employer card-title" style={{ color: experience.color }}>
            {experience.company_name}
          </div>
          <img className="experience-thumbnail" src={experience.logo} alt={experience.company_name} title={experience.company_name} />
        </div>
        <div className="location">{experience.location}</div>
        <div className="secondary-title">
          <div className="position">{experience.position}</div>
          <div className="duration">{experience.duration}</div>
        </div>
        <div className="supporting-text">
          <ul>{parse(experience.textContent)}</ul>
        </div>
        <TechnologiesBar technologyNames={experience.technologies} fillColor={experience.color} />
      </div>
    </ScrollAnimation>
  )
}
