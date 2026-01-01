import { render } from "@testing-library/react"
import { SkillsAndTechnologies } from "components/SkillsAndTech/SkillsAndTechnologies"
import { describe, it } from "vitest"

describe("SkillsAndTechnologies", () => {
  it("renders without crashing", () => {
    render(<SkillsAndTechnologies />)
  })
})
