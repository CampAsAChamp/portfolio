import { useEffect } from 'react'

import { Svg } from 'components/Common/Svg'
import { HamburgerMenu } from 'components/NavBar/HamburgerMenu'
import { ThemeSwitcher } from 'components/NavBar/ThemeSwitcher'

import S_Logo from 'assets/S_Logo.svg'

import { useModal } from 'hooks/useModal'

import 'styles/NavBar/Navbar.css'

export function Navbar() {
  const { isOpen, close, toggle } = useModal()

  // Sync modal state with nav classes
  useEffect(() => {
    const burger = document.querySelector('.hamburger-menu')
    const nav = document.querySelector('nav ul')

    if (isOpen) {
      nav.classList.add('nav-active')
      burger.classList.add('toggle')
    } else {
      nav.classList.remove('nav-active')
      burger.classList.remove('toggle')
    }
  }, [isOpen])

  return (
    <nav>
      <a href="/">
        <Svg id="logo" src={S_Logo} alt="Home" title="Home" />
      </a>
      <ul>
        <ThemeSwitcher />
        <li>
          <a href="#about-me-images" onClick={close}>
            About Me
          </a>
        </li>
        <li>
          <a href="#experience-header" onClick={close}>
            Experience
          </a>
        </li>
        <li>
          <a href="#skills-header" onClick={close}>
            Skills
          </a>
        </li>
        <li>
          <a href="#sw-projects-header" onClick={close}>
            Projects
          </a>
        </li>
        <li>
          <a href="#graphic-design-header" onClick={close}>
            Art & Design
          </a>
        </li>
      </ul>
      <HamburgerMenu navSlide={toggle} />
    </nav>
  )
}
