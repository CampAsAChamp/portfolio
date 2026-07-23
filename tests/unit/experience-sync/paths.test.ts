import path from "node:path"
import { CONTENT_DIR, resolveContentPath } from "experience-sync/lib/paths"
import { describe, expect, it } from "vitest"

describe("resolveContentPath", () => {
  it("resolves a YAML basename under the content directory", () => {
    expect(resolveContentPath("experiences.yaml")).toBe(path.join(CONTENT_DIR, "experiences.yaml"))
  })

  it("rejects path traversal", () => {
    expect(() => resolveContentPath("../package.json")).toThrow(/Invalid content filename/)
  })

  it("rejects absolute paths", () => {
    expect(() => resolveContentPath("/tmp/experiences.yaml")).toThrow(/Invalid content filename/)
  })

  it("rejects non-yaml extensions", () => {
    expect(() => resolveContentPath("experiences.json")).toThrow(/must be \.yaml or \.yml/)
  })
})
