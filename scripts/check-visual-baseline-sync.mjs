#!/usr/bin/env node
/**
 * Fail if a commit updates a Darwin visual-regression snapshot (the file `yarn
 * test:e2e --update-snapshots` produces locally on a Mac) without updating its Linux
 * sibling (what CI actually compares against, produced by `yarn
 * test:e2e:update-snapshots` via Docker).
 *
 * This repo's history has repeatedly "fixed" flaky/failing e2e visual tests by
 * regenerating snapshots locally on macOS, which only touches `*-darwin.png` files —
 * CI keeps comparing against the stale `*-linux.png` baseline and fails again next run.
 * This check makes that mistake fail fast instead of silently recurring.
 *
 * Runs on both PRs (diff against the PR base) and direct pushes to main (diff against
 * the previous commit) — this repo pushes straight to main without a PR, so a
 * PR-only check never actually runs in practice.
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
  const baseRef = resolveBaseRef()
  if (!baseRef) {
    log("Could not resolve a base ref to diff against (no GITHUB_BASE_REF and no prior commit) — skipping.")
    return null
  }

  const diffOutput = execSync(`git diff --name-only ${baseRef}...HEAD -- "tests/e2e/**/*-snapshots/*.png"`, {
    encoding: "utf-8",
  })
  return diffOutput.split("\n").filter(Boolean)
}

function resolveBaseRef() {
  if (process.env.GITHUB_BASE_REF) {
    // Pull request: diff against the PR's base branch.
    execSync(`git fetch origin ${process.env.GITHUB_BASE_REF} --depth=50`, { stdio: "ignore" })
    return `origin/${process.env.GITHUB_BASE_REF}`
  }

  if (process.env.GITHUB_EVENT_NAME === "push") {
    // Direct push (this repo's actual flow on main): diff against the previous commit.
    // actions/checkout defaults to a shallow (depth-1) clone, so HEAD~1 isn't fetched yet.
    execSync("git fetch origin --deepen=1", { stdio: "ignore" })
    try {
      execSync("git rev-parse HEAD~1", { stdio: "ignore" })
      return "HEAD~1"
    } catch {
      // First commit in the repo/shallow history — nothing to diff against.
      return null
    }
  }

  return null
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
    log("No visual snapshot changes.")
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
