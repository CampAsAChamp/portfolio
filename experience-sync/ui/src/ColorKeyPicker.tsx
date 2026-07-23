import { useEffect, useId, useRef, useState, type ReactElement } from "react"
import { COLORS } from "data/colors"

/** Dropdown options derived from `src/data/colors` (`COLORS` keys + hex). */
export const COLOR_OPTIONS = (Object.keys(COLORS) as Array<keyof typeof COLORS>).map((key) => ({
  key,
  hex: COLORS[key],
}))

/** Resolve a `colorKey` to its hex from `COLORS`, or `undefined` if unknown. */
export function getColorHex(colorKey: string): string | undefined {
  return COLORS[colorKey as keyof typeof COLORS]
}

interface ColorKeyPickerProps {
  value: string
  onChange: (next: string) => void
}

/** Pick a brand `colorKey` from `COLORS` (not a raw hex) for company accent styling. */
export function ColorKeyPicker({ value, onChange }: ColorKeyPickerProps): ReactElement {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const hex = getColorHex(value)
  const known = Boolean(hex)

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

  function selectKey(key: string): void {
    onChange(key)
    setOpen(false)
  }

  return (
    <div className="color-key-picker" ref={rootRef}>
      <span className="color-key-label">Brand color</span>
      <div className="color-key-field">
        <button
          type="button"
          className="color-key-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span className={`color-key-swatch${known ? "" : " unknown"}`} style={known ? { backgroundColor: hex } : undefined} aria-hidden />
          <span className="color-key-trigger-text" style={known ? { color: hex } : undefined}>
            {known ? value : `Unknown: ${value || "—"}`}
          </span>
          {known ? <span className="color-key-hex muted">{hex}</span> : null}
          <span className="color-key-chevron" aria-hidden>
            {open ? "▴" : "▾"}
          </span>
        </button>

        {open ? (
          <ul id={listboxId} className="color-key-dropdown" role="listbox" aria-label="Brand colors">
            {COLOR_OPTIONS.map((opt) => {
              const selected = opt.key === value
              return (
                <li key={opt.key} role="option" aria-selected={selected}>
                  <button type="button" className={`color-key-option${selected ? " selected" : ""}`} onClick={() => selectKey(opt.key)}>
                    <span className="color-key-swatch" style={{ backgroundColor: opt.hex }} aria-hidden />
                    <span className="color-key-option-label" style={{ color: opt.hex }}>
                      {opt.key}
                    </span>
                    <span className="color-key-hex muted">{opt.hex}</span>
                    <span className="color-key-option-check" aria-hidden>
                      {selected ? "✓" : ""}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        ) : null}
      </div>
      <span className="muted color-key-hint">
        {known ? (
          <>
            Resolves to <code>{hex}</code> via <code>COLORS.{value}</code>
          </>
        ) : (
          <>
            Pick a key from <code>src/data/colors.ts</code> (not a raw hex)
          </>
        )}
      </span>
    </div>
  )
}
