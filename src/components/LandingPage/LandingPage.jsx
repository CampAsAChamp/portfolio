import React from 'react';

import ArtProfilePic from 'assets/Art_Profile_Pic.svg';
import GitHubLogo from 'assets/Dev_Icons/GitHub.svg';
import LinkedInLogo from 'assets/Dev_Icons/LinkedIn.svg';
import HeroImageBlobShape from 'assets/Organic_Shapes/Hero_Image_Blob_Shape.svg';
import RealProfilePic from 'assets/Real_Profile_Pic.webp';

import { MouseScrollIndicator } from 'components/LandingPage/MouseScrollIndicator';
import { Svg } from 'components/Common/Svg';

import 'styles/LandingPage/LandingPage.css';

export function LandingPage() {
  function showModal() {
    let modalBackground = document.getElementById('contact-me-modal-background');
    let modalContent = document.getElementById('contact-me-modal-content');

    modalBackground.classList.add('show');
    modalContent.classList.add('show');
  }

  function hideModal() {
    let modalBackground = document.getElementById('contact-me-modal-background');
    let modalContent = document.getElementById('contact-me-modal-content');

    modalBackground.classList.remove('show');
    modalContent.classList.remove('show');
  }

  return (
    <>
      <img id="landing-blob" src={HeroImageBlobShape} alt="" />
      <section id="landing-page-container" className="page-container">
        <div id="name-intro-container">
          <h1 id="name">
            NICK
            <br />
            SCHNEIDER
          </h1>
          <div id="software-engineer">Software Engineer</div>
          <br />
          <div id="subtitle">If you're going to make something, why not make it pretty?</div>
          <div id="contact-me-bar">
            <button type="button" className="button" id="contact-me-button" onClick={showModal}>
              <span>Contact Me</span>
            </button>
            <div className="modal-bg" id="contact-me-modal-background" onClick={hideModal}>
              <div id="contact-me-modal-content">
                <span id="contact-me-modal-close" onClick={hideModal}>
                  ×
                </span>
                <img id="contact-me-modal-profile-pic" src={RealProfilePic} alt="Nick Schneider" />
                <p>
                  <strong>📧 Email: </strong>
                  <a href="mailto:nickschneider101@gmail.com" target="_blank" rel="noopener noreferrer">
                    nickschneider101@gmail.com
                  </a>
                </p>
              </div>
            </div>
            <div id="contact-me-socials">
              <a href="https://github.com/CampAsAChamp/" target="_blank" rel="noopener noreferrer">
                <Svg className="contact-me-item" id="github-logo" src={GitHubLogo} alt="Github Icon" title="Github Icon" />
              </a>
              <a href="https://www.linkedin.com/in/nick-schneider-swe/" target="_blank" rel="noopener noreferrer">
                <Svg className="contact-me-item" id="linkedin-logo" src={LinkedInLogo} alt="LinkedIn Icon" title="LinkedIn Icon" />
              </a>
            </div>
          </div>
          <MouseScrollIndicator />
        </div>
        <div id="profile-pic-container">
          <Svg id="profile-pic" src={ArtProfilePic} alt="Flat Profile Pic" className="center" />
        </div>
      </section>
    </>
  );
}
