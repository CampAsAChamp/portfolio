import { BulletPointList } from "components/Common/BulletPointList"
import { TechnologiesBar } from "components/Common/TechnologiesBar"
import ScrollAnimation from "react-animate-on-scroll"
import { Experience } from "types/experience.types"

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
          <img
            className="experience-thumbnail"
            src={experience.logo}
            alt={experience.company_name}
            title={experience.company_name}
            loading="lazy"
          />
        </div>
        <div className="location">{experience.location}</div>
        {experience.roles.map((role) => (
          <div key={`${role.position}-${role.duration}`} className="experience-role">
            <div className="secondary-title">
              <div className="position">{role.position}</div>
              <div className="duration">{role.duration}</div>
            </div>
            <div className="supporting-text">
              <BulletPointList bulletPoints={role.bulletPoints} />
            </div>
          </div>
        ))}
        <TechnologiesBar technologyNames={experience.technologies} fillColor={experience.color} />
      </div>
    </ScrollAnimation>
  )
}
