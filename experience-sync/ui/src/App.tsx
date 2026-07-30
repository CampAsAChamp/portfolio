import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type AnimationEvent as ReactAnimationEvent,
  type ReactElement,
  type ReactNode,
} from "react"
import { ThemeSwitcher } from "components/NavBar/ThemeSwitcher"
import { expandDocumentDefaults, isDefaultAccomplishmentSetup, isPortfolioOnly } from "experience-sync/lib/accomplishmentDefaults"
import { formatValidationIssue, formatValidationSummary } from "experience-sync/lib/formatValidationIssue"
import { formatLinkedInExport, formatLinkedInExportBlocks, type CompanyExportBlock } from "experience-sync/lib/linkedin"
import { formatResumeExport, formatResumeExportBlocks } from "experience-sync/lib/resume"
import { AccomplishmentVariants } from "experience-sync/ui/src/components/AccomplishmentVariants"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BriefcaseIcon,
  BuildingIcon,
  CopyIcon,
  DocumentIcon,
  GlobeIcon,
  LinkedInIcon,
  SaveIcon,
  TrashIcon,
  UndoIcon,
} from "experience-sync/ui/src/components/ActionIcons"
import { ColorKeyPicker, getColorHex } from "experience-sync/ui/src/components/ColorKeyPicker"
import { LinkedInExportPreviewContent, ResumeExportPreviewContent } from "experience-sync/ui/src/components/ExportPreviewContent"
import { HintedAction } from "experience-sync/ui/src/components/HintedAction"
import { LogoFilePicker } from "experience-sync/ui/src/components/LogoFilePicker"
import { TechnologyPicker } from "experience-sync/ui/src/components/TechnologyPicker"
import { ToastStack, type ToastKind, type ToastMessage } from "experience-sync/ui/src/components/Toast"
import {
  ApiError,
  DESTINATIONS,
  generatePortfolio,
  getRoleEndBeforeStartMessage,
  loadExperiences,
  MONTH_ABBREVS,
  saveExperiences,
  type Destination,
  type ExperiencesDocument,
  type ValidationIssue,
} from "experience-sync/ui/src/lib/api"
import { handleTextCursorShortcutEvent } from "experience-sync/ui/src/lib/textCursorShortcuts"

/** Blank accomplishment with all destinations selected (used when adding a bullet). */
function emptyAccomplishment(id: string) {
  return {
    id,
    destinations: ["portfolio", "resume", "linkedin"] as Destination[],
    variantSources: {
      resume: "portfolio" as Destination,
      linkedin: "portfolio" as Destination,
    },
    variants: { portfolio: "" },
  }
}

const DESTINATION_META: Record<Destination, { label: string; icon: ReactElement }> = {
  portfolio: { label: "Portfolio", icon: <GlobeIcon /> },
  resume: { label: "Resume", icon: <DocumentIcon /> },
  linkedin: { label: "LinkedIn", icon: <LinkedInIcon /> },
}

function buildDestinationSummary(destinations: Destination[]): ReactNode {
  if (isPortfolioOnly(destinations)) {
    const meta = DESTINATION_META.portfolio
    return (
      <span className="destination-option">
        {meta.icon}
        Portfolio only
      </span>
    )
  }

  return destinations.map((dest) => (
    <span key={dest} className="destination-option">
      {DESTINATION_META[dest].icon}
      {DESTINATION_META[dest].label}
    </span>
  ))
}

interface GroupedExportPreviewProps {
  blocks: CompanyExportBlock[]
  emptyMessage: string
  header?: ReactNode
  renderBlock: (block: CompanyExportBlock) => ReactElement
}

interface PreviewSectionHeaderProps {
  icon: ReactNode
  title: string
  copyLabel: string
  copyDescription: string
  copyWhen: string
  onCopy: () => void | Promise<void>
  disabled?: boolean
  spaced?: boolean
}

/** Preview pane section title with destination icon and copy action. */
function PreviewSectionHeader({
  icon,
  title,
  copyLabel,
  copyDescription,
  copyWhen,
  onCopy,
  disabled = false,
  spaced = false,
}: PreviewSectionHeaderProps): ReactElement {
  return (
    <div className={`preview-section-header${spaced ? " preview-section-header-spaced" : ""}`}>
      <div className="preview-section-title">
        {icon}
        <h2>{title}</h2>
      </div>
      <HintedAction label={copyLabel} description={copyDescription} when={copyWhen}>
        <button type="button" className="preview-copy-btn" disabled={disabled} aria-label={copyLabel} onClick={() => void onCopy()}>
          <CopyIcon size={16} />
        </button>
      </HintedAction>
    </div>
  )
}

/** Preview pane content with horizontal rules between companies. */
function GroupedExportPreview({ blocks, emptyMessage, header, renderBlock }: GroupedExportPreviewProps): ReactElement {
  if (blocks.length === 0) {
    return <pre>{emptyMessage}</pre>
  }

  return (
    <div className="preview-blocks">
      {header != null && (
        <pre>
          {header}
          {"\n\n"}
        </pre>
      )}
      {blocks.map((block, index) => (
        <Fragment key={`${block.companyName}-${index}`}>
          {index > 0 && <hr className="preview-company-divider" aria-hidden />}
          <pre>{renderBlock(block)}</pre>
        </Fragment>
      ))}
    </div>
  )
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
  const [busy, setBusy] = useState(false)
  const [reloading, setReloading] = useState(false)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const accomplishmentsListRef = useRef<HTMLDivElement>(null)
  const flipFirstTopsRef = useRef<Map<string, number> | null>(null)
  const pendingAddIdRef = useRef<string | null>(null)
  const [exitingAccomplishmentIds, setExitingAccomplishmentIds] = useState<Set<string>>(() => new Set())
  const [customizedAccomplishmentIds, setCustomizedAccomplishmentIds] = useState<Set<string>>(() => new Set())

  const markAccomplishmentCustomized = useCallback((id: string): void => {
    setCustomizedAccomplishmentIds((current) => {
      if (current.has(id)) {
        return current
      }
      return new Set(current).add(id)
    })
  }, [])

  const markAccomplishmentSimple = useCallback((id: string): void => {
    setCustomizedAccomplishmentIds((current) => {
      if (!current.has(id)) {
        return current
      }
      const next = new Set(current)
      next.delete(id)
      return next
    })
  }, [])

  const showToast = useCallback((text: string, kind: ToastKind = "ok", opts?: { copy?: boolean }): void => {
    setToasts((current) => [...current, { id: Date.now() + Math.random(), kind, text, copy: opts?.copy }])
  }, [])

  const dismissToast = useCallback((id: number): void => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const markBaseline = useCallback((data: ExperiencesDocument): void => {
    setBaselineJson(JSON.stringify(data))
  }, [])

  const syncSavedDocument = useCallback(
    (saved: ExperiencesDocument): ExperiencesDocument => {
      const expanded = expandDocumentDefaults(saved)
      setDoc(expanded)
      markBaseline(expanded)
      return expanded
    },
    [markBaseline],
  )

  const load = useCallback(
    async (opts?: { notify?: boolean }) => {
      setBusy(true)
      try {
        const data = expandDocumentDefaults(await loadExperiences())
        setDoc(data)
        markBaseline(data)
        setCompanyIdx(0)
        setRoleIdx(0)
        setLoadError(null)
        setIssues([])
        setCustomizedAccomplishmentIds(new Set())
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
    [markBaseline, showToast],
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

  const invalidAccomplishmentIndices = useMemo(() => {
    const indices = new Set<number>()
    const prefix = `companies.${companyIdx}.roles.${roleIdx}.accomplishments.`
    for (const issue of displayIssues) {
      if (issue.severity !== "error") continue
      const match = /^companies\.\d+\.roles\.\d+\.accomplishments\.(\d+)/.exec(issue.path)
      if (match && issue.path.startsWith(prefix)) {
        indices.add(Number(match[1]))
      }
    }
    return indices
  }, [displayIssues, companyIdx, roleIdx])

  const linkedinPreviewBlocks = useMemo(() => (doc ? formatLinkedInExportBlocks(doc) : []), [doc])
  const resumePreviewBlocks = useMemo(() => (doc ? formatResumeExportBlocks(doc) : []), [doc])

  function updateDoc(updater: (current: ExperiencesDocument) => ExperiencesDocument): void {
    setDoc((current) => (current ? updater(structuredClone(current)) : current))
  }

  const handleSave = useCallback(async (): Promise<void> => {
    if (!doc || busy) return
    setBusy(true)
    try {
      const result = await saveExperiences(doc)
      syncSavedDocument(result.data)
      setIssues(result.issues ?? [])
      showToast("Saved experiences.yaml")
    } catch (err) {
      if (err instanceof ApiError) {
        setIssues(err.issues)
        showToast(formatValidationSummary(doc, err.issues), "error")
      } else {
        showToast(err instanceof Error ? err.message : String(err), "error")
      }
    } finally {
      setBusy(false)
    }
  }, [busy, doc, showToast, syncSavedDocument])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "s") return
      event.preventDefault()
      void handleSave()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handleSave])

  useEffect(() => {
    window.addEventListener("keydown", handleTextCursorShortcutEvent, true)
    return () => window.removeEventListener("keydown", handleTextCursorShortcutEvent, true)
  }, [])

  async function handleGenerate(): Promise<void> {
    setBusy(true)
    try {
      if (doc) {
        syncSavedDocument((await saveExperiences(doc)).data)
      }
      const out = await generatePortfolio()
      showToast(`Generated ${out}`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), "error")
    } finally {
      setBusy(false)
    }
  }

  async function handleCopyLinkedIn(): Promise<void> {
    if (!doc) return
    setBusy(true)
    try {
      const saved = syncSavedDocument((await saveExperiences(doc)).data)
      const text = formatLinkedInExport(saved)
      await navigator.clipboard.writeText(text)
      showToast("LinkedIn copy ready", "ok", { copy: true })
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), "error")
    } finally {
      setBusy(false)
    }
  }

  async function handleExportResume(): Promise<void> {
    if (!doc) return
    setBusy(true)
    try {
      const saved = syncSavedDocument((await saveExperiences(doc)).data)
      const text = formatResumeExport(saved)
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
    const id = newId(`${role.id}-bullet`)
    pendingAddIdRef.current = id
    updateDoc((d) => {
      const r = d.companies[companyIdx]!.roles[roleIdx]!
      r.accomplishments.push(emptyAccomplishment(id))
      return d
    })
  }

  const finalizeRemoveAccomplishment = useCallback(
    (id: string): void => {
      setExitingAccomplishmentIds((current) => {
        if (!current.has(id)) return current
        const next = new Set(current)
        next.delete(id)
        return next
      })
      flipFirstTopsRef.current = captureAccomplishmentTops(accomplishmentsListRef.current)
      updateDoc((d) => {
        const accomplishments = d.companies[companyIdx]!.roles[roleIdx]!.accomplishments
        const index = accomplishments.findIndex((acc) => acc.id === id)
        if (index >= 0) accomplishments.splice(index, 1)
        return d
      })
    },
    [companyIdx, roleIdx, updateDoc],
  )

  function removeAccomplishment(index: number): void {
    const acc = role?.accomplishments[index]
    if (!acc || exitingAccomplishmentIds.has(acc.id)) return

    if (prefersReducedMotion()) {
      updateDoc((d) => {
        d.companies[companyIdx]!.roles[roleIdx]!.accomplishments.splice(index, 1)
        return d
      })
      return
    }

    setExitingAccomplishmentIds((current) => new Set(current).add(acc.id))
  }

  function handleAccomplishmentExitAnimationEnd(id: string, event: ReactAnimationEvent<HTMLElement>): void {
    if (event.animationName !== "accomplishment-exit") return
    if (!exitingAccomplishmentIds.has(id)) return
    finalizeRemoveAccomplishment(id)
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

  useEffect(() => {
    setExitingAccomplishmentIds(new Set())
  }, [companyIdx, roleIdx])

  useLayoutEffect(() => {
    const root = accomplishmentsListRef.current

    const firstTops = flipFirstTopsRef.current
    if (firstTops) {
      flipFirstTopsRef.current = null
      playAccomplishmentFlip(root, firstTops)
    }

    const addId = pendingAddIdRef.current
    if (!addId) return
    pendingAddIdRef.current = null

    const el = root?.querySelector<HTMLElement>(`[data-accomplishment-id="${CSS.escape(addId)}"]`)
    if (!el) return

    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "nearest" })

    if (prefersReducedMotion()) return

    el.classList.add("accomplishment-card-entering")
    const onEnd = (event: globalThis.AnimationEvent): void => {
      if (event.animationName !== "accomplishment-enter") return
      el.classList.remove("accomplishment-card-entering")
      el.removeEventListener("animationend", onEnd)
    }
    el.addEventListener("animationend", onEnd)
  }, [doc])

  function toggleDestination(accIdx: number, dest: Destination): void {
    const acc = doc?.companies[companyIdx]?.roles[roleIdx]?.accomplishments[accIdx]
    if (!acc) return
    markAccomplishmentCustomized(acc.id)
    if (acc.destinations.includes(dest) && acc.destinations.length === 1) {
      showToast("At least one destination is required", "error")
      return
    }

    updateDoc((d) => {
      const current = d.companies[companyIdx]!.roles[roleIdx]!.accomplishments[accIdx]!
      const set = new Set(current.destinations)
      if (set.has(dest)) {
        set.delete(dest)
        delete current.variants[dest]
        if (current.variantSources?.[dest]) {
          delete current.variantSources[dest]
          if (Object.keys(current.variantSources).length === 0) {
            delete current.variantSources
          }
        }
        for (const other of DESTINATIONS) {
          if (current.variantSources?.[other] === dest) {
            delete current.variantSources[other]
          }
        }
        if (current.variantSources && Object.keys(current.variantSources).length === 0) {
          delete current.variantSources
        }
      } else {
        set.add(dest)
        if (!current.variants[dest] && !current.variantSources?.[dest]) {
          if (dest !== "portfolio" && set.has("portfolio")) {
            current.variantSources ??= {}
            current.variantSources[dest] = "portfolio"
          } else {
            current.variants[dest] = ""
          }
        }
      }
      current.destinations = DESTINATIONS.filter((x) => set.has(x))
      return d
    })
  }

  function setVariantSource(accIdx: number, dest: Destination, sourceDest: Destination | null, resolvedText: string): void {
    const acc = doc?.companies[companyIdx]?.roles[roleIdx]?.accomplishments[accIdx]
    if (acc) {
      markAccomplishmentCustomized(acc.id)
    }
    updateDoc((d) => {
      const acc = d.companies[companyIdx]!.roles[roleIdx]!.accomplishments[accIdx]!
      if (sourceDest) {
        acc.variantSources ??= {}
        acc.variantSources[dest] = sourceDest
        delete acc.variants[dest]
      } else if (acc.variantSources?.[dest]) {
        delete acc.variantSources[dest]
        if (Object.keys(acc.variantSources).length === 0) {
          delete acc.variantSources
        }
        acc.variants[dest] = resolvedText
      }
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
                    {formatValidationIssue(doc, issue)}
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
                <div className="grid-3 company-primary-fields">
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
                </div>
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

              <section className="card accomplishments-card">
                <div className="card-header">
                  <h3>Accomplishments</h3>
                </div>

                {role.accomplishments.length === 0 ? (
                  <p className="muted accomplishments-empty">No bullets yet.</p>
                ) : (
                  <div className="accomplishments-list" ref={accomplishmentsListRef}>
                    {role.accomplishments.map((acc, ai) => {
                      const showAdvanced = !isDefaultAccomplishmentSetup(acc) || customizedAccomplishmentIds.has(acc.id)
                      const canSimplify = isDefaultAccomplishmentSetup(acc) && customizedAccomplishmentIds.has(acc.id)

                      return (
                        <section
                          className={`accomplishment-card${invalidAccomplishmentIndices.has(ai) ? " accomplishment-card-invalid" : ""}${exitingAccomplishmentIds.has(acc.id) ? " accomplishment-card-exiting" : ""}`}
                          data-accomplishment-id={acc.id}
                          key={acc.id}
                          onAnimationEnd={(event) => handleAccomplishmentExitAnimationEnd(acc.id, event)}
                        >
                          <div className="accomplishment-card-header">
                            <h4 className="accomplishment-card-title">Bullet {ai + 1}</h4>
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
                                disabled={exitingAccomplishmentIds.has(acc.id)}
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </div>

                          <div
                            className={`accomplishment-expand-panel accomplishment-destinations-panel${showAdvanced ? " expanded" : ""}`}
                          >
                            <div className="accomplishment-expand-panel-inner">
                              <section
                                className="accomplishment-card-section accomplishment-destinations accomplishment-expand-panel-content"
                                aria-label="Destinations"
                                aria-hidden={!showAdvanced}
                              >
                                <h4 className="accomplishment-section-title">Destinations</h4>
                                <div className="destinations">
                                  {DESTINATIONS.map((dest) => {
                                    const meta = DESTINATION_META[dest]
                                    return (
                                      <label key={dest}>
                                        <input
                                          type="checkbox"
                                          checked={acc.destinations.includes(dest)}
                                          disabled={!showAdvanced}
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
                              </section>
                            </div>
                          </div>

                          <AccomplishmentVariants
                            accomplishment={acc}
                            destinationMeta={DESTINATION_META}
                            simpleMode={!showAdvanced}
                            canSimplify={canSimplify}
                            destinationSummary={buildDestinationSummary(acc.destinations)}
                            onCustomize={() => markAccomplishmentCustomized(acc.id)}
                            onSimplify={() => markAccomplishmentSimple(acc.id)}
                            onVariantSourceChange={(dest, sourceDest, resolvedText) => setVariantSource(ai, dest, sourceDest, resolvedText)}
                            onVariantChange={(dest, next) =>
                              updateDoc((d) => {
                                d.companies[companyIdx]!.roles[roleIdx]!.accomplishments[ai]!.variants[dest] = next
                                return d
                              })
                            }
                          />
                        </section>
                      )
                    })}
                  </div>
                )}

                <div className="accomplishments-footer">
                  <button type="button" className="add-bullet-btn" onClick={addAccomplishment}>
                    + Bullet
                  </button>
                </div>
              </section>

              {companyIssues.length > 0 && (
                <ul className="issues">
                  {companyIssues.map((issue) => (
                    <li key={`${issue.path}-${issue.message}`} className={issue.severity}>
                      {formatValidationIssue(doc, issue)}
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
          <PreviewSectionHeader
            icon={<LinkedInIcon />}
            title="LinkedIn preview"
            copyLabel="Copy LinkedIn"
            copyDescription="Saves YAML if needed, then copies LinkedIn-ready plain text to the clipboard."
            copyWhen="You're ready to paste experience bullets into LinkedIn."
            disabled={busy}
            onCopy={handleCopyLinkedIn}
          />
          <div className="preview">
            <GroupedExportPreview
              blocks={linkedinPreviewBlocks}
              emptyMessage="No LinkedIn-tagged bullets yet."
              renderBlock={(block) => <LinkedInExportPreviewContent block={block} />}
            />
          </div>
          <PreviewSectionHeader
            icon={<DocumentIcon />}
            title="Resume preview"
            copyLabel="Copy resume"
            copyDescription="Saves YAML if needed, then copies resume markdown to the clipboard."
            copyWhen="You're ready to paste the Experience section into your resume."
            disabled={busy}
            spaced
            onCopy={handleExportResume}
          />
          <div className="preview">
            <GroupedExportPreview
              blocks={resumePreviewBlocks}
              emptyMessage="No resume-tagged bullets yet."
              header={<span className="preview-section-heading"># Experience</span>}
              renderBlock={(block) => <ResumeExportPreviewContent block={block} />}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
