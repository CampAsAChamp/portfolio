import { DESTINATIONS, MONTH_ABBREVS, type Destination, type ExperiencesDocument, type ValidationIssue } from "../../lib/schema"

export class ApiError extends Error {
  issues: ValidationIssue[]

  constructor(message: string, issues: ValidationIssue[] = []) {
    super(message)
    this.issues = issues
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  })
  const data = (await res.json()) as T & { error?: string; issues?: ValidationIssue[] }
  if (!res.ok) {
    const message = data.error ?? (data.issues?.map((i) => `${i.path}: ${i.message}`).join("\n") || `Request failed: ${res.status}`)
    throw new ApiError(message, data.issues ?? [])
  }
  return data
}

export async function listFiles(): Promise<string[]> {
  const data = await request<{ files: string[] }>("/api/files")
  return data.files
}

export async function loadExperiences(): Promise<ExperiencesDocument> {
  const data = await request<{ data: ExperiencesDocument }>("/api/files/experiences.yaml")
  return data.data
}

export async function saveExperiences(doc: ExperiencesDocument): Promise<{ issues: ValidationIssue[] }> {
  return request<{ ok: boolean; issues: ValidationIssue[] }>("/api/files/experiences.yaml", {
    method: "PUT",
    body: JSON.stringify({ data: doc }),
  })
}

export async function generatePortfolio(): Promise<string> {
  const data = await request<{ path: string }>("/api/generate", { method: "POST" })
  return data.path
}

export async function exportLinkedIn(): Promise<string> {
  const data = await request<{ text: string }>("/api/export/linkedin")
  return data.text
}

export async function exportResume(): Promise<string> {
  const data = await request<{ text: string }>("/api/export/resume")
  return data.text
}

export { DESTINATIONS, MONTH_ABBREVS }
export type { Destination, ExperiencesDocument, ValidationIssue }
