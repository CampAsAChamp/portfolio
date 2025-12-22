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
        <SkillsRow
          technologyNames={[technologies.GO, technologies.JAVA, technologies.SPRING, technologies.PYTHON, technologies.CPP]}
          rowDelay={0}
        />
        <SkillsRow
          technologyNames={[
            technologies.TYPESCRIPT,
            technologies.JAVASCRIPT,
            technologies.REACT,
            technologies.REDUX,
            technologies.HTML5,
            technologies.CSS3,
          ]}
          rowDelay={100}
        />
        <SkillsRow
          technologyNames={[technologies.POSTGRES, technologies.KUBERNETES, technologies.DOCKER, technologies.GCP]}
          rowDelay={200}
        />
        <SkillsRow technologyNames={[technologies.GIT, technologies.LINUX, technologies.FIGMA]} rowDelay={300} />
      </div>
    </section>
  );
}
