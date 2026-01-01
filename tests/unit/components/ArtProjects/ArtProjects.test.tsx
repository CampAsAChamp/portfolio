import { render } from "@testing-library/react"
import { ArtProjects } from "components/ArtProjects/ArtProjects"
import { describe, it } from "vitest"

describe("ArtProjects", () => {
  it("renders without crashing", () => {
    render(<ArtProjects />)
  })
})
