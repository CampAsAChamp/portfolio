#!/usr/bin/env tsx
import { spawnSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const tsx = path.resolve(__dirname, "../../node_modules/.bin/tsx")

function run(script: string, extraArgs: string[] = []): void {
  const result = spawnSync(tsx, [path.join(__dirname, script), ...extraArgs], {
    stdio: "inherit",
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

run("generate.ts")
run("linkedin.ts")
run("resume.ts")
console.log("\nSync complete.")
