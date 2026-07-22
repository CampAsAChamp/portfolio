interface ArtProjectPictureProps {
  imgSrc: string
  altText: string
  onOpen: (item: { imgSrc: string; altText: string }) => void
}

export function ArtProjectPicture({ imgSrc, altText, onOpen }: ArtProjectPictureProps): React.ReactElement {
  const handleOpen = (): void => {
    onOpen({ imgSrc, altText })
  }

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleOpen()
    }
  }

  return (
    <button onClick={handleOpen} onKeyDown={handleKeyDown} className="art-grid-btn" aria-label={`View ${altText}`} type="button">
      <img src={imgSrc} className="art-grid-img" alt={altText} title={altText} loading="lazy" />
    </button>
  )
}
