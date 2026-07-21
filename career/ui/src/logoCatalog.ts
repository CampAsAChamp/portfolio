const logoModules = import.meta.glob("../../../src/assets/Company_Logos/*.{svg,png,webp,jpg,jpeg}", {
  eager: true,
  import: "default",
}) as Record<string, string>

export interface LogoOption {
  file: string
  url: string
}

export const LOGO_OPTIONS: LogoOption[] = Object.entries(logoModules)
  .map(([modulePath, url]) => ({
    file: modulePath.split("/").pop() ?? modulePath,
    url,
  }))
  .sort((a, b) => a.file.localeCompare(b.file, undefined, { sensitivity: "base" }))

export const LOGO_OPTIONS_BY_FILE = new Map(LOGO_OPTIONS.map((opt) => [opt.file, opt]))
