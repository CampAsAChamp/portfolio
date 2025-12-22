import { useState } from 'react'

import { Svg } from 'components/Common/Svg'
import { HamburgerMenu } from 'components/NavBar/HamburgerMenu'
import { ThemeSwitcher } from 'components/NavBar/ThemeSwitcher'

import S_Logo from 'assets/S_Logo.svg'

import 'styles/NavBar/Navbar.css'

export function Navbar() {
  const [isNavOpen, setIsNavOpen] = useState(false)

  function openNavModal() {
    const burger = document.querySelector('.hamburger-menu')
    const nav = document.querySelector('nav ul')

    // Open Nav
    nav.classList.add('nav-active')
    burger.classList.add('toggle')

    // When the modal is shown, we want a fixed body so we can't scroll away in the background
    document.body.style.position = 'fixed'
    setIsNavOpen(true)
  }

  function closeNavModal() {
    const burger = document.querySelector('.hamburger-menu')
    const nav = document.querySelector('nav ul')

    // Close Nav
    nav.classList.remove('nav-active')
    burger.classList.remove('toggle')

    // When the modal is closed, we want the page and all scrolling to go back to normal
    document.body.style.position = ''
    setIsNavOpen(false)
  }

  function navSlide() {
    isNavOpen ? closeNavModal() : openNavModal()
  }

  return (
    <nav>
      <a href="/">
        <Svg id="logo" src={S_Logo} alt="Home" title="Home" />
      </a>
      <ul>
        <ThemeSwitcher />
        <li>
          <a href="#about-me-images" onClick={closeNavModal}>
            About Me
          </a>
        </li>
        <li>
          <a href="#experience-header" onClick={closeNavModal}>
            Experience
          </a>
        </li>
        <li>
          <a href="#skills-header" onClick={closeNavModal}>
            Skills
          </a>
        </li>
        <li>
          <a href="#sw-projects-header" onClick={closeNavModal}>
            Projects
          </a>
        </li>
        <li>
          <a href="#graphic-design-header" onClick={closeNavModal}>
            Art & Design
          </a>
        </li>
      </ul>
      <HamburgerMenu navSlide={navSlide} />
    </nav>
  )
}
