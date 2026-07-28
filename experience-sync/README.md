# Experience sync

Local tooling to keep experience/accomplishment content in sync across:

- **Portfolio** — generates [`src/data/experiences.ts`](../src/data/experiences.ts)
- **LinkedIn** — plain-text export for copy/paste (no LinkedIn API)
- **Resume** — condensed markdown for paste into a Google Doc

## Source of truth

Edit [`content/experiences.yaml`](content/experiences.yaml) (or use the UI). Do not hand-edit the generated `src/data/experiences.ts`.

Each accomplishment has:

- `destinations`: which channels get it (`portfolio`, `resume`, `linkedin`)
- `variants`: separate text per destination (required for each selected destination unless linked to a shared variant)
- `sharedVariants` (optional): per-destination links to a document-level shared variant id

### Shared variants

Define reusable text once under `sharedVariants` at the top of `experiences.yaml`. Each entry has an `id`, optional `label`, and `variants` for any subset of destinations.

Link an accomplishment destination to shared text with `sharedVariants` on the accomplishment:

```yaml
sharedVariants:
  - id: abr-launch
    label: ABR launch summary
    variants:
      portfolio: "Launched Attribute Based Routing..."
      resume: "Launched ABR..."

companies:
  - roles:
      - accomplishments:
          - id: intuit-abr-launch
            destinations: [portfolio, resume]
            sharedVariants:
              portfolio: abr-launch
              resume: abr-launch
            variants: {}
```

Pick and choose per destination: link some channels to shared text and keep custom inline text for others. Editing a shared variant updates every accomplishment that references it.

In the editor UI, use **Shared variants** in the sidebar to manage the library. On each accomplishment, use the **Source** dropdown to link or unlink. **Unlink** copies the current shared text into custom text so you can edit without affecting other accomplishments.

Portfolio variants may use markdown links: `[label](https://example.com)`.

## Commands

```bash
nvm use
yarn exp:ui          # local editor at http://127.0.0.1:4700
yarn exp:generate    # write src/data/experiences.ts
yarn exp:linkedin    # print LinkedIn text (add --copy for pbcopy)
yarn exp:resume      # write experience-sync/exports/resume.md (add --copy)
yarn exp:sync        # generate + linkedin + resume
yarn exp:check       # fail if experiences.ts is stale vs YAML
yarn test            # includes unit tests in tests/unit/experience-sync/
```

## Editor UI

`yarn exp:ui` starts a Vite app with an embedded localhost-only API under `/api/*`.

- Edit companies → roles → accomplishments
- Toggle destinations and edit per-channel variants (custom or linked to shared variants)
- **Shared variants** sidebar section — reusable text library with per-destination pickers
- **Save YAML** writes the editor to `content/experiences.yaml` (hover for details). Does not update the live site by itself.
- **Discard** (undo icon) reloads YAML from disk and throws away unsaved edits — use after external file changes or to undo.
- **Generate portfolio** / **Copy LinkedIn** / **Copy resume** for downstream outputs
- Right pane shows LinkedIn / resume previews from the saved file

This UI is **not** part of the Cloudflare Pages deploy.

## Layout

```
experience-sync/
  content/           # YAML source of truth
  lib/               # schema, generate, exports
  cli/               # yarn exp:* entrypoints
  api/               # optional standalone API (yarn exp:api)
  ui/                # React editor
    src/
      App.tsx / main.tsx / styles.css
      components/    # pickers, toasts, icons, fields
      catalogs/      # logo + technology option lists
      lib/           # API client + markdown helpers
  exports/           # generated resume.md (gitignored)
```

Unit tests for `lib/` live in `tests/unit/experience-sync/` and run with `yarn test`.

