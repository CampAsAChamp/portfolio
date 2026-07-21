import { experiences } from "data/experiences"
import { compareRoleDatesNewestFirst, formatRoleDuration, formatTenure, inclusiveMonthSpan } from "utils/durationUtils"
import { describe, expect, it } from "vitest"

describe("inclusiveMonthSpan", () => {
  it("matches prior experience tenures", () => {
    expect(inclusiveMonthSpan({ month: "Oct", year: 2023 }, { month: "Jul", year: 2026 })).toBe(34)
    expect(inclusiveMonthSpan({ month: "Jan", year: 2022 }, { month: "Oct", year: 2023 })).toBe(22)
    expect(inclusiveMonthSpan({ month: "Jan", year: 2020 }, { month: "Dec", year: 2021 })).toBe(24)
    expect(inclusiveMonthSpan({ month: "Sept", year: 2018 }, { month: "Dec", year: 2018 })).toBe(4)
    expect(inclusiveMonthSpan({ month: "Jan", year: 2018 }, { month: "Mar", year: 2018 })).toBe(3)
  })
})

describe("formatTenure", () => {
  it("formats years and months with consistent singular/plural abbreviations", () => {
    expect(formatTenure(34)).toBe("2 yrs 10 mos")
    expect(formatTenure(22)).toBe("1 yr 10 mos")
    expect(formatTenure(13)).toBe("1 yr 1 mo")
    expect(formatTenure(24)).toBe("2 yrs")
    expect(formatTenure(12)).toBe("1 yr")
    expect(formatTenure(4)).toBe("4 mos")
    expect(formatTenure(1)).toBe("1 mo")
  })
})

describe("formatRoleDuration", () => {
  it("formats completed roles with tenure", () => {
    expect(formatRoleDuration({ month: "Oct", year: 2023 }, { month: "Jul", year: 2026 })).toBe("Oct 2023 - Jul 2026 (2 yrs 10 mos)")
    expect(formatRoleDuration({ month: "Jan", year: 2020 }, { month: "Dec", year: 2021 })).toBe("Jan 2020 - Dec 2021 (2 yrs)")
    expect(formatRoleDuration({ month: "Sept", year: 2018 }, { month: "Dec", year: 2018 })).toBe("Sept 2018 - Dec 2018 (4 mos)")
  })

  it("formats ongoing roles with a live tenure", () => {
    expect(formatRoleDuration({ month: "Aug", year: 2026 }, undefined, new Date(2026, 9, 15))).toBe("Aug 2026 - Present (3 mos)")
    expect(formatRoleDuration({ month: "Aug", year: 2025 }, undefined, new Date(2026, 7, 1))).toBe("Aug 2025 - Present (1 yr 1 mo)")
  })

  it("omits tenure when the start month is still in the future", () => {
    expect(formatRoleDuration({ month: "Aug", year: 2026 }, undefined, new Date(2026, 6, 20))).toBe("Aug 2026 - Present")
  })
})

describe("compareRoleDatesNewestFirst", () => {
  it("orders newer dates before older ones", () => {
    expect(compareRoleDatesNewestFirst({ month: "Aug", year: 2026 }, { month: "Oct", year: 2023 })).toBeLessThan(0)
    expect(compareRoleDatesNewestFirst({ month: "Oct", year: 2023 }, { month: "Aug", year: 2026 })).toBeGreaterThan(0)
  })
})

describe("experiences data", () => {
  it("has valid date ranges for every completed role", () => {
    for (const experience of experiences) {
      for (const role of experience.roles) {
        if (role.end) {
          expect(inclusiveMonthSpan(role.start, role.end)).toBeGreaterThanOrEqual(1)
        }
      }
    }
  })

  it("formats completed roles to the expected display strings", () => {
    const completed = experiences.flatMap((experience) =>
      experience.roles.filter((role) => role.end).map((role) => formatRoleDuration(role.start, role.end)),
    )

    expect(completed).toEqual([
      "Oct 2023 - Jul 2026 (2 yrs 10 mos)",
      "Jan 2022 - Oct 2023 (1 yr 10 mos)",
      "Jan 2020 - Dec 2021 (2 yrs)",
      "Sept 2018 - Dec 2018 (4 mos)",
      "Jan 2018 - Mar 2018 (3 mos)",
    ])
  })

  it("formats ongoing roles as Present", () => {
    const ongoing = experiences.flatMap((experience) =>
      experience.roles.filter((role) => !role.end).map((role) => formatRoleDuration(role.start, role.end)),
    )

    expect(ongoing).toHaveLength(1)
    expect(ongoing[0]).toMatch(/^Aug 2026 - Present/)
  })
})
