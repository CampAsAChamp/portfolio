import { useMemo, type ReactElement } from "react"
import { DESTINATIONS, type Destination, type SharedVariant } from "experience-sync/lib/schema"
import { TrashIcon } from "experience-sync/ui/src/components/ActionIcons"
import { VariantField } from "experience-sync/ui/src/components/VariantField"

const DESTINATION_LABELS: Record<Destination, string> = {
  portfolio: "Portfolio",
  resume: "Resume",
  linkedin: "LinkedIn",
}

interface SharedVariantsPanelProps {
  sharedVariants: SharedVariant[]
  references: Map<string, string[]>
  selectedId: string | null
  onSelectedIdChange: (id: string | null) => void
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, next: SharedVariant) => void
}

function sharedDisplayName(shared: SharedVariant): string {
  return shared.label?.trim() || shared.id
}

function destinationBadges(shared: SharedVariant): Destination[] {
  return DESTINATIONS.filter((dest) => {
    const text = shared.variants[dest]
    return typeof text === "string" && text.trim().length > 0
  })
}

/** Sidebar CRUD for document-level shared variant library entries. */
export function SharedVariantsPanel({
  sharedVariants,
  references,
  selectedId,
  onSelectedIdChange,
  onAdd,
  onRemove,
  onUpdate,
}: SharedVariantsPanelProps): ReactElement {
  const selectedIndex = useMemo(
    () => (selectedId ? sharedVariants.findIndex((shared) => shared.id === selectedId) : -1),
    [selectedId, sharedVariants],
  )
  const selected = selectedIndex >= 0 ? sharedVariants[selectedIndex] : undefined

  function toggleSharedDestination(index: number, dest: Destination, enabled: boolean): void {
    const current = sharedVariants[index]
    if (!current) return
    const nextVariants = { ...current.variants }
    if (enabled) {
      if (nextVariants[dest] == null) {
        nextVariants[dest] = ""
      }
    } else {
      delete nextVariants[dest]
    }
    onUpdate(index, { ...current, variants: nextVariants })
  }

  return (
    <section className="shared-variants-panel">
      <div className="sidebar-section-header">
        <h2 className="sidebar-shared-heading">Shared variants</h2>
        <button
          type="button"
          className="sidebar-add-btn compact-add"
          onClick={onAdd}
          aria-label="Add shared variant"
          title="Add shared variant"
        >
          +
        </button>
      </div>

      {sharedVariants.length === 0 ? (
        <p className="muted shared-variants-empty">No shared variants yet. Reuse the same bullet text across roles or destinations.</p>
      ) : (
        <ul className="shared-variant-list">
          {sharedVariants.map((shared, index) => {
            const badges = destinationBadges(shared)
            const refCount = references.get(shared.id)?.length ?? 0
            const expanded = shared.id === selectedId
            return (
              <li key={shared.id} className={`shared-variant-item${expanded ? " expanded" : ""}`}>
                <button
                  type="button"
                  className={`shared-variant-trigger${expanded ? " active" : ""}`}
                  aria-expanded={expanded}
                  onClick={() => onSelectedIdChange(expanded ? null : shared.id)}
                >
                  <span className="shared-variant-trigger-name">{sharedDisplayName(shared)}</span>
                  <span className="shared-variant-trigger-meta">
                    {badges.length > 0 ? badges.join(", ") : "empty"}
                    {refCount > 0 ? ` · ${refCount} link${refCount === 1 ? "" : "s"}` : ""}
                  </span>
                </button>

                {expanded && (
                  <div className="shared-variant-editor">
                    <label>
                      Id
                      <input value={shared.id} onChange={(e) => onUpdate(index, { ...shared, id: e.target.value })} />
                    </label>
                    <label>
                      Label <span className="muted">(optional)</span>
                      <input
                        value={shared.label ?? ""}
                        placeholder={shared.id}
                        onChange={(e) => onUpdate(index, { ...shared, label: e.target.value || undefined })}
                      />
                    </label>

                    <p className="muted shared-variant-dest-heading">Destinations to define</p>
                    <div className="destinations shared-variant-destinations">
                      {DESTINATIONS.map((dest) => (
                        <label key={dest}>
                          <input
                            type="checkbox"
                            checked={dest in shared.variants}
                            onChange={(e) => toggleSharedDestination(index, dest, e.target.checked)}
                          />
                          {DESTINATION_LABELS[dest]}
                        </label>
                      ))}
                    </div>

                    {DESTINATIONS.filter((dest) => dest in shared.variants).map((dest) => (
                      <VariantField
                        key={dest}
                        label={`${DESTINATION_LABELS[dest]} text`}
                        value={shared.variants[dest] ?? ""}
                        supportsMarkdownLinks={dest === "portfolio"}
                        onChange={(next) =>
                          onUpdate(index, {
                            ...shared,
                            variants: { ...shared.variants, [dest]: next },
                          })
                        }
                      />
                    ))}

                    <div className="shared-variant-editor-actions">
                      <button
                        type="button"
                        className="icon-action danger"
                        aria-label="Delete shared variant"
                        title={refCount > 0 ? `Used by ${refCount} accomplishment(s)` : "Delete shared variant"}
                        disabled={refCount > 0}
                        onClick={() => {
                          onRemove(index)
                          if (selectedId === shared.id) {
                            onSelectedIdChange(null)
                          }
                        }}
                      >
                        <TrashIcon />
                        <span>Delete</span>
                      </button>
                      {refCount > 0 && <p className="muted shared-variant-ref-note">Unlink all accomplishments before deleting.</p>}
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {selected && selectedIndex >= 0 && <p className="muted shared-variant-editing-note">Editing {sharedDisplayName(selected)}</p>}
    </section>
  )
}
