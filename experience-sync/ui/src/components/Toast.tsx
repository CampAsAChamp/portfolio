import { useEffect, useState, type ReactElement } from "react"
import { CheckIcon, CopyIcon } from "experience-sync/ui/src/components/ActionIcons"

export type ToastKind = "ok" | "error"

export interface ToastMessage {
  id: number
  kind: ToastKind
  text: string
  /** Clipboard actions: animate copy → check. Other ok toasts show a check only. */
  copy?: boolean
}

interface ToastStackProps {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
}

const TOAST_DURATION_MS = 2800
const ERROR_TOAST_DURATION_MS = 5200

/** Single toast row: auto-dismisses and optionally animates copy → check. */
function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }): ReactElement {
  const duration = toast.kind === "error" ? ERROR_TOAST_DURATION_MS : TOAST_DURATION_MS
  const [leaving, setLeaving] = useState(false)
  const [showCheck, setShowCheck] = useState(toast.kind !== "ok" || !toast.copy)

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), duration - 280)
    const removeTimer = window.setTimeout(() => onDismiss(toast.id), duration)
    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(removeTimer)
    }
  }, [toast.id, onDismiss, duration])

  useEffect(() => {
    if (toast.kind !== "ok" || !toast.copy) return
    const checkTimer = window.setTimeout(() => setShowCheck(true), 220)
    return () => window.clearTimeout(checkTimer)
  }, [toast.kind, toast.copy])

  return (
    <div className={`toast${leaving ? " leaving" : ""} ${toast.kind}`} role="status" aria-live="polite">
      {toast.kind === "ok" ? (
        <span className={`toast-icon${showCheck ? " checked" : ""}`} aria-hidden>
          {toast.copy ? (
            <span className="toast-icon-layer copy">
              <CopyIcon />
            </span>
          ) : null}
          <span className="toast-icon-layer check">
            <CheckIcon />
          </span>
        </span>
      ) : null}
      <span className="toast-text">{toast.text}</span>
      <button type="button" className="toast-dismiss" aria-label="Dismiss" onClick={() => onDismiss(toast.id)}>
        ×
      </button>
    </div>
  )
}

/** Stack of transient notifications for save/export feedback. */
export function ToastStack({ toasts, onDismiss }: ToastStackProps): ReactElement | null {
  if (toasts.length === 0) return null

  return (
    <div className="toast-stack" aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
