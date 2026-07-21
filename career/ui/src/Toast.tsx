import { useEffect, useState, type ReactElement } from "react"

import { CheckIcon, CopyIcon } from "./ActionIcons"

export type ToastKind = "ok" | "error"

export interface ToastMessage {
  id: number
  kind: ToastKind
  text: string
}

interface ToastStackProps {
  toasts: ToastMessage[]
  onDismiss: (id: number) => void
}

const TOAST_DURATION_MS = 2800

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: number) => void }): ReactElement {
  const [leaving, setLeaving] = useState(false)
  const [showCheck, setShowCheck] = useState(toast.kind !== "ok")

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), TOAST_DURATION_MS - 280)
    const removeTimer = window.setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS)
    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(removeTimer)
    }
  }, [toast.id, onDismiss])

  useEffect(() => {
    if (toast.kind !== "ok") return
    const checkTimer = window.setTimeout(() => setShowCheck(true), 220)
    return () => window.clearTimeout(checkTimer)
  }, [toast.kind])

  return (
    <div className={`toast${leaving ? " leaving" : ""} ${toast.kind}`} role="status" aria-live="polite">
      {toast.kind === "ok" ? (
        <span className={`toast-icon${showCheck ? " checked" : ""}`} aria-hidden>
          <span className="toast-icon-layer copy">
            <CopyIcon />
          </span>
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
