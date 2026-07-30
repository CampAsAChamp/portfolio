import { forwardRef, useId, useImperativeHandle, useLayoutEffect, useRef, type ReactElement, type ReactNode } from "react"
import { LinkIcon } from "experience-sync/ui/src/components/ActionIcons"
import { HintedAction } from "experience-sync/ui/src/components/HintedAction"
import { insertMarkdownLink, isMarkdownLinkShortcut, markdownLinkShortcutLabel } from "experience-sync/ui/src/lib/insertMarkdownLink"

interface VariantFieldProps {
  label: ReactNode
  value: string
  onChange: (next: string) => void
  /** When true, hides the visible label (use with `labelledBy` or a string `label` for aria-label). */
  hideLabel?: boolean
  /** ID of an external element that labels the textarea (e.g. a section heading). */
  labelledBy?: string
  /** When true, renders the markdown link control in the section header instead of the field header. */
  linkButtonInSectionHeader?: boolean
  /** When true, shows the markdown link button and enables ⌘/Ctrl+K. */
  supportsMarkdownLinks?: boolean
  /** When true, textarea is read-only (e.g. aliased to another destination). */
  readOnly?: boolean
}

export interface VariantFieldHandle {
  applyLink: () => void
}

/** Grow a textarea to fit its content so multi-line variants don't scroll internally. */
function autosizeTextarea(textarea: HTMLTextAreaElement): void {
  textarea.style.height = "auto"
  textarea.style.height = `${textarea.scrollHeight}px`
}

/** Remove trailing newline characters (e.g. from pressing Enter at the end of the text). */
function trimTrailingNewlines(text: string): string {
  return text.replace(/\n+$/, "")
}

/** Markdown link insert control shared by field and section headers. */
export function VariantMarkdownLinkButton({ onApply }: { onApply: () => void }): ReactElement {
  const shortcut = markdownLinkShortcutLabel()

  return (
    <HintedAction
      label="Add markdown link"
      description={`Inserts [text](url) at the cursor. Selected text becomes the link label; then edit the URL.`}
      when={`Click the button, or press ${shortcut} while the description is focused.`}
    >
      <button type="button" className="icon-action variant-link-btn" aria-label={`Add markdown link (${shortcut})`} onClick={onApply}>
        <LinkIcon />
        <span>Add link</span>
        <kbd className="shortcut-hint">{shortcut}</kbd>
      </button>
    </HintedAction>
  )
}

/**
 * Autosizing textarea for one destination variant.
 * Optionally adds a markdown-link button and ⌘/Ctrl+K shortcut.
 */
export const VariantField = forwardRef<VariantFieldHandle, VariantFieldProps>(function VariantField(
  {
    label,
    value,
    onChange,
    hideLabel = false,
    labelledBy,
    linkButtonInSectionHeader = false,
    supportsMarkdownLinks = false,
    readOnly = false,
  },
  ref,
): ReactElement {
  const fieldId = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const ariaLabel = typeof label === "string" ? label : undefined

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

  useImperativeHandle(ref, () => ({ applyLink }), [value, onChange])

  const showLinkButton = supportsMarkdownLinks && !readOnly
  const showLinkInFieldHeader = showLinkButton && !linkButtonInSectionHeader
  const showFieldHeader = showLinkInFieldHeader || !hideLabel

  return (
    <div className="variant-field">
      {showFieldHeader ? (
        <div className={`variant-field-header${hideLabel ? " variant-field-header-compact" : ""}`}>
          {!hideLabel ? (
            <label htmlFor={fieldId} className="variant-field-label">
              {label}
            </label>
          ) : null}
          {showLinkInFieldHeader ? <VariantMarkdownLinkButton onApply={applyLink} /> : null}
        </div>
      ) : null}
      <textarea
        id={fieldId}
        ref={textareaRef}
        className={`autosize-textarea${readOnly ? " autosize-textarea-readonly" : ""}`}
        rows={2}
        value={value}
        readOnly={readOnly}
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : hideLabel ? ariaLabel : undefined}
        onChange={(e) => {
          if (!readOnly) onChange(e.target.value)
        }}
        onBlur={(e) => {
          if (readOnly) {
            return
          }
          const trimmed = trimTrailingNewlines(e.currentTarget.value)
          if (trimmed !== e.currentTarget.value) {
            onChange(trimmed)
          }
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
})
