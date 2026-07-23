import path from "node:path"
import { CONTENT_DIR, contentFilePath } from "experience-sync/lib/paths"
import { describe, expect, it } from "vitest"

describe("contentFilePath", () => {
  it("maps a YAML basename under the content directory", () => {
    expect(contentFilePath("experiences.yaml")).toBe(path.join(CONTENT_DIR, "experiences.yaml"))
  })

  it("rejects path traversal", () => {
    expect(() => contentFilePath("../package.json")).toThrow(/Invalid content filename/)
  })

  it("rejects absolute paths", () => {
    expect(() => contentFilePath("/tmp/experiences.yaml")).toThrow(/Invalid content filename/)
  })

  it("rejects non-yaml extensions", () => {
    expect(() => contentFilePath("experiences.json")).toThrow(/must be \.yaml or \.yml/)
  })
})
