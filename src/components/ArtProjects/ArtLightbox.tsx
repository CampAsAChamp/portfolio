import { useCallback, useEffect, useState } from "react"
import { CloseIcon } from "components/Common/Icons/CloseIcon"

export interface ArtLightboxItem {
  imgSrc: string
  altText: string
}

interface ArtLightboxProps {
  item: ArtLightboxItem | null
  onClose: () => void
}

export function ArtLightbox({ item, onClose }: ArtLightboxProps): React.ReactElement | null {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = useCallback((): void => {
    if (!item || isClosing) return

    setIsClosing(true)
    setTimeout(() => {
      document.body.classList.remove("art-modal-open")
      setIsClosing(false)
      onClose()
    }, 600)
  }, [item, isClosing, onClose])

  useEffect(() => {
    if (!item) return

    document.body.classList.add("art-modal-open")
    return (): void => {
      document.body.classList.remove("art-modal-open")
    }
  }, [item])

  useEffect(() => {
    if (!item) return

    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return (): void => document.removeEventListener("keydown", handleEscape)
  }, [item, handleClose])

  if (!item) return null

  return (
    // Backdrop click dismisses; keyboard users close via Escape or the Close button
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="modal-bg show" id="art-modal-background" onClick={handleClose} aria-hidden={false}>
      <button className="modal-close" onClick={handleClose} type="button" aria-label="Close">
        <CloseIcon />
      </button>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <img
        id="art-modal-img"
        className={`show${isClosing ? " closing" : ""}`}
        src={item.imgSrc}
        alt={item.altText}
        title={item.altText}
        onClick={(event) => event.stopPropagation()}
      />
    </div>
  )
}
