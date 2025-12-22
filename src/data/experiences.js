import ArculesLogo from 'assets/Company_Logos/Arcules.svg'
import IDTechLogo from 'assets/Company_Logos/ID_Tech.svg'
import IntuitLogo from 'assets/Company_Logos/Intuit.svg'
import RaytheonLogo from 'assets/Company_Logos/Raytheon.svg'
import ReazonLogo from 'assets/Company_Logos/Reazon.svg'

import { COLORS } from 'data/colors'
import * as technologies from 'data/technologies'

export const RAYTHEON = 'Raytheon Intelligence & Space'
export const ARCULES = 'Arcules'
export const ID_TECH = 'ID Tech'
export const INTUIT = 'Intuit'
export const REAZON = 'Reazon Systems'

export const experiences = [
  {
    company_name: INTUIT,
    location: 'San Diego, CA',
    position: 'Software Engineer 2',
    duration: 'Oct 2023 - Present',
    textContent: `<li>
                    Currently working as a full stack software engineer on the appointment scheduling team for TurboTax's <a href="https://www.intuit.com/strategy/#bigbet-2" target="_blank" rel="noopener noreferrer">Virtual Expert Platform</a>.
                  </li>
                  <li>
                    Launched Attribute Based Routing to match customers to tax experts at a more granular level, driving a 11% reduction in TurboTax Live customer service time without impact to quality and 6% increase in same-day tax filings (contributing to $5.3M savings).
                  </li>
                  <li>
                    Created service with accompanying web app for syncing expert skills and creating routing plans in AWS, enabling Attribute Based Routing.
                  </li>
                  <li>
                    Developed service for scheduling expert appointments and fulfilling them at their scheduled time, handling over 500,000 appointments a year.
                  </li>
                  <li>
                    Decoupled TurboTax Live from Amazon Connect, saving 1100 hours per year by eliminating the need for personal queues and licenses to be created by Ops team.
                  </li>
                  `,
    technologies: [
      technologies.JAVA,
      technologies.SPRING,
      technologies.REACT,
      technologies.REDUX,
      technologies.TYPESCRIPT,
      technologies.GRAPHQL,
      technologies.AWS,
    ],
    logo: IntuitLogo,
    color: COLORS.INTUIT,
  },
  {
    company_name: ARCULES,
    location: 'Irvine, CA',
    position: 'Software Engineer',
    duration: 'Jan 2022 - Oct 2023 (1 yr 10 mos)',
    textContent: `<li>
                    Worked on the <a href="https://manage.arcules.com/login/" target="_blank" rel="noopener noreferrer">product</a> (video surveillance as a service) team across the whole stack.
                  </li>
                  <li>
                    Developed and maintained a service and scheduler for creating detailed customer device usage reports for further analysis and insights using Go, Postgres, and Google Cloud Platform.
                  </li>
                  <li>
                    Designed and implemented set of microservices for our Back Office portal, which streamlined the quote/order creation process for the Sales Ops team, resulting in a significantly faster sales pipeline.
                  </li>
                  <li>
                    Created a Kubernetes CronJob to generate and distribute hourly device health status reports for 10,000+ devices, per request from our largest customer.
                  </li>
                  <li>
                    Enhanced user experience of the app by revamping the application flow, adding localization infrastructure and quality-of-life features using React, Redux, and react-intl.
                  </li>
                  `,
    technologies: [
      technologies.GO,
      technologies.POSTGRES,
      technologies.REACT,
      technologies.REDUX,
      technologies.GCP,
      technologies.DOCKER,
      technologies.KUBERNETES,
    ],
    logo: ArculesLogo,
    color: COLORS.ARCULES,
  },
  {
    company_name: RAYTHEON,
    location: 'Los Angeles, CA',
    position: 'Software Engineer 1',
    duration: 'Jan 2020 - Dec 2021 (2 yrs)',
    textContent: `<li>
                      Worked on <a href="https://www.raytheon.com/capabilities/products/space-based-early-warning" target="_blank" rel="noopener noreferrer">Space Based Early Missile Warning Satellite</a> on the Ground Software team
                  </li>
                  <li>
                      Developed Space Mission Data Processing <a href="https://www.raytheonintelligenceandspace.com/what-we-do/space-solutions/missile-warning-and-defense/forge" target="_blank" rel="noopener noreferrer">Framework</a> in C++ 11 and Google Protobufs to stream and process terabytes of real-time satellite data each day with extremely high reliability, performance, and fault tolerance.
                  </li>
                  <li>
                      Implemented modules in Space to Earth message simulation with Python & C++, allowing for extensive development and testing without needing Space hardware.
                  </li>
                  <li>
                      Optimized statistical feature generation algorithm from systems engineers leading to a 90% improvement in runtime (~200 μs to ~20 μs).
                  </li>
                  <li>
                      Received program-wide performance recognition award for outstanding and impressive performance (July 2020, June 2021, Sept 2021); Recognition Awards for collaboration (June 2020, Aug 2020, Jan 2021).
                  </li>`,
    technologies: [technologies.CPP, technologies.C, technologies.PYTHON, technologies.DOCKER],
    logo: RaytheonLogo,
    color: COLORS.RAYTHEON,
  },
  {
    company_name: ID_TECH,
    location: 'Cypress, CA',
    position: 'Software Engineer Co-op',
    duration: 'Sept 2018 - Dec 2018 (4 mos)',
    textContent: `<li>
                    Created responsive mobile web app <a href="https://www.vivostate.com/" target="_blank" rel="noopener noreferrer">ViVOstate Terminal Management System (TMS)</a> with Node, Express, and Angular for viewing credit card reader device information and performing remote firmware updates in the field.
                </li>
                <li>
                    Built a web based barcode scanner to allow easy lookup of a device's status and specs using a smartphone/laptop camera, resulting in a 44% faster average task time.
                </li>
                <li>
                    Added GPS location tracking for quickly viewing devices on a map, utilizing the <a href="https://developers.google.com/maps/documentation" target="_blank" rel="noopener noreferrer"> Google Maps API</a>.
                </li>
                <li>
                    Designed wireframes, mockups and UX flows with Figma for rapidly prototyping designs to stakeholders.
                </li>`,
    technologies: [technologies.NODEJS, technologies.EXPRESS, technologies.ANGULAR, technologies.FIGMA],
    logo: IDTechLogo,
    color: COLORS.ID_TECH,
  },
  {
    company_name: REAZON,
    location: 'Santa Ana, CA',
    position: 'Software Engineer Intern',
    duration: 'Jan 2018 - Mar 2018 (3 mos)',
    textContent: `<li>
                    Implemented RCampus online classroom learning tools and RESTful APIs with Java and MySQL for universities such as University of Virginia and Indiana University to use in courses.
                </li>
                <li>
                    Created Google Sheets parsing tool using the
                    <a href="https://developers.google.com/sheets/api" target="_blank" rel="noopener noreferrer">Google Sheets API</a> for personalized site designs.
                </li>`,
    technologies: [technologies.JAVA, technologies.MYSQL, technologies.JAVASCRIPT, technologies.HTML5, technologies.CSS3],
    logo: ReazonLogo,
    color: COLORS.REAZON,
  },
]

const experienceMap = new Map()

experiences.forEach((item) => {
  experienceMap.set(item.company_name, item)
})

export { experienceMap }
