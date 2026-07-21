# Career content sync

Local tooling to keep experience/accomplishment content in sync across:

- **Portfolio** — generates [`src/data/experiences.ts`](../src/data/experiences.ts)
- **LinkedIn** — plain-text export for copy/paste (no LinkedIn API)
- **Resume** — condensed markdown for paste into a Google Doc

## Source of truth

Edit [`content/experiences.yaml`](content/experiences.yaml) (or use the UI). Do not hand-edit the generated `src/data/experiences.ts`.

Each accomplishment has:

- `destinations`: which channels get it (`portfolio`, `resume`, `linkedin`)
- `variants`: separate text per destination (required for each selected destination)

Portfolio variants may use markdown links: `[label](https://example.com)`.

## Commands

```bash
nvm use
yarn career:ui          # local editor at http://127.0.0.1:4700
yarn career:generate    # write src/data/experiences.ts
yarn career:linkedin    # print LinkedIn text (add --copy for pbcopy)
yarn career:resume      # write career/exports/resume.md (add --copy)
yarn career:sync        # generate + linkedin + resume
yarn career:check       # fail if experiences.ts is stale vs YAML
```

## Editor UI

`yarn career:ui` starts a Vite app with an embedded localhost-only API under `/api/*`.

- Edit companies → roles → accomplishments
- Toggle destinations and edit per-channel variants
- **Save YAML** writes the editor to `content/experiences.yaml` (hover for details). Does not update the live site by itself.
- **Reload** (refresh icon) reloads YAML from disk and discards unsaved edits — use after external file changes or to undo.
- **Generate portfolio** / **Copy LinkedIn** / **Copy resume** for downstream outputs
- Right pane shows LinkedIn / resume previews from the saved file

This UI is **not** part of the Cloudflare Pages deploy.

## Layout

```
career/
  content/           # YAML source of truth
  lib/               # schema, generate, exports
  cli/               # yarn career:* entrypoints
  api/               # optional standalone API (yarn career:api)
  ui/                # React editor
  exports/           # generated resume.md (gitignored)
```
