#!/usr/bin/env node
import { spawnSync } from "child_process"

/**
 * Typecheck the portfolio app and the experience-sync tooling (lib/cli/api + UI).
 * Exit codes from tsc are forwarded so CI/lint fail on type errors.
 */
const checks = [
  { label: "portfolio", args: ["tsc", "--noEmit", "--pretty"] },
  { label: "experience-sync lib/cli/api", args: ["tsc", "--noEmit", "--pretty", "-p", "experience-sync/tsconfig.json"] },
  { label: "experience-sync UI", args: ["tsc", "--noEmit", "--pretty", "-p", "experience-sync/ui/tsconfig.json"] },
]

for (const { label, args } of checks) {
  const result = spawnSync("yarn", args, {
    stdio: "inherit",
    env: process.env,
  })

  if (result.error) {
    console.error(`\n❌ Failed to run typecheck (${label}):`, result.error.message)
    process.exit(1)
  }

  if (result.status !== 0) {
    console.error(`\n❌ TypeScript check failed (${label}).\n`)
    process.exit(result.status ?? 1)
  }
}
