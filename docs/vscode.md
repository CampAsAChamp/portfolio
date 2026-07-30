# VS Code / Cursor Run Configurations

The repo includes workspace run configs in [`.vscode/launch.json`](../.vscode/launch.json) and [`.vscode/tasks.json`](../.vscode/tasks.json) for common dev, test, and build workflows.

**Run and Debug** (`Cmd+Shift+D` / `Ctrl+Shift+D`): pick a configuration from the dropdown, then start it.

**Tasks** (`Cmd+Shift+P` / `Ctrl+Shift+P` → **Tasks: Run Task**): run build, lint, test, and experience sync commands without memorizing yarn script names.

Workspace settings set `"nodejs.defaultRuntimeVersion": "22"` so Node debug sessions resolve the correct runtime via nvm. Shell tasks use your integrated terminal environment; yarn scripts still enforce Node 22 via `check-node-version.mjs`.

Cursor does not yet support auto-opening the integrated browser from `launch.json` (`editor-browser` and `openIntegratedBrowser` are unavailable). Use **Local: Start Server** and Cmd+click the `http://localhost:5173` link in the terminal, or use **Local: Chrome** for external Chrome debugging.

## Launch Configurations

| Configuration                        | Description                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| **Local: Start Server**              | Starts Vite in the integrated terminal (default config)                              |
| **Local: Chrome**                    | Starts Vite, attaches Chrome debugging (debug toolbar), stops server when debug ends |
| **Debug: Unit Tests (Current File)** | Debug the open Vitest file                                                           |
| **Debug: Unit Tests (All)**          | Debug the full unit test suite                                                       |
| **Debug: Playwright (Current File)** | Open Playwright Inspector for the open spec file                                     |
| **Experience Sync: Chrome**          | Starts the editor, attaches Chrome debugging at `http://127.0.0.1:4700`              |
| **Experience Sync: Start Editor**    | Starts the experience sync Vite app at `http://127.0.0.1:4700` (Node 22 via nvm)   |

## Tasks

| Task                                         | Description                          |
| -------------------------------------------- | ------------------------------------ |
| **Local: Start Server**                      | `yarn start`                         |
| **Local: Preview Production Build**          | `yarn build` then `yarn preview`     |
| **Build**                                    | `yarn build`                         |
| **Lint: Check**                              | `yarn lint`                          |
| **Lint: Fix**                                | `yarn lint:fix`                      |
| **Test: Unit**                               | `yarn test` (default test task)      |
| **Test: Unit (Watch)**                       | `yarn test:watch`                    |
| **Test: Unit (UI)**                          | `yarn test:ui`                       |
| **Test: Unit (Current File)**                | `yarn vitest run` on the active file |
| **Test: E2E**                                | `yarn test:e2e`                      |
| **Test: E2E (UI)**                           | `yarn test:e2e:ui`                   |
| **Test: E2E (Desktop)**                      | `yarn test:e2e:desktop`              |
| **Test: E2E (Mobile)**                       | `yarn test:e2e:mobile`               |
| **Experience Sync: Start Editor**            | `yarn exp:ui`                        |
| **Experience Sync: Generate Portfolio Data** | `yarn exp:generate`                  |
| **Experience Sync: Sync All Exports**        | `yarn exp:sync`                      |
