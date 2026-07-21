import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react"

import {
  ApiError,
  DESTINATIONS,
  exportLinkedIn,
  exportResume,
  generatePortfolio,
  listFiles,
  loadExperiences,
  MONTH_ABBREVS,
  saveExperiences,
  type Destination,
  type ExperiencesDocument,
  type ValidationIssue,
} from "./api"

function emptyAccomplishment(id: string) {
  return {
    id,
    destinations: ["portfolio"] as Destination[],
    variants: { portfolio: "" },
  }
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || `item-${Date.now()}`
  )
}

export function App(): ReactElement {
  const [files, setFiles] = useState<string[]>([])
  const [doc, setDoc] = useState<ExperiencesDocument | null>(null)
  const [companyIdx, setCompanyIdx] = useState(0)
  const [roleIdx, setRoleIdx] = useState(0)
  const [status, setStatus] = useState<string>("Loading…")
  const [statusKind, setStatusKind] = useState<"ok" | "error" | "">("")
  const [issues, setIssues] = useState<ValidationIssue[]>([])
  const [linkedinPreview, setLinkedinPreview] = useState("")
  const [resumePreview, setResumePreview] = useState("")
  const [busy, setBusy] = useState(false)

  const refreshPreviews = useCallback(async () => {
    try {
      const [li, resume] = await Promise.all([exportLinkedIn(), exportResume()])
      setLinkedinPreview(li)
      setResumePreview(resume)
    } catch {
      // previews optional until saved
    }
  }, [])

  const load = useCallback(async () => {
    setBusy(true)
    try {
      const fileList = await listFiles()
      setFiles(fileList)
      const data = await loadExperiences()
      setDoc(data)
      setCompanyIdx(0)
      setRoleIdx(0)
      setStatus("Loaded experiences.yaml")
      setStatusKind("ok")
      setIssues([])
      await refreshPreviews()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err))
      setStatusKind("error")
    } finally {
      setBusy(false)
    }
  }, [refreshPreviews])

  useEffect(() => {
    void load()
  }, [load])

  const company = doc?.companies[companyIdx]
  const role = company?.roles[roleIdx]

  const companyIssues = useMemo(() => {
    if (!company) return []
    const prefix = `companies.${companyIdx}`
    return issues.filter((i) => i.path === prefix || i.path.startsWith(`${prefix}.`))
  }, [issues, company, companyIdx])

  function updateDoc(updater: (current: ExperiencesDocument) => ExperiencesDocument): void {
    setDoc((current) => (current ? updater(structuredClone(current)) : current))
  }

  async function handleSave(): Promise<void> {
    if (!doc) return
    setBusy(true)
    try {
      const result = await saveExperiences(doc)
      setIssues(result.issues ?? [])
      setStatus("Saved experiences.yaml")
      setStatusKind("ok")
      await refreshPreviews()
    } catch (err) {
      if (err instanceof ApiError) {
        setIssues(err.issues)
      }
      setStatus(err instanceof Error ? err.message : String(err))
      setStatusKind("error")
    } finally {
      setBusy(false)
    }
  }

  async function handleGenerate(): Promise<void> {
    setBusy(true)
    try {
      if (doc) {
        await saveExperiences(doc)
      }
      const out = await generatePortfolio()
      setStatus(`Generated ${out}`)
      setStatusKind("ok")
      await refreshPreviews()
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err))
      setStatusKind("error")
    } finally {
      setBusy(false)
    }
  }

  async function handleCopyLinkedIn(): Promise<void> {
    setBusy(true)
    try {
      if (doc) {
        await saveExperiences(doc)
      }
      const text = await exportLinkedIn()
      await navigator.clipboard.writeText(text)
      setLinkedinPreview(text)
      setStatus("LinkedIn export copied to clipboard")
      setStatusKind("ok")
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err))
      setStatusKind("error")
    } finally {
      setBusy(false)
    }
  }

  async function handleExportResume(): Promise<void> {
    setBusy(true)
    try {
      if (doc) {
        await saveExperiences(doc)
      }
      const text = await exportResume()
      setResumePreview(text)
      await navigator.clipboard.writeText(text)
      setStatus("Resume export copied to clipboard (also under career/exports after CLI sync)")
      setStatusKind("ok")
    } catch (err) {
      setStatus(err instanceof Error ? err.message : String(err))
      setStatusKind("error")
    } finally {
      setBusy(false)
    }
  }

  function addCompany(): void {
    updateDoc((d) => {
      const id = `company-${d.companies.length + 1}`
      d.companies.push({
        id,
        companyName: "New Company",
        location: "",
        colorKey: "PURPLE",
        logoFile: "Intuit.svg",
        technologies: [],
        roles: [
          {
            id: `${id}-role`,
            position: "Software Engineer",
            start: { month: "Jan", year: new Date().getFullYear() },
            accomplishments: [emptyAccomplishment(`${id}-bullet-1`)],
          },
        ],
      })
      return d
    })
    setCompanyIdx(doc?.companies.length ?? 0)
    setRoleIdx(0)
  }

  function addRole(): void {
    if (!company) return
    updateDoc((d) => {
      const c = d.companies[companyIdx]!
      const id = `${c.id}-role-${c.roles.length + 1}`
      c.roles.push({
        id,
        position: "New Role",
        start: { month: "Jan", year: new Date().getFullYear() },
        accomplishments: [emptyAccomplishment(`${id}-bullet-1`)],
      })
      return d
    })
    setRoleIdx(company.roles.length)
  }

  function addAccomplishment(): void {
    if (!company || !role) return
    updateDoc((d) => {
      const r = d.companies[companyIdx]!.roles[roleIdx]!
      r.accomplishments.push(emptyAccomplishment(`${r.id}-${slugify(String(Date.now()))}`))
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
    updateDoc((d) => {
      const list = d.companies[companyIdx]!.roles[roleIdx]!.accomplishments
      const next = index + delta
      if (next < 0 || next >= list.length) return d
      const [item] = list.splice(index, 1)
      list.splice(next, 0, item!)
      return d
    })
  }

  function toggleDestination(accIdx: number, dest: Destination): void {
    updateDoc((d) => {
      const acc = d.companies[companyIdx]!.roles[roleIdx]!.accomplishments[accIdx]!
      const set = new Set(acc.destinations)
      if (set.has(dest)) {
        set.delete(dest)
      } else {
        set.add(dest)
        if (!acc.variants[dest]) {
          acc.variants[dest] = ""
        }
      }
      acc.destinations = DESTINATIONS.filter((x) => set.has(x))
      return d
    })
  }

  if (!doc) {
    return (
      <div className="app">
        <header className="topbar">
          <h1>Career Content Editor</h1>
          <p className={`status ${statusKind}`}>{status}</p>
        </header>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Career Content Editor</h1>
          <p className={`status ${statusKind}`}>{status}</p>
        </div>
        <div className="topbar-actions">
          <button type="button" disabled={busy} onClick={() => void load()}>
            Reload
          </button>
          <button type="button" className="primary" disabled={busy} onClick={() => void handleSave()}>
            Save YAML
          </button>
          <button type="button" disabled={busy} onClick={() => void handleGenerate()}>
            Generate portfolio
          </button>
          <button type="button" disabled={busy} onClick={() => void handleCopyLinkedIn()}>
            Copy LinkedIn
          </button>
          <button type="button" disabled={busy} onClick={() => void handleExportResume()}>
            Copy resume
          </button>
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <h2>Content files</h2>
          <ul className="file-list">
            {files.map((file) => (
              <li key={file}>
                <button type="button" className={file === "experiences.yaml" ? "active" : ""}>
                  {file}
                </button>
              </li>
            ))}
          </ul>

          <h2 style={{ marginTop: "1.5rem" }}>Companies</h2>
          <ul className="nav-list">
            {doc.companies.map((c, ci) => (
              <li key={c.id}>
                <button
                  type="button"
                  className={ci === companyIdx ? "active" : ""}
                  onClick={() => {
                    setCompanyIdx(ci)
                    setRoleIdx(0)
                  }}
                >
                  {c.companyName}
                </button>
                {ci === companyIdx &&
                  c.roles.map((r, ri) => (
                    <button key={r.id} type="button" className={`role ${ri === roleIdx ? "active" : ""}`} onClick={() => setRoleIdx(ri)}>
                      {r.position}
                      <span className="meta">
                        {r.start.month} {r.start.year}
                        {r.end ? ` – ${r.end.month} ${r.end.year}` : " – Present"}
                      </span>
                    </button>
                  ))}
              </li>
            ))}
          </ul>
          <div className="row-actions" style={{ marginTop: "0.75rem" }}>
            <button type="button" onClick={addCompany}>
              + Company
            </button>
            <button type="button" onClick={addRole} disabled={!company}>
              + Role
            </button>
          </div>

          {issues.length > 0 && (
            <>
              <h2 style={{ marginTop: "1.5rem" }}>Validation</h2>
              <ul className="issues">
                {issues.map((issue) => (
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
                  <label>
                    ID
                    <input
                      value={company.id}
                      onChange={(e) =>
                        updateDoc((d) => {
                          d.companies[companyIdx]!.id = e.target.value
                          return d
                        })
                      }
                    />
                  </label>
                  <label>
                    Color key
                    <input
                      value={company.colorKey}
                      onChange={(e) =>
                        updateDoc((d) => {
                          d.companies[companyIdx]!.colorKey = e.target.value
                          return d
                        })
                      }
                    />
                  </label>
                  <label>
                    Logo file
                    <input
                      value={company.logoFile}
                      onChange={(e) =>
                        updateDoc((d) => {
                          d.companies[companyIdx]!.logoFile = e.target.value
                          return d
                        })
                      }
                    />
                  </label>
                  <label>
                    Technologies (comma-separated keys)
                    <input
                      value={company.technologies.join(", ")}
                      onChange={(e) =>
                        updateDoc((d) => {
                          d.companies[companyIdx]!.technologies = e.target.value
                            .split(",")
                            .map((t) => t.trim())
                            .filter(Boolean)
                          return d
                        })
                      }
                    />
                  </label>
                </div>
              </section>

              <section className="card">
                <div className="card-header">
                  <h3>Role</h3>
                </div>
                <div className="grid-2">
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
                  <label>
                    Role ID
                    <input
                      value={role.id}
                      onChange={(e) =>
                        updateDoc((d) => {
                          d.companies[companyIdx]!.roles[roleIdx]!.id = e.target.value
                          return d
                        })
                      }
                    />
                  </label>
                  <label>
                    Start month
                    <select
                      value={role.start.month}
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
                      onChange={(e) =>
                        updateDoc((d) => {
                          d.companies[companyIdx]!.roles[roleIdx]!.start.year = Number(e.target.value)
                          return d
                        })
                      }
                    />
                  </label>
                  <label>
                    End month
                    <select
                      value={role.end?.month ?? ""}
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
                  <label>
                    End year
                    <input
                      type="number"
                      disabled={!role.end}
                      value={role.end?.year ?? ""}
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
              </section>

              <div className="card-header">
                <h2>Accomplishments</h2>
                <button type="button" onClick={addAccomplishment}>
                  + Bullet
                </button>
              </div>

              {role.accomplishments.map((acc, ai) => (
                <section className="card" key={acc.id}>
                  <div className="card-header">
                    <h3>#{ai + 1}</h3>
                    <div className="row-actions">
                      <button type="button" onClick={() => moveAccomplishment(ai, -1)} disabled={ai === 0}>
                        Up
                      </button>
                      <button type="button" onClick={() => moveAccomplishment(ai, 1)} disabled={ai === role.accomplishments.length - 1}>
                        Down
                      </button>
                      <button type="button" className="danger" onClick={() => removeAccomplishment(ai)}>
                        Delete
                      </button>
                    </div>
                  </div>

                  <label>
                    ID
                    <input
                      value={acc.id}
                      onChange={(e) =>
                        updateDoc((d) => {
                          d.companies[companyIdx]!.roles[roleIdx]!.accomplishments[ai]!.id = e.target.value
                          return d
                        })
                      }
                    />
                  </label>

                  <div>
                    <p className="muted" style={{ margin: "0 0 0.4rem" }}>
                      Destinations
                    </p>
                    <div className="destinations">
                      {DESTINATIONS.map((dest) => (
                        <label key={dest}>
                          <input type="checkbox" checked={acc.destinations.includes(dest)} onChange={() => toggleDestination(ai, dest)} />
                          {dest}
                        </label>
                      ))}
                    </div>
                  </div>

                  {DESTINATIONS.filter((d) => acc.destinations.includes(d)).map((dest) => (
                    <label key={dest}>
                      {dest} variant
                      {dest === "portfolio" ? " (supports [text](url) markdown links)" : ""}
                      <textarea
                        value={acc.variants[dest] ?? ""}
                        onChange={(e) =>
                          updateDoc((d) => {
                            d.companies[companyIdx]!.roles[roleIdx]!.accomplishments[ai]!.variants[dest] = e.target.value
                            return d
                          })
                        }
                      />
                    </label>
                  ))}
                </section>
              ))}

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
          <h2 style={{ marginTop: "1.25rem" }}>Resume preview</h2>
          <div className="preview">
            <pre>{resumePreview || "No resume-tagged bullets yet."}</pre>
          </div>
        </aside>
      </div>
    </div>
  )
}
