import { type ReactElement } from "react"
import { InfoIcon } from "experience-sync/ui/src/components/ActionIcons"
import { HintedAction } from "experience-sync/ui/src/components/HintedAction"

interface HintedInfoButtonProps {
  label: string
  description: string
  when: string
  size?: number
}

/** Compact info icon that reveals a hover/focus tooltip explaining a control or section. */
export function HintedInfoButton({ label, description, when, size = 14 }: HintedInfoButtonProps): ReactElement {
  return (
    <HintedAction label={label} description={description} when={when}>
      <button type="button" className="info-hint-btn" aria-label={`About ${label}`}>
        <InfoIcon size={size} />
      </button>
    </HintedAction>
  )
}
