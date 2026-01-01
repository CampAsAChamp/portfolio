import { render } from "@testing-library/react"
import { Experience } from "components/Experience/Experience"
import { describe, it } from "vitest"

describe("Experience", () => {
  it("renders without crashing", () => {
    render(<Experience />)
  })
})
