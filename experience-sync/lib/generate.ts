import { spawnSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { bulletToTsExpr } from "experience-sync/lib/markdown"
import { EXPERIENCES_OUTPUT, EXPERIENCES_TS_TEMPLATE, REPO_ROOT } from "experience-sync/lib/paths"
import type { Company, ExperienceRole, ExperiencesDocument, RoleDate } from "experience-sync/lib/schema"
import { arr, ident, lit, obj, printTsExpr, type TsExpr } from "experience-sync/lib/tsExpr"

const EXPERIENCES_TEMPLATE = fs.readFileSync(EXPERIENCES_TS_TEMPLATE, "utf8")

/** Fill `{{name}}` placeholders; throws if a placeholder has no value. */
function fillTemplate(template: string, values: Record<string, string>): string {
  // Matches `{{placeholderName}}` tokens in the experiences.ts template.
  const placeholderRe = /\{\{(\w+)\}\}/g
  return template.replace(placeholderRe, (_match, name: string) => {
    if (!(name in values)) {
      throw new Error(`Missing template value for {{${name}}}`)
    }
    return values[name]!
  })
}

/** Derive a stable JS import identifier from a logo filename (e.g. `Intuit.svg` → `IntuitLogo`). */
function logoImportName(logoFile: string): string {
  const base = path.basename(logoFile, path.extname(logoFile))
  return (
    base
      // Non-alphanumeric runs → single underscore (e.g. "ID Tech" / "ID-Tech" → "ID_Tech")
      .replace(/[^a-zA-Z0-9]+/g, "_")
      // Identifiers can't start with a digit (e.g. "123Corp" → "_123Corp")
      .replace(/^(\d)/, "_$1")
      // Collapse repeated underscores from adjacent replacements
      .replace(/_+/g, "_") + "Logo"
  )
}

function logoImportStatement(logoFile: string): string {
  return `import ${logoImportName(logoFile)} from "assets/Company_Logos/${logoFile}"`
}

function roleDateToTsExpr(date: RoleDate): TsExpr {
  return obj({
    month: lit(date.month),
    year: lit(date.year),
  })
}

/** Ongoing roles omit `end`; return `undefined` so `obj` drops the property. */
function optionalRoleEndToTsExpr(end: RoleDate | undefined): TsExpr | undefined {
  if (end == null) {
    return undefined
  }
  return roleDateToTsExpr(end)
}

function roleToTsExpr(role: ExperienceRole): TsExpr {
  const bulletPoints = role.accomplishments
    .filter((a) => a.destinations.includes("portfolio") && a.variants.portfolio?.trim())
    .map((a) => bulletToTsExpr(a.variants.portfolio!.trim()))

  return obj({
    position: lit(role.position),
    start: roleDateToTsExpr(role.start),
    end: optionalRoleEndToTsExpr(role.end),
    bulletPoints: arr(bulletPoints),
  })
}

function companyToTsExpr(company: Company): TsExpr {
  return obj({
    companyName: lit(company.companyName),
    location: lit(company.location),
    roles: arr(company.roles.map(roleToTsExpr)),
    technologies: arr(company.technologies.map((t) => ident(`technologies.${t}`))),
    logo: ident(logoImportName(company.logoFile)),
    color: ident(`COLORS.${company.colorKey}`),
  })
}

/**
 * Generate the TypeScript source for `src/data/experiences.ts`.
 * Portfolio-only: filters accomplishments to the `portfolio` destination and expands markdown links.
 */
export function generateExperiencesTs(doc: ExperiencesDocument): string {
  const logoImports = doc.companies.map((c) => logoImportStatement(c.logoFile)).join("\n")
  const experiences = printTsExpr(arr(doc.companies.map(companyToTsExpr)))

  return fillTemplate(EXPERIENCES_TEMPLATE, { logoImports, experiences })
}

/**
 * Write generated `experiences.ts` and run Prettier on it.
 * @returns Absolute path of the written file
 */
export function writeExperiencesTs(doc: ExperiencesDocument): string {
  const source = generateExperiencesTs(doc)
  fs.mkdirSync(path.dirname(EXPERIENCES_OUTPUT), { recursive: true })
  fs.writeFileSync(EXPERIENCES_OUTPUT, source, "utf8")

  const prettierBin = path.join(REPO_ROOT, "node_modules/.bin/prettier")
  const formatted = spawnSync(prettierBin, ["--write", EXPERIENCES_OUTPUT], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  })
  if (formatted.status !== 0) {
    console.warn("Warning: prettier failed on generated experiences.ts")
    if (formatted.stderr) {
      console.warn(formatted.stderr)
    }
  }

  return EXPERIENCES_OUTPUT
}
