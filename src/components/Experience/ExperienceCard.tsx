import { BulletPointList } from "components/Common/BulletPointList"
import { TechnologiesBar } from "components/Common/TechnologiesBar"
import ScrollAnimation from "react-animate-on-scroll"
import { Experience } from "types/experience.types"
import { compareRoleDatesNewestFirst, formatRoleDuration } from "utils/durationUtils"

interface ExperienceCardProps {
  experience: Experience
  index: number
}

export function ExperienceCard({ experience, index }: ExperienceCardProps): React.ReactElement {
  const roles = [...experience.roles].sort((a, b) => compareRoleDatesNewestFirst(a.start, b.start))

  return (
    <ScrollAnimation animateIn="animate__springIn" animateOnce>
      <div className="card" id={`card${index}`}>
        <div className="experience-title-container">
          <div className="employer card-title" style={{ color: experience.color }}>
            {experience.companyName}
          </div>
          <img
            className="experience-thumbnail"
            src={experience.logo}
            alt={experience.companyName}
            title={experience.companyName}
            loading="lazy"
          />
        </div>
        <div className="location">{experience.location}</div>
        {roles.map((role) => (
          <div key={`${role.position}-${role.start.month}-${role.start.year}`} className="experience-role">
            <div className="secondary-title">
              <div className="position">{role.position}</div>
              <div className="duration">{formatRoleDuration(role.start, role.end)}</div>
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
