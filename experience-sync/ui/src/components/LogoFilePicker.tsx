import { useEffect, useId, useMemo, useRef, useState, type ReactElement } from "react"
import { LOGO_OPTIONS, LOGO_OPTIONS_BY_FILE } from "experience-sync/ui/src/catalogs/logoCatalog"

interface LogoFilePickerProps {
  value: string
  onChange: (next: string) => void
}

function logoDisplayName(file: string): string {
  return file.replace(/\.[^.]+$/, "")
}

/** Dropdown picker for company logos under `assets/Company_Logos/`. */
export function LogoFilePicker({ value, onChange }: LogoFilePickerProps): ReactElement {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const known = useMemo(() => LOGO_OPTIONS_BY_FILE.has(value), [value])
  const selected = LOGO_OPTIONS_BY_FILE.get(value)

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  function selectFile(file: string): void {
    onChange(file)
    setOpen(false)
  }

  return (
    <div className="logo-file-picker" ref={rootRef}>
      <span className="logo-file-label">Logo</span>
      <div className="logo-file-field">
        <button
          type="button"
          className="logo-file-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((prev) => !prev)}
        >
          {known && selected ? (
            <img src={selected.url} alt="" className="logo-file-trigger-img" />
          ) : (
            <span className="logo-file-trigger-img unknown" aria-hidden />
          )}
          <span className="logo-file-trigger-text">{known ? logoDisplayName(value) : `Unknown: ${value || "—"}`}</span>
          <span className="logo-file-chevron" aria-hidden>
            {open ? "▴" : "▾"}
          </span>
        </button>

        {open ? (
          <ul id={listboxId} className="logo-file-dropdown" role="listbox" aria-label="Company logos">
            {LOGO_OPTIONS.map((opt) => {
              const isSelected = opt.file === value
              return (
                <li key={opt.file} role="option" aria-selected={isSelected}>
                  <button type="button" className={`logo-file-option${isSelected ? " selected" : ""}`} onClick={() => selectFile(opt.file)}>
                    <img src={opt.url} alt="" className="logo-file-option-img" />
                    <span className="logo-file-option-label">{logoDisplayName(opt.file)}</span>
                    <span className="logo-file-option-check" aria-hidden>
                      {isSelected ? "✓" : ""}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>

      {LOGO_OPTIONS.length === 0 ? <p className="muted logo-file-empty">No logos found in assets/Company_Logos/</p> : null}
    </div>
  )
}
