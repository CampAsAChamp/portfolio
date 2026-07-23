import {
  DESTINATIONS,
  getRoleEndBeforeStartMessage,
  MONTH_ABBREVS,
  type Destination,
  type ExperiencesDocument,
  type ValidationIssue,
} from "experience-sync/lib/schema"

/** Thrown when an experience-sync API request fails; may include validation `issues`. */
export class ApiError extends Error {
  issues: ValidationIssue[]

  constructor(message: string, issues: ValidationIssue[] = []) {
    super(message)
    this.issues = issues
  }
}

/** Fetch JSON from the local `/api` and throw {@link ApiError} on non-OK responses. */
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

/** Load the on-disk `experiences.yaml` document via the API. */
export async function loadExperiences(): Promise<ExperiencesDocument> {
  const data = await request<{ data: ExperiencesDocument }>("/api/files/experiences.yaml")
  return data.data
}

/**
 * Validate and persist experiences to YAML.
 * @returns Validation issues (warnings may still accompany a successful save)
 */
export async function saveExperiences(doc: ExperiencesDocument): Promise<{ issues: ValidationIssue[] }> {
  return request<{ ok: boolean; issues: ValidationIssue[] }>("/api/files/experiences.yaml", {
    method: "PUT",
    body: JSON.stringify({ data: doc }),
  })
}

/** Generate `src/data/experiences.ts` from the saved YAML; returns the output path. */
export async function generatePortfolio(): Promise<string> {
  const data = await request<{ path: string }>("/api/generate", { method: "POST" })
  return data.path
}

/** Fetch LinkedIn-ready plain text from the API. */
export async function exportLinkedIn(): Promise<string> {
  const data = await request<{ text: string }>("/api/export/linkedin")
  return data.text
}

/** Fetch resume markdown from the API. */
export async function exportResume(): Promise<string> {
  const data = await request<{ text: string }>("/api/export/resume")
  return data.text
}

export { DESTINATIONS, MONTH_ABBREVS, getRoleEndBeforeStartMessage }
export type { Destination, ExperiencesDocument, ValidationIssue }
