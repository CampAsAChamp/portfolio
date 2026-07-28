import type {
  Accomplishment,
  Company,
  Destination,
  ExperienceRole,
  ExperiencesDocument,
  RoleDate,
  SharedVariant,
  Variants,
} from "experience-sync/lib/schema"

export function makeRoleDate(month: RoleDate["month"] = "Jan", year = 2020): RoleDate {
  return { month, year }
}

export function makeAccomplishment(overrides: Partial<Accomplishment> & Pick<Accomplishment, "id">): Accomplishment {
  const destinations = overrides.destinations ?? (["portfolio"] as Destination[])
  const variants: Variants =
    overrides.variants ??
    ({
      portfolio: "Portfolio bullet",
    } satisfies Variants)
  return {
    ...overrides,
    destinations,
    variants,
  }
}

export function makeRole(overrides: Partial<ExperienceRole> & Pick<ExperienceRole, "id">): ExperienceRole {
  return {
    position: "Software Engineer",
    start: makeRoleDate("Jan", 2020),
    accomplishments: [
      makeAccomplishment({
        id: `${overrides.id}-a1`,
        destinations: ["portfolio", "resume", "linkedin"],
        variants: {
          portfolio: "Built things for the portfolio",
          resume: "Built things for the resume",
          linkedin: "Built things for LinkedIn",
        },
      }),
    ],
    ...overrides,
  }
}

export function makeCompany(overrides: Partial<Company> & Pick<Company, "id">): Company {
  return {
    companyName: "Acme Corp",
    location: "Remote",
    colorKey: "INTUIT",
    logoFile: "Intuit.svg",
    technologies: ["REACT"],
    roles: [makeRole({ id: `${overrides.id}-role` })],
    ...overrides,
  }
}

export function makeSharedVariant(overrides: Partial<SharedVariant> & Pick<SharedVariant, "id">): SharedVariant {
  return {
    label: overrides.label,
    variants: {
      portfolio: "Shared portfolio text",
      ...overrides.variants,
    },
    ...overrides,
  }
}

export function makeDocument(overrides?: Partial<ExperiencesDocument>): ExperiencesDocument {
  return {
    sharedVariants: [],
    companies: [makeCompany({ id: "acme" })],
    ...overrides,
  }
}
