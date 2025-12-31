import { useCallback, useEffect, useState } from 'react'

import { CloseIcon } from 'components/Common/Icons/CloseIcon'

interface ArtProjectPictureProps {
  imgSrc: string
  altText: string
}

export function ArtProjectPicture({ imgSrc, altText }: ArtProjectPictureProps): React.ReactElement {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = useCallback(() => {
    const modalBackground = document.getElementById('art-modal-background')
    const modalImg = document.getElementById('art-modal-img') as HTMLImageElement | null

    if (!modalBackground || !modalImg) return

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

    if (!modalBackground || !modalImg) return

    // Add closing animation class
    modalImg.classList.add('closing')

    // Wait for animation to complete before hiding
    setTimeout(() => {
      modalBackground.classList.remove('show')
      modalImg.classList.remove('show')
      modalImg.classList.remove('closing')
      document.body.classList.remove('art-modal-open')
      setIsModalOpen(false)
    }, 600) // Match the animation duration (0.6s)
  }, [])

  // Add ESC key listener to close modal
  useEffect(() => {
    if (!isModalOpen) return

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        hideModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isModalOpen, hideModal])

  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void): void => {
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
          <CloseIcon />
        </button>
        <img id="art-modal-img" alt={altText} title={altText} />
      </div>
    </>
  )
}
