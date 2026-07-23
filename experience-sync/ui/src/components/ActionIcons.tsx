import type { ReactElement } from "react"
import LinkedInLogo from "assets/Dev_Icons/LinkedIn.svg"
import InlineSVG from "react-inlinesvg"

interface IconProps {
  size?: number
}

/** Decorative up-arrow icon for reorder controls. */
export function ArrowUpIcon({ size = 16 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Decorative down-arrow icon for reorder controls. */
export function ArrowDownIcon({ size = 16 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Decorative trash icon for delete actions. */
export function TrashIcon({ size = 16 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 6H21M8 6V4H16V6M19 6V20A2 2 0 0 1 17 22H7A2 2 0 0 1 5 20V6"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11V17M14 11V17" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  )
}

/** Decorative undo/discard icon for reverting unsaved edits. */
export function UndoIcon({ size = 18 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 14L4 9L9 4" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4 9H14.5A5.5 5.5 0 0 1 20 14.5V14.5A5.5 5.5 0 0 1 14.5 20H11"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** LinkedIn brand mark used in destination labels and export actions. */
export function LinkedInIcon({ size = 16 }: IconProps): ReactElement {
  return <InlineSVG className="linkedin-icon" src={LinkedInLogo} width={size} height={size} aria-hidden />
}

/** Decorative save/floppy icon for persisting YAML. */
export function SaveIcon({ size = 16 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H16L21 8V19A2 2 0 0 1 19 21Z"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Decorative copy icon (also used in clipboard toasts before the check animates in). */
export function CopyIcon({ size = 18 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="9"
        y="9"
        width="13"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 15H4A2 2 0 0 1 2 13V4A2 2 0 0 1 4 2H13A2 2 0 0 1 15 4V5"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Decorative success checkmark icon for toasts and confirmations. */
export function CheckIcon({ size = 18 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.25" />
      <path d="M8 12.5L10.8 15.2L16.2 9" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Decorative building icon for company UI chrome. */
export function BuildingIcon({ size = 16 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 21H21M5 21V7L12 3L19 7V21M9 21V14H15V21M9 10H9.01M15 10H15.01M9 13H9.01M15 13H15.01"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Decorative briefcase icon for role UI chrome. */
export function BriefcaseIcon({ size = 16 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 7V5A2 2 0 0 1 10 3H14A2 2 0 0 1 16 5V7M4 7H20A2 2 0 0 1 22 9V19A2 2 0 0 1 20 21H4A2 2 0 0 1 2 19V9A2 2 0 0 1 4 7Z"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12 12V12.01" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  )
}

/** Decorative globe icon for the portfolio destination. */
export function GlobeIcon({ size = 16 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.25" />
      <path
        d="M3 12H21M12 3C14.5 6.5 14.5 17.5 12 21C9.5 17.5 9.5 6.5 12 3Z"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Decorative document icon for the resume destination. */
export function DocumentIcon({ size = 16 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 2H7A2 2 0 0 0 5 4V20A2 2 0 0 0 7 22H17A2 2 0 0 0 19 20V7L14 2Z"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 2V7H19M9 13H15M9 17H13" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Decorative link icon for the markdown-link insert control. */
export function LinkIcon({ size = 16 }: IconProps): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 17H7A5 5 0 0 1 7 7H9" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7H17A5 5 0 0 1 17 17H15" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 12H16" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
    </svg>
  )
}
