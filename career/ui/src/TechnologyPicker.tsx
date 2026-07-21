import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type ReactElement,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react"
import InlineSVG from "react-inlinesvg"

import { TrashIcon } from "./ActionIcons"
import { TECHNOLOGY_OPTIONS_ALPHA, TECHNOLOGY_OPTIONS_BY_KEY, type TechnologyOption } from "./technologyCatalog"

interface TechnologyPickerProps {
  value: string[]
  onChange: (next: string[]) => void
}

function TechIcon({ option, size = 18 }: { option: TechnologyOption; size?: number }): ReactElement {
  if (!option.icon) {
    return <span className="tech-icon tech-icon-fallback" style={{ width: size, height: size }} />
  }

  return <InlineSVG className="tech-icon" src={option.icon} width={size} height={size} fill="#6c63ff" title={`${option.label} icon`} />
}

function reorder(list: string[], from: number, to: number): string[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list
  }
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item!)
  return next
}

export function TechnologyPicker({ value, onChange }: TechnologyPickerProps): ReactElement {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const selectedSet = useMemo(() => new Set(value), [value])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return TECHNOLOGY_OPTIONS_ALPHA
    return TECHNOLOGY_OPTIONS_ALPHA.filter((opt) => opt.label.toLowerCase().includes(q) || opt.key.toLowerCase().includes(q))
  }, [query])

  const orderedSelected = useMemo(() => value.map((key) => TECHNOLOGY_OPTIONS_BY_KEY.get(key) ?? { key, label: key, icon: "" }), [value])

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

  function toggleKey(key: string): void {
    if (selectedSet.has(key)) {
      onChange(value.filter((k) => k !== key))
      return
    }
    onChange([...value, key])
  }

  function removeAt(index: number): void {
    onChange(value.filter((_, i) => i !== index))
  }

  function handleDragStart(event: DragEvent<HTMLLIElement>, index: number): void {
    const target = event.target as HTMLElement
    if (target.closest("button")) {
      event.preventDefault()
      return
    }
    setDragIndex(index)
    setOverIndex(index)
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", String(index))
    event.dataTransfer.setDragImage(event.currentTarget, 24, 20)
  }

  function handleDragOver(event: DragEvent<HTMLLIElement>, index: number): void {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
    if (overIndex !== index) setOverIndex(index)
  }

  function handleDrop(event: DragEvent<HTMLLIElement>, index: number): void {
    event.preventDefault()
    const from = dragIndex ?? Number(event.dataTransfer.getData("text/plain"))
    if (Number.isNaN(from)) return
    onChange(reorder(value, from, index))
    setDragIndex(null)
    setOverIndex(null)
  }

  function handleDragEnd(): void {
    setDragIndex(null)
    setOverIndex(null)
  }

  function handleRowKeyDown(event: ReactKeyboardEvent<HTMLLIElement>, index: number): void {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
    event.preventDefault()
    const to = event.key === "ArrowUp" ? index - 1 : index + 1
    onChange(reorder(value, index, to))
  }

  const summary = value.length === 0 ? "Select technologies…" : `${value.length} selected`

  return (
    <div className="tech-picker" ref={rootRef}>
      <h3 className="tech-picker-heading">Technologies</h3>
      <div className="tech-picker-field">
        <button
          type="button"
          className="tech-picker-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((prev) => !prev)}
        >
          <span>{summary}</span>
          <span className="tech-picker-chevron" aria-hidden>
            {open ? "▴" : "▾"}
          </span>
        </button>

        {open ? (
          <div className="tech-picker-dropdown" role="presentation">
            <input
              className="tech-picker-search"
              type="search"
              value={query}
              placeholder="Search…"
              aria-label="Search technologies"
              autoFocus
              onChange={(e) => setQuery(e.target.value)}
            />
            <ul id={listboxId} className="tech-picker-options" role="listbox" aria-multiselectable>
              {filtered.map((opt) => {
                const checked = selectedSet.has(opt.key)
                return (
                  <li key={opt.key} role="option" aria-selected={checked}>
                    <button type="button" className={`tech-picker-option${checked ? " selected" : ""}`} onClick={() => toggleKey(opt.key)}>
                      <span className="tech-picker-check" aria-hidden>
                        {checked ? "✓" : ""}
                      </span>
                      <TechIcon option={opt} />
                      <span>{opt.label}</span>
                    </button>
                  </li>
                )
              })}
              {filtered.length === 0 ? <li className="tech-picker-empty muted">No matches</li> : null}
            </ul>
          </div>
        ) : null}
      </div>

      {orderedSelected.length > 0 ? (
        <div className="tech-order">
          <div className="tech-order-header">
            <span className="tech-order-label-heading">Display order</span>
            <span className="muted">Drag rows to reorder</span>
          </div>
          <ol className="tech-order-list">
            {orderedSelected.map((opt, index) => {
              const isDragging = dragIndex === index
              const isOver = overIndex === index && dragIndex !== null && dragIndex !== index
              return (
                <li
                  key={opt.key}
                  className={`tech-order-item${isDragging ? " dragging" : ""}${isOver ? " drag-over" : ""}`}
                  draggable
                  tabIndex={0}
                  aria-label={`${opt.label}, position ${index + 1}. Drag or use arrow keys to reorder.`}
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragOver={(event) => handleDragOver(event, index)}
                  onDrop={(event) => handleDrop(event, index)}
                  onDragEnd={handleDragEnd}
                  onKeyDown={(event) => handleRowKeyDown(event, index)}
                >
                  <span className="tech-order-handle" aria-hidden>
                    ⋮⋮
                  </span>
                  {opt.icon ? <TechIcon option={opt} /> : <span className="tech-icon tech-icon-fallback" />}
                  <span className="tech-order-label">{opt.label}</span>
                  <button
                    type="button"
                    className="tech-order-btn danger"
                    aria-label={`Remove ${opt.label}`}
                    title="Delete"
                    onClick={() => removeAt(index)}
                  >
                    <TrashIcon />
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      ) : null}
    </div>
  )
}
