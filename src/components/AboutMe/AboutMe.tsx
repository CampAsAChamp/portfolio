import ScrollAnimation from 'react-animate-on-scroll'

import AnteaterIllustration from 'assets/Illustrations/Anteater_Illustration.webp'
import DeskIllustration from 'assets/Illustrations/Desk_Illustration.svg'
import GradCapIllustration from 'assets/Illustrations/Graduation_Illustration.svg'
import S_Logo_Purple from 'assets/S_Logo_Purple.svg'

import 'styles/AboutMe/AboutMe.css'

export function AboutMe(): React.ReactElement {
  return (
    <section id="about-me-container" className="page-container">
      <img id="background-logo" src={S_Logo_Purple} alt="Logo Backdrop" />
      <div id="about-me-images">
        <ScrollAnimation animateIn="animate__springIn" animateOnce style={{ gridArea: '1 / 1 / 2 / 2' }}>
          <img id="grad-cap-illustration" src={GradCapIllustration} alt="Graduation Cap" />
        </ScrollAnimation>
        <ScrollAnimation animateIn="animate__springIn" delay={100} animateOnce style={{ gridArea: '1 / 2 / 2 / 3' }}>
          <img id="anteater-illustration" src={AnteaterIllustration} alt="Anteater Illustration" />
        </ScrollAnimation>
        <ScrollAnimation
          animateIn="animate__springIn"
          delay={200}
          animateOnce
          style={{ gridArea: '2 / 1 / 3 / 3', display: 'flex', justifyContent: 'center', alignItems: 'start', marginTop: '-40px' }}
        >
          <img id="desk-illustration" src={DeskIllustration} alt="Desk Illustration" />
        </ScrollAnimation>
      </div>
      <div id="about-me-text">
        <div id="about-me-header">
          <ScrollAnimation animateIn="animate__springIn" animateOnce>
            <h2>ABOUT ME</h2>
          </ScrollAnimation>
        </div>
        <ScrollAnimation animateIn="animate__springIn" delay={100} animateOnce>
          <p>Hey I&apos;m Nick, a software engineer based in San Diego ☀️🌮</p>
          <p>
            I graduated from the 🎓 <strong>University of California, Irvine</strong> in 2019 with a{' '}
            <strong>B.S. in Computer Science</strong> and am currently working full time as a Software Engineer at <strong>Intuit</strong>{' '}
            🧾
          </p>
        </ScrollAnimation>
      </div>
    </section>
  )
}
