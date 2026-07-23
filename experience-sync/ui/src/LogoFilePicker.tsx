import { useMemo, type ReactElement } from "react"

import { LOGO_OPTIONS, LOGO_OPTIONS_BY_FILE } from "experience-sync/ui/src/logoCatalog"

interface LogoFilePickerProps {
  value: string
  onChange: (next: string) => void
}

/** Grid picker for company logos under `assets/Company_Logos/`. */
export function LogoFilePicker({ value, onChange }: LogoFilePickerProps): ReactElement {
  const known = useMemo(() => LOGO_OPTIONS_BY_FILE.has(value), [value])

  return (
    <div className="logo-file-picker">
      <span className="logo-file-label">Logo</span>

      {!known && value ? (
        <p className="muted logo-file-missing">
          Current value <strong>{value}</strong> was not found in assets/Company_Logos/
        </p>
      ) : null}

      <div className="logo-file-grid" role="listbox" aria-label="Company logos">
        {LOGO_OPTIONS.map((opt) => {
          const active = opt.file === value
          return (
            <button
              key={opt.file}
              type="button"
              role="option"
              aria-selected={active}
              className={`logo-file-option${active ? " selected" : ""}`}
              title={opt.file}
              onClick={() => onChange(opt.file)}
            >
              <img src={opt.url} alt="" />
              <span>{opt.file.replace(/\.[^.]+$/, "")}</span>
            </button>
          )
        })}
      </div>

      {LOGO_OPTIONS.length === 0 ? <p className="muted">No logos found in assets/Company_Logos/</p> : null}
    </div>
  )
}
