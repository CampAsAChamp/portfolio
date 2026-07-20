import type { RoleDate } from "types/experience.types"

/** Month abbreviations matching experience duration copy (Sept, not Sep). */
export const MONTH_ABBREVS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"] as const

export type MonthAbbrev = (typeof MONTH_ABBREVS)[number]

/** Numeric order for a role date (higher = more recent). */
export function roleDateOrder({ month, year }: RoleDate): number {
  return year * 12 + MONTH_ABBREVS.indexOf(month)
}

/** Compare role dates newest-first (for sorting). */
export function compareRoleDatesNewestFirst(a: RoleDate, b: RoleDate): number {
  return roleDateOrder(b) - roleDateOrder(a)
}

/**
 * Inclusive calendar-month count between two month/year pairs.
 * Matches prior static tenures (e.g. Oct 2023–Jul 2026 → 34 months).
 */
export function inclusiveMonthSpan(start: RoleDate, end: RoleDate): number {
  const startIndex = MONTH_ABBREVS.indexOf(start.month)
  const endIndex = MONTH_ABBREVS.indexOf(end.month)
  return (end.year - start.year) * 12 + (endIndex - startIndex) + 1
}

/** Format a month span as "2 yr 10 mos", "2 yrs", "4 mos", etc. */
export function formatTenure(totalMonths: number): string {
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years === 0) {
    return `${months} mos`
  }
  if (months === 0) {
    return years === 1 ? "1 yr" : `${years} yrs`
  }
  return `${years} yr ${months} mos`
}

function formatRoleDate({ month, year }: RoleDate): string {
  return `${month} ${year}`
}

/**
 * Display string for a role period.
 * Omit `end` for ongoing roles ("Present"); tenure then uses `now`.
 */
export function formatRoleDuration(start: RoleDate, end?: RoleDate, now: Date = new Date()): string {
  if (end) {
    const tenure = formatTenure(inclusiveMonthSpan(start, end))
    return `${formatRoleDate(start)} - ${formatRoleDate(end)} (${tenure})`
  }

  const range = `${formatRoleDate(start)} - Present`
  const month = MONTH_ABBREVS[now.getMonth()]
  if (month === undefined) {
    return range
  }

  const presentEnd: RoleDate = {
    month,
    year: now.getFullYear(),
  }
  const totalMonths = inclusiveMonthSpan(start, presentEnd)

  if (totalMonths < 1) {
    return range
  }

  return `${range} (${formatTenure(totalMonths)})`
}
