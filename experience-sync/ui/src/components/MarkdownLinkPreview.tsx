import { Fragment, type ReactElement } from "react"
import { parseMarkdownSegments } from "experience-sync/lib/markdown"

interface MarkdownLinkPreviewProps {
  text: string
  emptyMessage: string
  /** When true, render only the inner content (parent supplies the surrounding `pre`). */
  embedded?: boolean
}

function renderMarkdownPreviewContent(text: string): ReactElement {
  return (
    <>
      {parseMarkdownSegments(text).map((segment, segmentIndex) =>
        segment.type === "link" ? (
          <a key={segmentIndex} href={segment.href} target="_blank" rel="noopener noreferrer">
            {segment.text}
          </a>
        ) : (
          <Fragment key={segmentIndex}>{segment.value}</Fragment>
        ),
      )}
    </>
  )
}

/** Renders export preview text with markdown links shown as clickable anchors. */
export function MarkdownLinkPreview({ text, emptyMessage, embedded = false }: MarkdownLinkPreviewProps): ReactElement {
  if (!text) {
    return embedded ? <>{emptyMessage}</> : <pre>{emptyMessage}</pre>
  }

  const content = renderMarkdownPreviewContent(text)
  return embedded ? content : <pre>{content}</pre>
}
