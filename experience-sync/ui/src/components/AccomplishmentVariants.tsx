import { type ReactElement } from "react"
import { resolveAccomplishment } from "experience-sync/lib/resolve"
import type { Accomplishment, Destination } from "experience-sync/lib/schema"
import { HintedInfoButton } from "experience-sync/ui/src/components/HintedInfoButton"
import { VariantField } from "experience-sync/ui/src/components/VariantField"

const DESTINATION_LABELS: Record<Destination, string> = {
  portfolio: "Portfolio",
  resume: "Resume",
  linkedin: "LinkedIn",
}

interface AccomplishmentVariantsProps {
  accomplishment: Accomplishment
  destinationMeta: Record<Destination, { label: string; icon: ReactElement }>
  onVariantSourceChange: (dest: Destination, sourceDest: Destination | null, resolvedText: string) => void
  onVariantChange: (dest: Destination, next: string) => void
}

/** Wording controls and variant text fields for one accomplishment card. */
export function AccomplishmentVariants({
  accomplishment,
  destinationMeta,
  onVariantSourceChange,
  onVariantChange,
}: AccomplishmentVariantsProps): ReactElement {
  const resolved = resolveAccomplishment(accomplishment)
  const selected = accomplishment.destinations
  const customDestinations = selected.filter((dest) => !accomplishment.variantSources?.[dest])
  const showWordingRow = selected.length > 1

  if (selected.length === 0) {
    return <></>
  }

  return (
    <section className="accomplishment-card-section accomplishment-text-fields" aria-label="Text">
      <h4 className="accomplishment-section-title">
        Text
        {showWordingRow && (
          <HintedInfoButton
            label="Wording"
            description="Reuse another destination's text on this bullet, or keep custom wording per channel."
            when='Set Resume to "Same as LinkedIn" when both should match. Switch back to Custom to edit independently.'
          />
        )}
      </h4>

      {showWordingRow && (
        <div className="accomplishment-wording">
          <div className="accomplishment-wording-row">
            {selected.map((dest) => {
              const sourceDestination = accomplishment.variantSources?.[dest]
              const aliasOptions = selected.filter((option) => option !== dest)
              const meta = destinationMeta[dest]

              return (
                <label key={dest} className="accomplishment-wording-source">
                  <span className="accomplishment-field-label destination-option">
                    {meta.icon}
                    {meta.label}
                  </span>
                  <select
                    value={sourceDestination ?? ""}
                    aria-label={`${meta.label} wording source`}
                    onChange={(e) => {
                      const value = e.target.value as Destination | ""
                      onVariantSourceChange(dest, value ? value : null, resolved.variants[dest] ?? "")
                    }}
                  >
                    <option value="">Custom</option>
                    {aliasOptions.map((option) => (
                      <option key={option} value={option}>
                        Same as {DESTINATION_LABELS[option]}
                      </option>
                    ))}
                  </select>
                </label>
              )
            })}
          </div>
        </div>
      )}

      {customDestinations.length > 0 && (
        <div className="accomplishment-variant-fields">
          {customDestinations.map((dest) => {
            const meta = destinationMeta[dest]
            return (
              <VariantField
                key={dest}
                label={
                  <span className="accomplishment-field-label destination-option">
                    {meta.icon}
                    {meta.label}
                  </span>
                }
                value={accomplishment.variants[dest] ?? ""}
                supportsMarkdownLinks={dest === "portfolio" || dest === "linkedin"}
                onChange={(next) => onVariantChange(dest, next)}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
