import { render } from "@testing-library/react"
import { SWProjects } from "components/SwProjects/SwProjects"
import { describe, it } from "vitest"

describe("SWProjects", () => {
  it("renders without crashing", () => {
    render(<SWProjects />)
  })
})
