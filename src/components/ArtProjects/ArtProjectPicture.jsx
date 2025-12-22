import { useCallback, useEffect, useState } from 'react'

export function ArtProjectPicture({ imgSrc, altText }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = useCallback(() => {
    const modalBackground = document.getElementById('art-modal-background')
    const modalImg = document.getElementById('art-modal-img')

    modalBackground.classList.add('show')
    modalImg.classList.add('show')
    document.body.classList.add('art-modal-open')

    modalImg.src = imgSrc
    modalImg.title = altText
    setIsModalOpen(true)
  }, [imgSrc, altText])

  const hideModal = useCallback(() => {
    const modalBackground = document.getElementById('art-modal-background')
    const modalImg = document.getElementById('art-modal-img')

    modalBackground.classList.remove('show')
    modalImg.classList.remove('show')
    document.body.classList.remove('art-modal-open')
    setIsModalOpen(false)
  }, [])

  // Add ESC key listener to close modal
  useEffect(() => {
    if (!isModalOpen) return

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        hideModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isModalOpen, hideModal])

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
        <button className="modal-close" onClick={hideModal} onKeyDown={(e) => handleKeyDown(e, hideModal)} type="button" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <img id="art-modal-img" alt={altText} title={altText} />
      </div>
    </>
  )
}
