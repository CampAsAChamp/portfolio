import type { Company } from "experience-sync/lib/schema"

/** Sidebar label: optional nickname, otherwise full company name. */
export function getCompanyDisplayName(company: Pick<Company, "companyName" | "nickname">): string {
  const nickname = company.nickname?.trim()
  return nickname || company.companyName
}
