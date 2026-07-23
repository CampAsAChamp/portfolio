import { spawn } from "node:child_process"
import path from "node:path"
import { EXPERIENCE_SYNC_ROOT } from "experience-sync/lib/paths"

/** Run an experience-sync CLI script via tsx and capture combined stdout/stderr. */
export function runCli(script: string): Promise<{ ok: boolean; output: string }> {
  return new Promise((resolve) => {
    const tsxBin = path.resolve(EXPERIENCE_SYNC_ROOT, "../node_modules/.bin/tsx")
    const child = spawn(
      tsxBin,
      ["--tsconfig", path.join(EXPERIENCE_SYNC_ROOT, "tsconfig.json"), path.join(EXPERIENCE_SYNC_ROOT, "cli", script)],
      {
        cwd: path.resolve(EXPERIENCE_SYNC_ROOT, ".."),
      },
    )
    let output = ""
    child.stdout?.on("data", (d: Buffer) => {
      output += d.toString()
    })
    child.stderr?.on("data", (d: Buffer) => {
      output += d.toString()
    })
    child.on("close", (code) => {
      resolve({ ok: code === 0, output })
    })
  })
}
