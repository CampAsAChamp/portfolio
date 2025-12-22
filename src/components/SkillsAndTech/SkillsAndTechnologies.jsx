import React from 'react';
import ScrollAnimation from 'react-animate-on-scroll';

import { SkillsRow } from 'components/SkillsAndTech/SkillsRow';

import * as technologies from 'data/technologies';

import 'styles/SkillsAndTech/SkillsAndTechnologies.css';

export function SkillsAndTechnologies() {
  return (
    <section id="skills-container" className="page-container">
      <div id="skills-header" className="section-header">
        <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
          <h2>Skills & Technologies</h2>
        </ScrollAnimation>
      </div>
      <div id="skills-content">
        <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
          <SkillsRow technologyNames={[technologies.GO, technologies.JAVA, technologies.SPRING, technologies.PYTHON, technologies.CPP]} />
        </ScrollAnimation>
        <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
          <SkillsRow
            technologyNames={[
              technologies.TYPESCRIPT,
              technologies.JAVASCRIPT,
              technologies.REACT,
              technologies.REDUX,
              technologies.HTML5,
              technologies.CSS3,
            ]}
          />
        </ScrollAnimation>
        <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
          <SkillsRow technologyNames={[technologies.POSTGRES, technologies.KUBERNETES, technologies.DOCKER, technologies.GCP]} />
        </ScrollAnimation>
        <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
          <SkillsRow technologyNames={[technologies.GIT, technologies.LINUX, technologies.FIGMA]} />
        </ScrollAnimation>
      </div>
    </section>
  );
}
