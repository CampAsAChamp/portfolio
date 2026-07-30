import { Fragment, type ReactElement } from "react"
import { parseMarkdownSegments } from "experience-sync/lib/markdown"

interface MarkdownLinkPreviewProps {
  text: string
  emptyMessage: string
}

/** Renders export preview text with markdown links shown as clickable anchors. */
export function MarkdownLinkPreview({ text, emptyMessage }: MarkdownLinkPreviewProps): ReactElement {
  if (!text) {
    return <pre>{emptyMessage}</pre>
  }

  return (
    <pre>
      {parseMarkdownSegments(text).map((segment, segmentIndex) =>
        segment.type === "link" ? (
          <a key={segmentIndex} href={segment.href} target="_blank" rel="noopener noreferrer">
            {segment.text}
          </a>
        ) : (
          <Fragment key={segmentIndex}>{segment.value}</Fragment>
        ),
      )}
    </pre>
  )
}
