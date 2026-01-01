import { ExperienceCard } from "components/Experience/ExperienceCard"
import { experiences } from "data/experiences"
import ScrollAnimation from "react-animate-on-scroll"

import "styles/Experience/Experience.css"

export function Experience(): React.ReactElement {
  return (
    <>
      <section id="experience-container" className="page-container">
        <div id="experience-header" className="section-header">
          <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
            <h2>Experience</h2>
          </ScrollAnimation>
        </div>
        {experiences.map((exp, index) => {
          return <ExperienceCard key={exp.company_name} index={index + 1} experience={exp} />
        })}
      </section>
    </>
  )
}
