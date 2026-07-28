import { useId, useLayoutEffect, useRef, type ReactElement, type ReactNode } from "react"
import { LinkIcon } from "experience-sync/ui/src/components/ActionIcons"
import { HintedAction } from "experience-sync/ui/src/components/HintedAction"
import { insertMarkdownLink, isMarkdownLinkShortcut, markdownLinkShortcutLabel } from "experience-sync/ui/src/lib/insertMarkdownLink"

interface VariantFieldProps {
  label: ReactNode
  value: string
  onChange: (next: string) => void
  /** When true, shows the markdown link button and enables ⌘/Ctrl+K. */
  supportsMarkdownLinks?: boolean
  /** When true, textarea is read-only (e.g. linked shared variant). */
  readOnly?: boolean
}

/** Grow a textarea to fit its content so multi-line variants don't scroll internally. */
function autosizeTextarea(textarea: HTMLTextAreaElement): void {
  textarea.style.height = "auto"
  textarea.style.height = `${textarea.scrollHeight}px`
}

/**
 * Autosizing textarea for one destination variant.
 * Optionally adds a markdown-link button and ⌘/Ctrl+K shortcut.
 */
export function VariantField({ label, value, onChange, supportsMarkdownLinks = false, readOnly = false }: VariantFieldProps): ReactElement {
  const fieldId = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const shortcut = markdownLinkShortcutLabel()

  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }

    const sync = (): void => autosizeTextarea(textarea)
    sync()

    const parent = textarea.parentElement
    if (!parent) {
      return
    }

    const observer = new ResizeObserver(sync)
    observer.observe(parent)
    return () => observer.disconnect()
  }, [value])

  function applyLink(): void {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }
    insertMarkdownLink(textarea, onChange)
  }

  return (
    <div className="variant-field">
      <div className="variant-field-header">
        <label htmlFor={fieldId} className="variant-field-label">
          {label}
        </label>
        {supportsMarkdownLinks && !readOnly && (
          <HintedAction
            label="Add markdown link"
            description={`Inserts [text](url) at the cursor. Selected text becomes the link label; then edit the URL.`}
            when={`Click the button, or press ${shortcut} while the description is focused.`}
          >
            <button
              type="button"
              className="icon-action variant-link-btn"
              aria-label={`Add markdown link (${shortcut})`}
              onClick={applyLink}
            >
              <LinkIcon />
              <span>Add link</span>
              <kbd className="shortcut-hint">{shortcut}</kbd>
            </button>
          </HintedAction>
        )}
      </div>
      <textarea
        id={fieldId}
        ref={textareaRef}
        className={`autosize-textarea${readOnly ? " autosize-textarea-readonly" : ""}`}
        rows={2}
        value={value}
        readOnly={readOnly}
        onChange={(e) => {
          if (!readOnly) onChange(e.target.value)
        }}
        onKeyDown={(e) => {
          if (readOnly || !supportsMarkdownLinks || !isMarkdownLinkShortcut(e)) {
            return
          }
          e.preventDefault()
          insertMarkdownLink(e.currentTarget, onChange)
        }}
      />
    </div>
  )
}
