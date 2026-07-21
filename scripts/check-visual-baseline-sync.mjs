#!/usr/bin/env node
/**
 * Fail if a PR updates a Darwin visual-regression snapshot (the file `yarn
 * test:e2e --update-snapshots` produces locally on a Mac) without updating its Linux
 * sibling (what CI actually compares against, produced by `yarn
 * test:e2e:update-snapshots` via Docker).
 *
 * This repo's history has repeatedly "fixed" flaky/failing e2e visual tests by
 * regenerating snapshots locally on macOS, which only touches `*-darwin.png` files —
 * CI keeps comparing against the stale `*-linux.png` baseline and fails again next run.
 * This check makes that mistake fail fast instead of silently recurring.
 *
 * Only the two projects with maintained baselines (see `VISUAL_BASELINE_PROJECTS` in
 * tests/e2e/helpers/visual-helpers.ts) are checked: chromium and Mobile Chrome.
 */
import { execSync } from "node:child_process"

const CHECKED_PROJECTS = ["chromium", "Mobile Chrome"]

function log(message) {
  console.error(`[*] ${message}`)
}

function getChangedSnapshotFiles() {
  const baseRef = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : null
  if (!baseRef) {
    log("Not running on a pull request (no GITHUB_BASE_REF) — skipping.")
    return null
  }

  execSync(`git fetch origin ${process.env.GITHUB_BASE_REF} --depth=50`, { stdio: "ignore" })
  const diffOutput = execSync(`git diff --name-only ${baseRef}...HEAD -- "tests/e2e/**/*-snapshots/*.png"`, {
    encoding: "utf-8",
  })
  return diffOutput.split("\n").filter(Boolean)
}

function findMismatches(changedFiles) {
  const changedSet = new Set(changedFiles)
  const mismatches = []

  for (const project of CHECKED_PROJECTS) {
    const projectSlug = project.replace(/ /g, "-")
    const darwinFiles = changedFiles.filter((f) => f.includes(`-${projectSlug}-darwin.png`))

    for (const darwinFile of darwinFiles) {
      const linuxFile = darwinFile.replace(`-${projectSlug}-darwin.png`, `-${projectSlug}-linux.png`)
      if (!changedSet.has(linuxFile)) {
        mismatches.push({ darwinFile, linuxFile })
      }
    }
  }

  return mismatches
}

function main() {
  const changedFiles = getChangedSnapshotFiles()
  if (changedFiles === null) {
    return
  }
  if (changedFiles.length === 0) {
    log("No visual snapshot changes in this PR.")
    return
  }

  const mismatches = findMismatches(changedFiles)
  if (mismatches.length === 0) {
    log("Visual baseline snapshots are in sync.")
    return
  }

  console.error("\nDarwin snapshot(s) changed without a matching Linux update:\n")
  for (const { darwinFile, linuxFile } of mismatches) {
    console.error(`  ${darwinFile}`)
    console.error(`    -> expected sibling ${linuxFile} to also change`)
  }
  console.error(
    "\nCI compares against *-linux.png only. Regenerate Linux baselines with:\n  yarn test:e2e:update-snapshots\n(Never rely on a local Mac --update-snapshots run to fix CI — see .cursor/rules/e2e-testing.mdc.)",
  )
  process.exit(1)
}

main()
