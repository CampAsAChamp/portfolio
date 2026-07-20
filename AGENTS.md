# Agent Guide — Portfolio Website

React 19 + TypeScript portfolio (https://nickhs.dev). Single-page app deployed on Cloudflare Pages.

## Quick commands

```bash
nvm use                    # Node 22+ required (.nvmrc)
yarn start                 # Dev server at http://localhost:5173
yarn lint                  # ESLint + format check + type check
yarn lint:fix              # Auto-fix lint/format issues
yarn test                  # Vitest unit tests
yarn test:e2e              # Playwright E2E (starts dev server automatically)
yarn build                 # Production build → build/
```

## Project layout

```
src/
  components/     # React components (PascalCase folders)
  styles/         # Plain CSS, mirrors component structure
  data/           # Content (experiences, projects, technologies)
  types/          # TypeScript interfaces (*.types.ts)
  assets/         # SVG, WebP, logos, icons
  hooks/          # Custom React hooks
  utils/            # Shared utilities
tests/
  unit/           # Vitest + Testing Library (mirrors src/)
  e2e/            # Playwright (desktop/, mobile/, fixtures/, helpers/)
```

## Conventions (summary)

- Named exports: `export function ComponentName(): React.ReactElement`
- Absolute imports from `src` (no `../` across top-level dirs)
- Plain CSS only — no Tailwind or CSS-in-JS
- Content lives in `src/data/`, not hardcoded in components
- Accessibility: keyboard nav, ARIA labels, semantic HTML

## Git & releases

- Use conventional commits (`feat:`, `fix:`, etc.) — enforced by commitlint; semantic-release versions from them on `main`
- Do not manually edit `CHANGELOG.md` (semantic-release generates it)

## Where to look

| Task | Start here |
|------|------------|
| Add a new section | `.cursor/skills/add-portfolio-section/SKILL.md` |
| Component patterns | `.cursor/rules/typescript-react.mdc` |
| CSS / theming | `.cursor/rules/css-styling.mdc`, `src/styles/Common/Globals.css` |
| Unit tests | `.cursor/rules/unit-testing.mdc`, `tests/unit/` |
| E2E tests | `.cursor/rules/e2e-testing.mdc`, `tests/e2e/README.md` |
| CI/CD workflows | `.cursor/rules/ci-workflows.mdc` |
| Full conventions | `.cursor/rules/` (replaces legacy `.cursorrules`) |

## Project skills

Skills in `.cursor/skills/` are repo-specific workflows. Invoke by name or describe the task (e.g. "add a new portfolio section").
