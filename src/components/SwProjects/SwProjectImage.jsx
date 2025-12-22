import React from 'react';

export function SwProjectImage({ project }) {
  return <img className="sw-projects-thumbnail" src={project.thumbnail} alt={project.name} title={project.name} />;
}
