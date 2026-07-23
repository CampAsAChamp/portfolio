import type { KeyboardEvent as ReactKeyboardEvent } from "react"

/** Insert `[text](url)` at the textarea cursor (wraps the current selection when present). */
export function insertMarkdownLink(textarea: HTMLTextAreaElement, onChange: (next: string) => void): void {
  const { selectionStart: start, selectionEnd: end, value } = textarea
  const selected = value.slice(start, end)
  const linkText = selected || "text"
  const insertion = `[${linkText}](url)`
  const next = `${value.slice(0, start)}${insertion}${value.slice(end)}`
  onChange(next)

  const urlStart = start + linkText.length + 3 // `[` + text + `](`
  const urlEnd = urlStart + 3 // `url`

  requestAnimationFrame(() => {
    textarea.focus()
    textarea.setSelectionRange(urlStart, urlEnd)
  })
}

/** True for ⌘/Ctrl+K without Alt/Shift — the “insert markdown link” shortcut. */
export function isMarkdownLinkShortcut(event: KeyboardEvent | ReactKeyboardEvent): boolean {
  return (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k" && !event.altKey && !event.shiftKey
}

/** Platform-appropriate label for the markdown-link shortcut (`⌘K` or `Ctrl+K`). */
export function markdownLinkShortcutLabel(): string {
  const isApple = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent)
  return isApple ? "⌘K" : "Ctrl+K"
}
