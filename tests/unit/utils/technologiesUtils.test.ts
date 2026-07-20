import { REACT, TYPESCRIPT } from "data/technologies"
import { getTechnologies } from "utils/technologiesUtils"
import { describe, expect, it } from "vitest"

describe("technologiesUtils", () => {
  it("maps technology names to full technology objects", () => {
    const techs = getTechnologies([REACT, TYPESCRIPT])

    expect(techs).toHaveLength(2)
    expect(techs[0]?.name).toBe(REACT)
    expect(techs[0]?.link).toContain("react")
    expect(techs[1]?.name).toBe(TYPESCRIPT)
    expect(techs[1]?.image).toBeTruthy()
  })

  it("preserves order of requested technologies", () => {
    const techs = getTechnologies([TYPESCRIPT, REACT])
    expect(techs.map((tech) => tech.name)).toEqual([TYPESCRIPT, REACT])
  })
})
