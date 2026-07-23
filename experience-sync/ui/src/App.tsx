import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactElement } from "react"
import { ThemeSwitcher } from "components/NavBar/ThemeSwitcher"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BriefcaseIcon,
  BuildingIcon,
  DocumentIcon,
  GlobeIcon,
  LinkedInIcon,
  SaveIcon,
  TrashIcon,
  UndoIcon,
} from "experience-sync/ui/src/components/ActionIcons"
import { ColorKeyPicker, getColorHex } from "experience-sync/ui/src/components/ColorKeyPicker"
import { HintedAction } from "experience-sync/ui/src/components/HintedAction"
import { LogoFilePicker } from "experience-sync/ui/src/components/LogoFilePicker"
import { TechnologyPicker } from "experience-sync/ui/src/components/TechnologyPicker"
import { ToastStack, type ToastKind, type ToastMessage } from "experience-sync/ui/src/components/Toast"
import { VariantField } from "experience-sync/ui/src/components/VariantField"
import {
  ApiError,
  DESTINATIONS,
  exportLinkedIn,
  exportResume,
  generatePortfolio,
  getRoleEndBeforeStartMessage,
  loadExperiences,
  MONTH_ABBREVS,
  saveExperiences,
  type Destination,
  type ExperiencesDocument,
  type ValidationIssue,
} from "experience-sync/ui/src/lib/api"

/** Blank accomplishment with portfolio destination selected (used when adding a bullet). */
function emptyAccomplishment(id: string) {
  return {
    id,
    destinations: ["portfolio"] as Destination[],
    variants: { portfolio: "" },
  }
}

const DESTINATION_META: Record<Destination, { label: string; icon: ReactElement }> = {
  portfolio: { label: "Portfolio", icon: <GlobeIcon /> },
  resume: { label: "Resume", icon: <DocumentIcon /> },
  linkedin: { label: "LinkedIn", icon: <LinkedInIcon /> },
}

/** Stable internal ids for YAML / React keys — not shown in the editor. */
function newId(prefix: string): string {
  const suffix = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : String(Date.now())
  return `${prefix}-${suffix}`
}

/** Respect OS “reduce motion” so FLIP reorder animations are skipped. */
function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/** Snapshot each accomplishment card's viewport top for FLIP animations. */
function captureAccomplishmentTops(root: HTMLElement | null): Map<string, number> {
  const tops = new Map<string, number>()
  if (!root) return tops
  root.querySelectorAll<HTMLElement>("[data-accomplishment-id]").forEach((el) => {
    const id = el.dataset.accomplishmentId
    if (id) tops.set(id, el.getBoundingClientRect().top)
  })
  return tops
}

/**
 * Animate accomplishment cards from previous tops to new layout (FLIP).
 * No-ops when reduced motion is preferred or the delta is negligible.
 */
function playAccomplishmentFlip(root: HTMLElement | null, firstTops: Map<string, number>): void {
  if (!root || firstTops.size === 0 || prefersReducedMotion()) return

  root.querySelectorAll<HTMLElement>("[data-accomplishment-id]").forEach((el) => {
    const id = el.dataset.accomplishmentId
    if (!id) return
    const firstTop = firstTops.get(id)
    if (firstTop == null) return

    const dy = firstTop - el.getBoundingClientRect().top
    if (Math.abs(dy) < 1) return

    el.style.transition = "none"
    el.style.transform = `translateY(${dy}px)`
    void el.offsetHeight

    el.classList.add("accomplishment-card-flipping")
    el.style.transition = ""
    el.style.transform = ""

    const clear = (event: TransitionEvent): void => {
      if (event.propertyName !== "transform") return
      el.classList.remove("accomplishment-card-flipping")
      el.removeEventListener("transitionend", clear)
    }
    el.addEventListener("transitionend", clear)
  })
}

/**
 * Local experience editor: edit companies/roles/accomplishments, save YAML,
 * and preview LinkedIn/resume exports against the Vite-mounted API.
 */
export function App(): ReactElement {
  const [doc, setDoc] = useState<ExperiencesDocument | null>(null)
  const [baselineJson, setBaselineJson] = useState<string | null>(null)
  const [companyIdx, setCompanyIdx] = useState(0)
  const [roleIdx, setRoleIdx] = useState(0)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [issues, setIssues] = useState<ValidationIssue[]>([])
  const [linkedinPreview, setLinkedinPreview] = useState("")
  const [resumePreview, setResumePreview] = useState("")
  const [busy, setBusy] = useState(false)
  const [reloading, setReloading] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const accomplishmentsListRef = useRef<HTMLDivElement>(null)
  const flipFirstTopsRef = useRef<Map<string, number> | null>(null)

  const showToast = useCallback((text: string, kind: ToastKind = "ok", opts?: { copy?: boolean }): void => {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), kind, text, copy: opts?.copy }])
  }, [])

  const dismissToast = useCallback((id: number): void => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const markBaseline = useCallback((data: ExperiencesDocument): void => {
    setBaselineJson(JSON.stringify(data))
  }, [])

  const refreshPreviews = useCallback(async () => {
    try {
      const [li, resume] = await Promise.all([exportLinkedIn(), exportResume()])
      setLinkedinPreview(li)
      setResumePreview(resume)
    } catch {
      // previews optional until saved
    }
  }, [])

  const load = useCallback(
    async (opts?: { notify?: boolean }) => {
      setBusy(true)
      try {
        const data = await loadExperiences()
        setDoc(data)
        markBaseline(data)
        setCompanyIdx(0)
        setRoleIdx(0)
        setLoadError(null)
        setIssues([])
        await refreshPreviews()
        if (opts?.notify) {
          showToast("Reloaded experiences.yaml")
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        setLoadError(message)
        showToast(message, "error")
      } finally {
        setBusy(false)
      }
    },
    [markBaseline, refreshPreviews, showToast],
  )

  useEffect(() => {
    void load()
  }, [load])

  const dirty = doc != null && baselineJson != null && JSON.stringify(doc) !== baselineJson

  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (event: BeforeUnloadEvent): void => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => window.removeEventListener("beforeunload", onBeforeUnload)
  }, [dirty])

  async function handleDiscard(): Promise<void> {
    if (reloading || !dirty) return
    setReloading(true)
    const started = performance.now()
    try {
      await load({ notify: true })
    } finally {
      const elapsed = performance.now() - started
      const remaining = Math.max(0, 700 - elapsed)
      if (remaining > 0) {
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, remaining)
        })
      }
      setReloading(false)
    }
  }

  const company = doc?.companies[companyIdx]
  const role = company?.roles[roleIdx]
  const canDeleteCompany = (doc?.companies.length ?? 0) > 1
  const canDeleteRole = (company?.roles.length ?? 0) > 1

  const roleDateError = useMemo(() => {
    if (!role?.end) return null
    return getRoleEndBeforeStartMessage(role.start, role.end)
  }, [role])

  const displayIssues = useMemo(() => {
    const path = `companies.${companyIdx}.roles.${roleIdx}.end`
    const rest = issues.filter((i) => i.path !== path)
    if (!roleDateError) return rest
    return [...rest, { path, message: roleDateError, severity: "error" as const }]
  }, [issues, roleDateError, companyIdx, roleIdx])

  const companyIssues = useMemo(() => {
    if (!company) return []
    const prefix = `companies.${companyIdx}`
    return displayIssues.filter((i) => i.path === prefix || i.path.startsWith(`${prefix}.`))
  }, [displayIssues, company, companyIdx])

  function updateDoc(updater: (current: ExperiencesDocument) => ExperiencesDocument): void {
    setDoc((current) => (current ? updater(structuredClone(current)) : current))
  }

  const handleSave = useCallback(async (): Promise<void> => {
    if (!doc || busy) return
    setBusy(true)
    try {
      const result = await saveExperiences(doc)
      setIssues(result.issues ?? [])
      markBaseline(doc)
      showToast("Saved experiences.yaml")
      await refreshPreviews()
    } catch (err) {
      if (err instanceof ApiError) {
        setIssues(err.issues)
      }
      showToast(err instanceof Error ? err.message : String(err), "error")
    } finally {
      setBusy(false)
    }
  }, [busy, doc, markBaseline, refreshPreviews, showToast])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "s") return
      event.preventDefault()
      void handleSave()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handleSave])

  async function handleGenerate(): Promise<void> {
    setBusy(true)
    try {
      if (doc) {
        await saveExperiences(doc)
        markBaseline(doc)
      }
      const out = await generatePortfolio()
      showToast(`Generated ${out}`)
      await refreshPreviews()
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), "error")
    } finally {
      setBusy(false)
    }
  }

  async function handleCopyLinkedIn(): Promise<void> {
    setBusy(true)
    try {
      if (doc) {
        await saveExperiences(doc)
        markBaseline(doc)
      }
      const text = await exportLinkedIn()
      await navigator.clipboard.writeText(text)
      setLinkedinPreview(text)
      showToast("LinkedIn copy ready", "ok", { copy: true })
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), "error")
    } finally {
      setBusy(false)
    }
  }

  async function handleExportResume(): Promise<void> {
    setBusy(true)
    try {
      if (doc) {
        await saveExperiences(doc)
        markBaseline(doc)
      }
      const text = await exportResume()
      setResumePreview(text)
      await navigator.clipboard.writeText(text)
      showToast("Resume copy ready", "ok", { copy: true })
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), "error")
    } finally {
      setBusy(false)
    }
  }

  function addCompany(): void {
    updateDoc((d) => {
      const id = newId("company")
      const roleId = newId(`${id}-role`)
      d.companies.push({
        id,
        companyName: "New Company",
        location: "",
        colorKey: "PURPLE",
        logoFile: "Intuit.svg",
        technologies: [],
        roles: [
          {
            id: roleId,
            position: "Software Engineer",
            start: { month: "Jan", year: new Date().getFullYear() },
            accomplishments: [emptyAccomplishment(newId(`${roleId}-bullet`))],
          },
        ],
      })
      return d
    })
    setCompanyIdx(doc?.companies.length ?? 0)
    setRoleIdx(0)
  }

  function removeCompany(ci: number): void {
    if (!doc || doc.companies.length <= 1) return
    const name = doc.companies[ci]?.companyName || "this company"
    if (!window.confirm(`Delete ${name} and all its roles?`)) return

    updateDoc((d) => {
      d.companies.splice(ci, 1)
      return d
    })
    setCompanyIdx((prev) => {
      const nextLen = doc.companies.length - 1
      if (ci < prev) return prev - 1
      if (ci === prev) return Math.min(prev, nextLen - 1)
      return prev
    })
    setRoleIdx(0)
  }

  function addRole(): void {
    if (!company) return
    updateDoc((d) => {
      const c = d.companies[companyIdx]!
      const id = newId(`${c.id}-role`)
      c.roles.push({
        id,
        position: "New Role",
        start: { month: "Jan", year: new Date().getFullYear() },
        accomplishments: [emptyAccomplishment(newId(`${id}-bullet`))],
      })
      return d
    })
    setRoleIdx(company.roles.length)
  }

  function removeRole(ci: number, ri: number): void {
    const target = doc?.companies[ci]
    if (!target || target.roles.length <= 1) return
    const name = target.roles[ri]?.position || "this role"
    if (!window.confirm(`Delete role "${name}"?`)) return

    updateDoc((d) => {
      d.companies[ci]!.roles.splice(ri, 1)
      return d
    })
    if (ci === companyIdx) {
      setRoleIdx((prev) => {
        const nextLen = target.roles.length - 1
        if (ri < prev) return prev - 1
        if (ri === prev) return Math.min(prev, nextLen - 1)
        return prev
      })
    }
  }

  function addAccomplishment(): void {
    if (!company || !role) return
    updateDoc((d) => {
      const r = d.companies[companyIdx]!.roles[roleIdx]!
      r.accomplishments.push(emptyAccomplishment(newId(`${r.id}-bullet`)))
      return d
    })
  }

  function removeAccomplishment(index: number): void {
    updateDoc((d) => {
      d.companies[companyIdx]!.roles[roleIdx]!.accomplishments.splice(index, 1)
      return d
    })
  }

  function moveAccomplishment(index: number, delta: number): void {
    const list = doc?.companies[companyIdx]?.roles[roleIdx]?.accomplishments
    const next = index + delta
    if (!list || next < 0 || next >= list.length) return

    flipFirstTopsRef.current = captureAccomplishmentTops(accomplishmentsListRef.current)
    updateDoc((d) => {
      const accomplishments = d.companies[companyIdx]!.roles[roleIdx]!.accomplishments
      const [item] = accomplishments.splice(index, 1)
      accomplishments.splice(next, 0, item!)
      return d
    })
  }

  useLayoutEffect(() => {
    const firstTops = flipFirstTopsRef.current
    if (!firstTops) return
    flipFirstTopsRef.current = null
    playAccomplishmentFlip(accomplishmentsListRef.current, firstTops)
  }, [doc])

  function toggleDestination(accIdx: number, dest: Destination): void {
    const acc = doc?.companies[companyIdx]?.roles[roleIdx]?.accomplishments[accIdx]
    if (!acc) return
    if (acc.destinations.includes(dest) && acc.destinations.length === 1) {
      showToast("At least one destination is required", "error")
      return
    }

    updateDoc((d) => {
      const current = d.companies[companyIdx]!.roles[roleIdx]!.accomplishments[accIdx]!
      const set = new Set(current.destinations)
      if (set.has(dest)) {
        set.delete(dest)
      } else {
        set.add(dest)
        if (!current.variants[dest]) {
          current.variants[dest] = ""
        }
      }
      current.destinations = DESTINATIONS.filter((x) => set.has(x))
      return d
    })
  }

  if (!doc) {
    return (
      <div className="app">
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
        <header className="topbar">
          <div className="topbar-meta">
            <h1>Experience Sync Editor</h1>
          </div>
        </header>
        <main className="editor load-state">
          {loadError ? (
            <p className="load-error" role="alert">
              {loadError}
            </p>
          ) : (
            <p className="muted">Loading experiences.yaml…</p>
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
      <header className="topbar">
        <div className="topbar-meta">
          <h1>Experience Sync Editor</h1>
          {dirty && (
            <span className="unsaved-badge" aria-live="polite">
              Unsaved
            </span>
          )}
        </div>
        <div className="topbar-actions">
          <div className="topbar-file-actions">
            <HintedAction
              label="Discard unsaved changes"
              description="Throws away editor edits and reloads experience-sync/content/experiences.yaml from disk."
              when="The YAML changed outside this UI, or you want to undo all edits since the last save."
            >
              <button
                type="button"
                className={`ghost icon-action discard-btn${reloading ? " spinning" : ""}`}
                disabled={busy || reloading || !dirty}
                onClick={() => void handleDiscard()}
              >
                <UndoIcon />
                <span>Discard</span>
              </button>
            </HintedAction>
            <HintedAction
              label="Save YAML"
              description="Writes the current editor state to experience-sync/content/experiences.yaml and refreshes LinkedIn/resume previews."
              when="You're done editing, or before Generate / Copy. Does not update the live portfolio by itself."
            >
              <button type="button" className="ghost icon-action" disabled={busy} onClick={() => void handleSave()}>
                <SaveIcon />
                <span>Save YAML</span>
              </button>
            </HintedAction>
          </div>
          <span className="topbar-divider" aria-hidden />
          <button type="button" className="ghost icon-action" disabled={busy} onClick={() => void handleGenerate()}>
            <GlobeIcon />
            <span>Generate portfolio</span>
          </button>
          <button type="button" className="ghost icon-action" disabled={busy} onClick={() => void handleExportResume()}>
            <DocumentIcon />
            <span>Copy resume</span>
          </button>
          <button type="button" className="ghost icon-action" disabled={busy} onClick={() => void handleCopyLinkedIn()}>
            <LinkedInIcon />
            <span>Copy LinkedIn</span>
          </button>
          <ThemeSwitcher />
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-section-header">
            <h2>Companies</h2>
            <div className="row-actions">
              <button type="button" className="sidebar-add-btn" onClick={addCompany} aria-label="Add company" title="Add Company">
                <BuildingIcon />
                <span className="sidebar-add-plus" aria-hidden>
                  +
                </span>
              </button>
              <button
                type="button"
                className="sidebar-add-btn"
                onClick={addRole}
                disabled={!company}
                aria-label="Add role"
                title="Add Role"
              >
                <BriefcaseIcon />
                <span className="sidebar-add-plus" aria-hidden>
                  +
                </span>
              </button>
            </div>
          </div>
          <ul className="company-accordion">
            {doc.companies.map((c, ci) => {
              const expanded = ci === companyIdx
              const brandColor = getColorHex(c.colorKey)
              return (
                <li key={c.id} className={`company-accordion-item${expanded ? " expanded" : ""}`}>
                  <button
                    type="button"
                    className={`company-accordion-trigger${expanded ? " active" : ""}`}
                    aria-expanded={expanded}
                    onClick={() => {
                      setCompanyIdx(ci)
                      setRoleIdx(0)
                    }}
                  >
                    <span className="company-accordion-chevron" aria-hidden>
                      ▾
                    </span>
                    <span className="company-accordion-name" style={brandColor ? { color: brandColor } : undefined}>
                      {c.companyName || "Untitled company"}
                    </span>
                    <span className="company-accordion-count">{c.roles.length}</span>
                  </button>
                  <div className="company-accordion-panel">
                    <div className="company-accordion-panel-inner">
                      <ul className="role-list">
                        {c.roles.map((r, ri) => (
                          <li key={r.id}>
                            <button
                              type="button"
                              className={`role-item${expanded && ri === roleIdx ? " active" : ""}`}
                              tabIndex={expanded ? 0 : -1}
                              onClick={() => {
                                setCompanyIdx(ci)
                                setRoleIdx(ri)
                              }}
                            >
                              <span className="role-item-title">{r.position || "Untitled role"}</span>
                              <span className="role-item-meta">
                                {r.start.month} {r.start.year}
                                {r.end ? ` – ${r.end.month} ${r.end.year}` : " – Present"}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {displayIssues.length > 0 && (
            <>
              <h2 className="sidebar-validation-heading">Validation</h2>
              <ul className="issues">
                {displayIssues.map((issue) => (
                  <li key={`${issue.path}-${issue.message}`} className={issue.severity}>
                    <strong>{issue.severity}</strong>: {issue.path} — {issue.message}
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>

        <main className="editor">
          {company && role ? (
            <div className="stack">
              <section className="card">
                <div className="card-header">
                  <h3>Company</h3>
                  <button
                    type="button"
                    className="icon-action danger"
                    aria-label="Delete company"
                    title={canDeleteCompany ? "Delete company" : "At least one company is required"}
                    disabled={!canDeleteCompany}
                    onClick={() => removeCompany(companyIdx)}
                  >
                    <TrashIcon />
                  </button>
                </div>
                <div className="grid-2">
                  <label>
                    Name
                    <input
                      value={company.companyName}
                      onChange={(e) =>
                        updateDoc((d) => {
                          d.companies[companyIdx]!.companyName = e.target.value
                          return d
                        })
                      }
                    />
                  </label>
                  <label>
                    Location
                    <input
                      value={company.location}
                      onChange={(e) =>
                        updateDoc((d) => {
                          d.companies[companyIdx]!.location = e.target.value
                          return d
                        })
                      }
                    />
                  </label>
                </div>
                <ColorKeyPicker
                  value={company.colorKey}
                  onChange={(colorKey) =>
                    updateDoc((d) => {
                      d.companies[companyIdx]!.colorKey = colorKey
                      return d
                    })
                  }
                />
                <LogoFilePicker
                  value={company.logoFile}
                  onChange={(logoFile) =>
                    updateDoc((d) => {
                      d.companies[companyIdx]!.logoFile = logoFile
                      return d
                    })
                  }
                />
                <TechnologyPicker
                  value={company.technologies}
                  onChange={(technologies) =>
                    updateDoc((d) => {
                      d.companies[companyIdx]!.technologies = technologies
                      return d
                    })
                  }
                />
              </section>

              <section className="card">
                <div className="card-header">
                  <h3>Role</h3>
                  <button
                    type="button"
                    className="icon-action danger"
                    aria-label="Delete role"
                    title={canDeleteRole ? "Delete role" : "At least one role is required"}
                    disabled={!canDeleteRole}
                    onClick={() => removeRole(companyIdx, roleIdx)}
                  >
                    <TrashIcon />
                  </button>
                </div>
                <label>
                  Position
                  <input
                    value={role.position}
                    onChange={(e) =>
                      updateDoc((d) => {
                        d.companies[companyIdx]!.roles[roleIdx]!.position = e.target.value
                        return d
                      })
                    }
                  />
                </label>
                <div className="grid-2">
                  <label>
                    Start month
                    <select
                      value={role.start.month}
                      aria-invalid={roleDateError ? true : undefined}
                      onChange={(e) =>
                        updateDoc((d) => {
                          d.companies[companyIdx]!.roles[roleIdx]!.start.month = e.target.value as (typeof MONTH_ABBREVS)[number]
                          return d
                        })
                      }
                    >
                      {MONTH_ABBREVS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Start year
                    <input
                      type="number"
                      value={role.start.year}
                      aria-invalid={roleDateError ? true : undefined}
                      onChange={(e) =>
                        updateDoc((d) => {
                          d.companies[companyIdx]!.roles[roleIdx]!.start.year = Number(e.target.value)
                          return d
                        })
                      }
                    />
                  </label>
                  <label className={roleDateError ? "field-invalid" : undefined}>
                    End month
                    <select
                      value={role.end?.month ?? ""}
                      aria-invalid={roleDateError ? true : undefined}
                      aria-describedby={roleDateError ? "role-date-error" : undefined}
                      onChange={(e) =>
                        updateDoc((d) => {
                          const r = d.companies[companyIdx]!.roles[roleIdx]!
                          if (!e.target.value) {
                            delete r.end
                          } else {
                            r.end = {
                              month: e.target.value as (typeof MONTH_ABBREVS)[number],
                              year: r.end?.year ?? r.start.year,
                            }
                          }
                          return d
                        })
                      }
                    >
                      <option value="">Present</option>
                      {MONTH_ABBREVS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={!role.end ? "field-disabled" : roleDateError ? "field-invalid" : undefined}>
                    End year
                    <input
                      type="number"
                      disabled={!role.end}
                      value={role.end?.year ?? ""}
                      placeholder={role.end ? undefined : "—"}
                      aria-invalid={roleDateError ? true : undefined}
                      aria-describedby={roleDateError ? "role-date-error" : undefined}
                      onChange={(e) =>
                        updateDoc((d) => {
                          const r = d.companies[companyIdx]!.roles[roleIdx]!
                          if (!r.end) return d
                          r.end.year = Number(e.target.value)
                          return d
                        })
                      }
                    />
                  </label>
                </div>
                {roleDateError && (
                  <p id="role-date-error" className="field-error" role="alert">
                    {roleDateError}
                  </p>
                )}
              </section>

              <section className="card">
                <div className="card-header">
                  <h3>Accomplishments</h3>
                  <button type="button" className="compact" onClick={addAccomplishment}>
                    + Bullet
                  </button>
                </div>

                {role.accomplishments.length === 0 ? (
                  <p className="muted accomplishments-empty">No bullets yet. Use + Bullet to add one.</p>
                ) : (
                  <div className="accomplishments-list" ref={accomplishmentsListRef}>
                    {role.accomplishments.map((acc, ai) => (
                      <section className="accomplishment-card" data-accomplishment-id={acc.id} key={acc.id}>
                        <div>
                          <div className="card-header accomplishment-destinations-header">
                            <p className="muted">Destinations</p>
                            <div className="row-actions">
                              <button
                                type="button"
                                className="icon-action move-up"
                                aria-label="Move accomplishment up"
                                title="Move up"
                                onClick={() => moveAccomplishment(ai, -1)}
                                disabled={ai === 0}
                              >
                                <ArrowUpIcon />
                              </button>
                              <button
                                type="button"
                                className="icon-action move-down"
                                aria-label="Move accomplishment down"
                                title="Move down"
                                onClick={() => moveAccomplishment(ai, 1)}
                                disabled={ai === role.accomplishments.length - 1}
                              >
                                <ArrowDownIcon />
                              </button>
                              <button
                                type="button"
                                className="icon-action danger"
                                aria-label="Delete accomplishment"
                                title="Delete"
                                onClick={() => removeAccomplishment(ai)}
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </div>
                          <div className="destinations">
                            {DESTINATIONS.map((dest) => {
                              const meta = DESTINATION_META[dest]
                              return (
                                <label key={dest}>
                                  <input
                                    type="checkbox"
                                    checked={acc.destinations.includes(dest)}
                                    onChange={() => toggleDestination(ai, dest)}
                                  />
                                  <span className="destination-option">
                                    {meta.icon}
                                    {meta.label}
                                  </span>
                                </label>
                              )
                            })}
                          </div>
                        </div>

                        {DESTINATIONS.filter((d) => acc.destinations.includes(d)).map((dest) => {
                          const meta = DESTINATION_META[dest]
                          return (
                            <VariantField
                              key={dest}
                              label={
                                <span className="destination-option">
                                  {meta.icon}
                                  {meta.label} variant
                                </span>
                              }
                              value={acc.variants[dest] ?? ""}
                              supportsMarkdownLinks={dest === "portfolio"}
                              onChange={(next) =>
                                updateDoc((d) => {
                                  d.companies[companyIdx]!.roles[roleIdx]!.accomplishments[ai]!.variants[dest] = next
                                  return d
                                })
                              }
                            />
                          )
                        })}
                      </section>
                    ))}
                  </div>
                )}
              </section>

              {companyIssues.length > 0 && (
                <ul className="issues">
                  {companyIssues.map((issue) => (
                    <li key={`${issue.path}-${issue.message}`} className={issue.severity}>
                      {issue.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="muted">Select a company and role.</p>
          )}
        </main>

        <aside className="preview-pane">
          <h2>LinkedIn preview</h2>
          <div className="preview">
            <pre>{linkedinPreview || "No LinkedIn-tagged bullets yet."}</pre>
          </div>
          <h2 className="preview-heading-spaced">Resume preview</h2>
          <div className="preview">
            <pre>{resumePreview || "No resume-tagged bullets yet."}</pre>
          </div>
        </aside>
      </div>
    </div>
  )
}
