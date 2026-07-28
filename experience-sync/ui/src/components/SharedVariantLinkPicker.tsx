import { type ReactElement, type ReactNode } from "react"
import type { Destination, SharedVariant } from "experience-sync/lib/schema"
import { VariantField } from "experience-sync/ui/src/components/VariantField"

interface SharedVariantLinkPickerProps {
  destination: Destination
  label: ReactNode
  linkedSharedId: string | undefined
  resolvedText: string
  customText: string
  sharedVariants: SharedVariant[]
  supportsMarkdownLinks?: boolean
  onLinkChange: (sharedId: string | null) => void
  onUnlink: () => void
  onSaveAsShared: () => void
  onCustomChange: (next: string) => void
  onJumpToShared: (sharedId: string) => void
}

/** Per-destination control to link an accomplishment variant to a shared library entry or use custom text. */
export function SharedVariantLinkPicker({
  destination,
  label,
  linkedSharedId,
  resolvedText,
  customText,
  sharedVariants,
  supportsMarkdownLinks = false,
  onLinkChange,
  onUnlink,
  onSaveAsShared,
  onCustomChange,
  onJumpToShared,
}: SharedVariantLinkPickerProps): ReactElement {
  const isLinked = Boolean(linkedSharedId)
  const eligibleShared = sharedVariants.filter((shared) => {
    const text = shared.variants[destination]
    return typeof text === "string" && text.trim().length > 0
  })

  return (
    <div className="shared-variant-link-picker">
      <div className="shared-variant-link-row">
        <label className="shared-variant-link-label">
          Source
          <select
            value={linkedSharedId ?? ""}
            onChange={(e) => {
              const value = e.target.value
              onLinkChange(value ? value : null)
            }}
          >
            <option value="">Custom text</option>
            {eligibleShared.map((shared) => (
              <option key={shared.id} value={shared.id}>
                {shared.label?.trim() || shared.id}
              </option>
            ))}
          </select>
        </label>
        {isLinked ? (
          <button type="button" className="compact shared-variant-unlink-btn" onClick={onUnlink}>
            Unlink
          </button>
        ) : (
          customText.trim().length > 0 && (
            <button type="button" className="compact shared-variant-save-btn" onClick={onSaveAsShared}>
              Save as shared
            </button>
          )
        )}
      </div>

      {isLinked && linkedSharedId && (
        <button type="button" className="shared-variant-linked-badge" onClick={() => onJumpToShared(linkedSharedId)}>
          Linked to {linkedSharedId}
        </button>
      )}

      <VariantField
        label={label}
        value={isLinked ? resolvedText : customText}
        readOnly={isLinked}
        supportsMarkdownLinks={supportsMarkdownLinks && !isLinked}
        onChange={onCustomChange}
      />
    </div>
  )
}
