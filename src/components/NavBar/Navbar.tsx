import { useEffect } from "react"
import S_Logo from "assets/S_Logo.svg"
import { Svg } from "components/Common/Svg"
import { HamburgerMenu } from "components/NavBar/HamburgerMenu"
import { ThemeSwitcher } from "components/NavBar/ThemeSwitcher"
import { useModal } from "hooks/useModal"

import "styles/NavBar/Navbar.css"

export function Navbar(): React.ReactElement {
  const { isOpen, close, toggle } = useModal()

  // Handle navigation link clicks - close menu first, then scroll to target
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute("href")
    if (!href) return

    // Close the menu first
    close()

    // Wait for the menu close animation to complete (700ms as per line 48)
    // and for body position to be restored before scrolling
    setTimeout(() => {
      const targetId = href.replace("#", "")
      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 750)
  }

  // Sync modal state with nav classes
  useEffect(() => {
    const burger = document.querySelector(".hamburger-menu")
    const nav = document.querySelector("nav ul")
    const listItems = nav?.querySelectorAll("li")

    if (!burger || !nav || !listItems) return

    if (isOpen) {
      nav.classList.remove("nav-closing")
      nav.classList.add("nav-active")
      burger.classList.add("toggle")

      // Clear any inline styles from previous closing animation
      listItems.forEach((li: HTMLElement) => {
        li.style.animation = ""
      })
    } else {
      // Add closing animation
      if (nav.classList.contains("nav-active")) {
        nav.classList.remove("nav-active")
        nav.classList.add("nav-closing")

        // Manually apply closing animation to each item
        listItems.forEach((li: HTMLElement, index) => {
          const delay = (listItems.length - 1 - index) * 0.05
          li.style.animation = `nav-link-fade-out 0.4s ease ${delay}s forwards`
        })

        // Remove closing class and clean up after animation completes
        setTimeout(() => {
          nav.classList.remove("nav-closing")
          listItems.forEach((li: HTMLElement) => {
            li.style.animation = ""
          })
        }, 700)
      }
      burger.classList.remove("toggle")
    }
  }, [isOpen])

  return (
    <nav>
      <a href="/" className="animate__animated animate__fadeInDown">
        <Svg id="logo" src={S_Logo} title="Home" />
      </a>
      <ul>
        <li className="nav-link-entrance animate__animated animate__fadeInDown">
          <ThemeSwitcher />
        </li>
        <li className="nav-link-entrance animate__animated animate__fadeInDown">
          <a href="#about-me-images" onClick={handleNavLinkClick}>
            About Me
          </a>
        </li>
        <li className="nav-link-entrance animate__animated animate__fadeInDown">
          <a href="#experience-header" onClick={handleNavLinkClick}>
            Experience
          </a>
        </li>
        <li className="nav-link-entrance animate__animated animate__fadeInDown">
          <a href="#skills-header" onClick={handleNavLinkClick}>
            Skills
          </a>
        </li>
        <li className="nav-link-entrance animate__animated animate__fadeInDown">
          <a href="#sw-projects-header" onClick={handleNavLinkClick}>
            Projects
          </a>
        </li>
        <li className="nav-link-entrance animate__animated animate__fadeInDown">
          <a href="#graphic-design-header" onClick={handleNavLinkClick}>
            Art & Design
          </a>
        </li>
      </ul>
      <HamburgerMenu navSlide={toggle} />
    </nav>
  )
}
