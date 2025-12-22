import React from 'react'

import ScrollAnimation from 'react-animate-on-scroll'

import { SwProjectCard } from 'components/SwProjects/SwProjectCard'

import { projects } from 'data/swProjects'

import 'styles/SwProjects/SwProjects.css'

export function SWProjects() {
  return (
    <section id="sw-projects-container" className="page-container">
      <div id="sw-projects-header" className="section-header">
        <ScrollAnimation animateIn="animate__fadeIn" animateOnce>
          <h2>Software Projects</h2>
        </ScrollAnimation>
      </div>
      {projects.map((project, index) => {
        return <SwProjectCard key={project.name} index={index + 1} project={project} />
      })}
    </section>
  )
}
