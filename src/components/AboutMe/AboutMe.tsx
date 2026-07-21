import AnteaterIllustration from "assets/Illustrations/Anteater_Illustration.webp"
import DeskIllustration from "assets/Illustrations/Desk_Illustration.svg"
import GradCapIllustration from "assets/Illustrations/Graduation_Illustration.svg"
import ScrollAnimation from "react-animate-on-scroll"

import "styles/AboutMe/AboutMe.css"

export function AboutMe(): React.ReactElement {
  return (
    <section id="about-me-container" className="page-container">
      <div id="about-me-images">
        <ScrollAnimation animateIn="animate__springIn" animateOnce animatePreScroll={false} style={{ gridArea: "1 / 1 / 2 / 2" }}>
          <img
            id="grad-cap-illustration"
            src={GradCapIllustration}
            alt="Graduation Cap"
            width="795"
            height="574"
            loading="lazy"
            decoding="async"
          />
        </ScrollAnimation>
        <ScrollAnimation
          animateIn="animate__springIn"
          delay={100}
          animateOnce
          animatePreScroll={false}
          style={{ gridArea: "1 / 2 / 2 / 3" }}
        >
          <img
            id="anteater-illustration"
            src={AnteaterIllustration}
            alt="Anteater Illustration"
            width="618"
            height="618"
            loading="lazy"
            decoding="async"
          />
        </ScrollAnimation>
        <ScrollAnimation
          animateIn="animate__springIn"
          delay={200}
          animateOnce
          animatePreScroll={false}
          style={{ gridArea: "2 / 1 / 3 / 3", display: "flex", justifyContent: "center", alignItems: "start", marginTop: "-40px" }}
        >
          <img
            id="desk-illustration"
            src={DeskIllustration}
            alt="Desk Illustration"
            width="711"
            height="670"
            loading="lazy"
            decoding="async"
          />
        </ScrollAnimation>
      </div>
      <div id="about-me-text">
        <div id="about-me-header">
          <ScrollAnimation animateIn="animate__springIn" animateOnce animatePreScroll={false}>
            <h2>ABOUT ME</h2>
          </ScrollAnimation>
        </div>
        <ScrollAnimation animateIn="animate__springIn" delay={100} animateOnce animatePreScroll={false}>
          <p>Hey I&apos;m Nick, a software engineer based in San Diego ☀️🌮</p>
          <p>
            I graduated from the 🎓 <strong>University of California, Irvine</strong> in 2019 with a{" "}
            <strong>B.S. in Computer Science</strong> and am currently working full time as a Senior Software Engineer at{" "}
            <strong>Intuit</strong> 🧾
          </p>
        </ScrollAnimation>
      </div>
    </section>
  )
}
