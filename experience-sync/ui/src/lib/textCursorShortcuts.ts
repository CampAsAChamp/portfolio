type TextField = HTMLInputElement | HTMLTextAreaElement

type ShortcutEvent = Pick<KeyboardEvent, "key" | "altKey" | "shiftKey" | "ctrlKey" | "metaKey">

/** Index of the start of the line containing `index`. */
export function lineStart(text: string, index: number): number {
  const lastNewline = text.lastIndexOf("\n", Math.max(0, index - 1))
  return lastNewline === -1 ? 0 : lastNewline + 1
}

/** Index after the last character on the line containing `index`. */
export function lineEnd(text: string, index: number): number {
  const nextNewline = text.indexOf("\n", index)
  return nextNewline === -1 ? text.length : nextNewline
}

/** Move left one word boundary (Mac Option+←). Skips whitespace, then the preceding word. */
export function prevWordBoundary(text: string, index: number): number {
  let i = Math.max(0, Math.min(index, text.length))
  while (i > 0 && /\s/.test(text[i - 1]!)) {
    i -= 1
  }
  while (i > 0 && !/\s/.test(text[i - 1]!)) {
    i -= 1
  }
  return i
}

/** Move right one word boundary (Mac Option+→). Skips whitespace, then the following word. */
export function nextWordBoundary(text: string, index: number): number {
  let i = Math.max(0, Math.min(index, text.length))
  while (i < text.length && /\s/.test(text[i]!)) {
    i += 1
  }
  while (i < text.length && !/\s/.test(text[i]!)) {
    i += 1
  }
  return i
}

function isEditableTextField(element: EventTarget | null): element is TextField {
  if (!(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement)) {
    return false
  }
  if (element.disabled) {
    return false
  }
  if (element instanceof HTMLInputElement) {
    const type = element.type
    if (type === "checkbox" || type === "radio" || type === "number" || type === "file" || type === "button" || type === "submit") {
      return false
    }
  }
  return true
}

function movingBackward(key: string): boolean {
  return key === "ArrowLeft" || key === "Home"
}

function targetIndex(element: TextField, key: string): number {
  const start = element.selectionStart ?? 0
  const end = element.selectionEnd ?? 0
  return movingBackward(key) ? Math.min(start, end) : Math.max(start, end)
}

function setSelection(element: TextField, newPos: number, key: string, extend: boolean): void {
  const selStart = element.selectionStart ?? 0
  const selEnd = element.selectionEnd ?? 0

  if (!extend) {
    element.setSelectionRange(newPos, newPos)
    return
  }

  const anchor = selStart === selEnd ? selStart : movingBackward(key) ? selEnd : selStart
  element.setSelectionRange(Math.min(anchor, newPos), Math.max(anchor, newPos))
}

/** True when the event is Option+←/→ or Home/End (without Cmd/Ctrl). */
export function isTextCursorShortcut(event: ShortcutEvent): boolean {
  if (event.ctrlKey || event.metaKey) {
    return false
  }
  if (event.key === "Home" || event.key === "End") {
    return true
  }
  return event.altKey && (event.key === "ArrowLeft" || event.key === "ArrowRight")
}

/**
 * Apply Mac-style cursor navigation in a text field.
 * Returns true when the shortcut was handled (caller should preventDefault).
 */
export function applyTextCursorShortcut(element: TextField, event: ShortcutEvent): boolean {
  if (!isTextCursorShortcut(event)) {
    return false
  }

  const { value } = element
  const index = targetIndex(element, event.key)

  let newPos: number
  switch (event.key) {
    case "Home":
      newPos = lineStart(value, index)
      break
    case "End":
      newPos = lineEnd(value, index)
      break
    case "ArrowLeft":
      newPos = prevWordBoundary(value, index)
      break
    case "ArrowRight":
      newPos = nextWordBoundary(value, index)
      break
    default:
      return false
  }

  setSelection(element, newPos, event.key, event.shiftKey)
  return true
}

/** Capture-phase listener target filter for experience-sync text inputs and textareas. */
export function handleTextCursorShortcutEvent(event: KeyboardEvent): void {
  if (!isEditableTextField(event.target)) {
    return
  }
  if (applyTextCursorShortcut(event.target, event)) {
    event.preventDefault()
  }
}
