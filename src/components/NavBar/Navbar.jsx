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
    const listItems = nav.querySelectorAll('li')

    if (isOpen) {
      nav.classList.remove('nav-closing')
      nav.classList.add('nav-active')
      burger.classList.add('toggle')

      // Clear any inline styles from previous closing animation
      listItems.forEach((li) => {
        li.style.animation = ''
      })
    } else {
      // Add closing animation
      if (nav.classList.contains('nav-active')) {
        nav.classList.remove('nav-active')
        nav.classList.add('nav-closing')

        // Manually apply closing animation to each item
        listItems.forEach((li, index) => {
          const delay = (listItems.length - 1 - index) * 0.05
          li.style.animation = `navLinkFadeOut 0.4s ease ${delay}s forwards`
        })

        // Remove closing class and clean up after animation completes
        setTimeout(() => {
          nav.classList.remove('nav-closing')
          listItems.forEach((li) => {
            li.style.animation = ''
          })
        }, 700)
      }
      burger.classList.remove('toggle')
    }
  }, [isOpen])

  return (
    <nav>
      <a href="/">
        <Svg id="logo" src={S_Logo} alt="Home" title="Home" />
      </a>
      <ul>
        <li>
          <ThemeSwitcher />
        </li>
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
