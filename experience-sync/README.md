# Experience sync

Local tooling to keep experience/accomplishment content in sync across:

- **Portfolio** — generates [`src/data/experiences.ts`](../src/data/experiences.ts)
- **LinkedIn** — plain-text export for copy/paste (no LinkedIn API)
- **Resume** — condensed markdown for paste into a Google Doc

## Source of truth

Edit [`content/experiences.yaml`](content/experiences.yaml) (or use the UI). Do not hand-edit the generated `src/data/experiences.ts`.

Each accomplishment has:

- `destinations`: which channels get it (`portfolio`, `resume`, `linkedin`)
- `variants`: text per destination (for destinations using custom wording)
- `variantSources` (optional): reuse another destination's text on the same bullet (e.g. resume uses linkedin wording)

### Default setup

When a bullet goes to all three channels and shares one wording, you only need portfolio text in YAML:

```yaml
- id: intuit-sse-vep
  destinations: [portfolio, resume, linkedin]
  variants:
    portfolio: "Full stack engineer on the appointments team..."
```

On load, resume and LinkedIn implicitly reuse portfolio text. On save, redundant `variantSources` entries are stripped automatically.

Portfolio-only bullets are another simple case — omit resume and linkedin from `destinations` and set only `variants.portfolio`.

### Reusing text across destinations

When the same bullet should share wording across Portfolio, Resume, and LinkedIn, define custom text once and alias the others:

```yaml
- id: intuit-sse-vep
  destinations: [portfolio, resume, linkedin]
  variantSources:
    resume: linkedin
  variants:
    portfolio: "Currently working as a full stack..."
    linkedin: "Full stack engineer on the appointments team..."
```

Pick and choose per destination: alias some channels and keep custom text for others. Switch back to custom text in the editor to edit independently (copies the resolved text).

In the editor UI, bullets using the default setup show a single **Wording** field plus a muted destination summary. Use **Customize destinations & wording** to reveal destination checkboxes, the per-destination **Same as** dropdowns, and per-channel text fields when you need a non-default layout.

Portfolio and LinkedIn variants may use markdown links: `[label](https://example.com)`.

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
- Default bullets show one text field; customize to toggle destinations and per-channel wording
- **Save YAML** writes the editor to `content/experiences.yaml` (hover for details). Does not update the live site by itself.
- **Discard** (undo icon) reloads YAML from disk and throws away unsaved edits — use after external file changes or to undo.
- **Generate portfolio** / **Copy LinkedIn** / **Copy resume** for downstream outputs
- Right pane shows live LinkedIn / resume previews from the current editor state

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

