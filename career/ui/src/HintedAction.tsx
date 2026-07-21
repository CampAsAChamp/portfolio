import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react"

interface HintedActionProps {
  label: string
  description: string
  when: string
  children: ReactNode
}

/** Wraps a topbar control with a hover/focus tip explaining what it does and when to use it. */
export function HintedAction({ label, description, when, children }: HintedActionProps): ReactElement {
  const tipId = useId()
  const child = Children.only(children)

  const control = isValidElement<{ "aria-describedby"?: string }>(child)
    ? cloneElement(child, {
        "aria-describedby": [child.props["aria-describedby"], tipId].filter(Boolean).join(" ") || tipId,
      })
    : child

  return (
    <span className="hinted-action">
      {control}
      <span id={tipId} className="action-hint" role="tooltip">
        <strong className="action-hint-label">{label}</strong>
        <span className="action-hint-body">{description}</span>
        <span className="action-hint-when">
          <span className="action-hint-when-label">When:</span> {when}
        </span>
      </span>
    </span>
  )
}
