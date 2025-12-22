import React from 'react'

export function ArtProjectPicture({ imgSrc, altText }) {
  function showModal() {
    const modalBackground = document.getElementById('art-modal-background')
    const modalImg = document.getElementById('art-modal-img')

    modalBackground.classList.add('show')
    modalImg.classList.add('show')

    modalImg.src = imgSrc
    modalImg.title = altText
  }

  function hideModal() {
    const modalBackground = document.getElementById('art-modal-background')
    const modalImg = document.getElementById('art-modal-img')

    modalBackground.classList.remove('show')
    modalImg.classList.remove('show')
  }

  const handleKeyDown = (event, callback) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      callback()
    }
  }

  return (
    <>
      <button
        onClick={showModal}
        onKeyDown={(e) => handleKeyDown(e, showModal)}
        style={{ border: 'none', padding: 0, background: 'none', cursor: 'pointer', display: 'block' }}
        aria-label={`View ${altText}`}
      >
        <img src={imgSrc} className="art-grid-img" alt={altText} title={altText} loading="lazy" />
      </button>
      {/* Modal 👇 */}
      <div
        className="modal-bg"
        id="art-modal-background"
        onClick={hideModal}
        onKeyDown={(e) => handleKeyDown(e, hideModal)}
        role="button"
        tabIndex={0}
        aria-label="Close modal"
      >
        <span
          id="art-modal-close"
          onClick={hideModal}
          onKeyDown={(e) => handleKeyDown(e, hideModal)}
          role="button"
          tabIndex={0}
          aria-label="Close"
        >
          &times;
        </span>
        <img id="art-modal-img" alt={altText} title={altText} />
      </div>
    </>
  )
}
