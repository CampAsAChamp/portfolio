import React from 'react';

import { Svg } from 'components/Common/Svg';

import { COLORS } from 'data/colors';
import { technologiesMap } from 'data/technologies';

export function SkillsRow(props) {
  const { technologyNames } = props;

  const technologies = technologyNames.map((name) => {
    return technologiesMap.get(name);
  });

  return (
    <div className="skills-row">
      {technologies.map((tech) => {
        return (
          <div className="skills-icon-container" key={tech.name}>
            <a href={tech.link}>
              <Svg
                className="skills-icon hvr-grow"
                src={tech.image}
                fill={COLORS.PURPLE}
                title={tech.name + ' Icon'}
                alt={tech.name + ' Icon'}
              />
            </a>
            <div className="skills-caption">{tech.name}</div>
          </div>
        );
      })}
    </div>
  );
}
