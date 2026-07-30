import { useId, useRef, type ReactElement, type ReactNode } from "react"
import { expandAccomplishmentDefaults } from "experience-sync/lib/accomplishmentDefaults"
import { resolveAccomplishment } from "experience-sync/lib/resolve"
import type { Accomplishment, Destination } from "experience-sync/lib/schema"
import { SlidersIcon } from "experience-sync/ui/src/components/ActionIcons"
import { HintedInfoButton } from "experience-sync/ui/src/components/HintedInfoButton"
import { VariantField, VariantMarkdownLinkButton, type VariantFieldHandle } from "experience-sync/ui/src/components/VariantField"

const DESTINATION_LABELS: Record<Destination, string> = {
  portfolio: "Portfolio",
  resume: "Resume",
  linkedin: "LinkedIn",
}

/** Destinations with their own non-empty text field that can be reused as alias sources. */
function getAliasSourceOptions(accomplishment: Accomplishment, dest: Destination): Destination[] {
  const currentSource = accomplishment.variantSources?.[dest]

  return accomplishment.destinations.filter((option) => {
    if (option === dest) {
      return false
    }
    if (accomplishment.variantSources?.[option]) {
      return false
    }
    if (option === currentSource) {
      return true
    }
    return (accomplishment.variants[option]?.trim() ?? "") !== ""
  })
}

interface AccomplishmentVariantsProps {
  accomplishment: Accomplishment
  destinationMeta: Record<Destination, { label: string; icon: ReactElement }>
  simpleMode: boolean
  canSimplify: boolean
  destinationSummary: ReactNode
  onCustomize: () => void
  onSimplify: () => void
  onVariantSourceChange: (dest: Destination, sourceDest: Destination | null, resolvedText: string) => void
  onVariantChange: (dest: Destination, next: string) => void
}

/** Wording controls and variant text fields for one accomplishment card. */
export function AccomplishmentVariants({
  accomplishment,
  destinationMeta,
  simpleMode,
  canSimplify,
  destinationSummary,
  onCustomize,
  onSimplify,
  onVariantSourceChange,
  onVariantChange,
}: AccomplishmentVariantsProps): ReactElement {
  const wordingTitleId = useId()
  const portfolioFieldRef = useRef<VariantFieldHandle>(null)
  const expandedAccomplishment = expandAccomplishmentDefaults(accomplishment)
  const resolved = resolveAccomplishment(accomplishment)
  const selected = accomplishment.destinations
  const customDestinations = selected.filter((dest) => !expandedAccomplishment.variantSources?.[dest])
  const showWordingRow = selected.length > 1
  const visibleDestinations = simpleMode ? (["portfolio"] as const) : customDestinations
  const showFooter = simpleMode || canSimplify

  if (selected.length === 0) {
    return <></>
  }

  return (
    <section className="accomplishment-card-section accomplishment-text-fields" aria-label="Wording">
      <div className={`accomplishment-wording-header${simpleMode ? " accomplishment-wording-header-simple" : ""}`}>
        <h4 id={wordingTitleId} className="accomplishment-section-title">
          Wording
          {showWordingRow ? (
            <HintedInfoButton
              label="Same as"
              description="Reuse another destination's text on this bullet, or keep custom wording per channel."
              when='Set Resume to "Same as LinkedIn" when both should match. Switch back to Custom to edit independently.'
            />
          ) : null}
        </h4>
        {simpleMode ? <VariantMarkdownLinkButton onApply={() => portfolioFieldRef.current?.applyLink()} /> : null}
      </div>

      <div className={`accomplishment-expand-panel accomplishment-wording-panel${!simpleMode && showWordingRow ? " expanded" : ""}`}>
        <div className="accomplishment-expand-panel-inner">
          <div className="accomplishment-expand-panel-content">
            <div className="accomplishment-wording">
              <div className="accomplishment-wording-row">
                {selected.map((dest) => {
                  const sourceDestination = expandedAccomplishment.variantSources?.[dest]
                  const aliasOptions = getAliasSourceOptions(expandedAccomplishment, dest)
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
                        disabled={simpleMode}
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
          </div>
        </div>
      </div>

      {visibleDestinations.length > 0 && (
        <div className="accomplishment-variant-fields">
          {visibleDestinations.map((dest) => {
            const meta = destinationMeta[dest]
            const useSimpleLabel = simpleMode && dest === "portfolio"

            return (
              <VariantField
                key={dest}
                ref={useSimpleLabel ? portfolioFieldRef : undefined}
                label={
                  useSimpleLabel ? (
                    "Wording"
                  ) : (
                    <span className="accomplishment-field-label destination-option">
                      {meta.icon}
                      {meta.label}
                    </span>
                  )
                }
                hideLabel={useSimpleLabel}
                labelledBy={useSimpleLabel ? wordingTitleId : undefined}
                linkButtonInSectionHeader={useSimpleLabel}
                value={accomplishment.variants[dest] ?? ""}
                supportsMarkdownLinks={dest === "portfolio" || dest === "linkedin"}
                onChange={(next) => onVariantChange(dest, next)}
              />
            )
          })}
        </div>
      )}

      <div className={`accomplishment-expand-panel accomplishment-footer-panel${showFooter ? " expanded" : ""}`}>
        <div className="accomplishment-expand-panel-inner">
          <div className="accomplishment-expand-panel-content">
            <div className="accomplishment-destination-row">
              {simpleMode ? (
                <button
                  type="button"
                  className="accomplishment-customize-link"
                  aria-label="Customize destinations and wording"
                  onClick={onCustomize}
                >
                  <SlidersIcon size={14} />
                  Customize
                </button>
              ) : canSimplify ? (
                <button type="button" className="accomplishment-customize-link" onClick={onSimplify}>
                  Simple view
                </button>
              ) : null}
              <p className="accomplishment-destination-summary">{destinationSummary}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
