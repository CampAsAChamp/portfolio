# Claude Guide — Portfolio Website

React 19 + TypeScript portfolio at https://nickhs.dev. Vite build, Cloudflare Pages deploy.

> Detailed conventions live in `.cursor/rules/` — read those files when working in a specific area.

## Quick commands

```bash
nvm use                    # Node 22+ required (.nvmrc) — run before any yarn command
yarn start                 # Dev server at http://localhost:5173
yarn lint:fix              # Auto-fix ESLint, Stylelint, Prettier issues
yarn lint                  # Check (no fix): ESLint + types + CSS + format
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
  utils/          # Shared utilities
tests/
  unit/           # Vitest + Testing Library (mirrors src/)
  e2e/            # Playwright (desktop/, mobile/, fixtures/, helpers/)
```

## Adding a new section

1. Component in `src/components/ComponentName/`
2. CSS in `src/styles/ComponentName/ComponentName.css`
3. Types in `src/types/*.types.ts`
4. Content in `src/data/` (never hardcode display text in components)
5. Wire up in `App.tsx`; add a `id` for navbar scroll targets

## Key conventions

- Named exports: `export function ComponentName(): React.ReactElement`
- Absolute imports (no `../` across top-level dirs) — aliases in `tsconfig.json`
- Plain CSS only — no Tailwind, no CSS-in-JS
- CSS variables from `src/styles/Common/Globals.css` for colors/theming
- Accessibility: semantic HTML, ARIA labels, keyboard navigation

## Before committing

Pre-commit hooks (Husky) run automatically, but verify first:
1. `nvm use && yarn lint:fix`
2. `yarn test` (add `yarn test:e2e` if UI changed)

## Git

Use conventional commits (enforced by commitlint; required for semantic-release):
```
feat: add dark mode toggle to navbar
fix: resolve scroll animation on mobile
```
Do **not** manually edit `CHANGELOG.md` — semantic-release generates it from commits on `main`.

## Rules by area

| Working on | Read |
|------------|------|
| Components / TypeScript | `.cursor/rules/typescript-react.mdc` |
| CSS / theming | `.cursor/rules/css-styling.mdc` |
| Unit tests | `.cursor/rules/unit-testing.mdc` |
| E2E tests | `.cursor/rules/e2e-testing.mdc` |
| CI workflows | `.cursor/rules/ci-workflows.mdc` |
| Content/data files | `.cursor/rules/data-and-content.mdc` |
