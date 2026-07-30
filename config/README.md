# Tooling configuration

Non-app configs live here so the repo root stays lean. Root keeps only `package.json`, lockfiles, TypeScript project files, `index.html`, `.editorconfig`, and thin shims where a tool requires root discovery (`eslint.config.js`, `release.config.mjs`).

| File / folder                             | Tool                                                    |
| ----------------------------------------- | ------------------------------------------------------- |
| `.env.example`, `.env.local`              | Local env vars (Vite `envDir`; Lighthouse GitHub token) |
| `eslint.config.js`                        | ESLint (flat config)                                    |
| `prettier.config.json`, `prettierignore`  | Prettier                                                |
| `stylelint.config.cjs`, `stylelintignore` | Stylelint                                               |
| `commitlint.config.mjs`                   | Commitlint (Husky commit-msg hook)                      |
| `release.config.json`                     | semantic-release                                        |
| `readme-screenshot.yml`                   | Automated README screenshot CI                          |
| `vite.config.ts`                          | Vite dev/build                                          |
| `vitest.config.ts`                        | Vitest unit tests                                       |
| `playwright.config.ts`                    | Playwright E2E tests                                    |
| `lighthouse/`                             | Lighthouse CI presets (desktop/mobile, local + CI)      |

Scripts and CI pass explicit `--config` paths; VS Code/Cursor settings in `.vscode/settings.json` point editors at these files.
