/**
 * Triple-Slash Directives for Global Type Definitions
 *
 * These lines use TypeScript's triple-slash directive syntax (///) to explicitly include
 * type definitions from external packages. They are NOT comments - they're functional TypeScript code.
 *
 * What each directive does:
 * - react: Includes React's type definitions (JSX, components, hooks, etc.)
 * - react-dom: Includes ReactDOM's type definitions (DOM-specific React features)
 * - vite/client: Includes Vite's client-side types (import.meta.env, HMR API, asset imports)
 *
 * These directives ensure TypeScript knows about these types globally throughout the project.
 */
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="vite/client" />

/**
 * Node.js Environment Variable Type Augmentation
 *
 * This augments the NodeJS.ProcessEnv interface to provide strict typing for process.env.NODE_ENV.
 * It restricts NODE_ENV to only be 'development', 'production', or 'test'.
 *
 * Note: This is currently NOT used in the codebase. The project uses Vite's import.meta.env
 * instead of Node's process.env for accessing environment variables in browser code.
 * This declaration might be useful if you add Node.js scripts or tests that access process.env.
 */
// declare namespace NodeJS {
//   interface ProcessEnv {
//     NODE_ENV: 'development' | 'production' | 'test'
//   }
// }

/**
 * View Transitions API Type Definition
 *
 * This augments the Document interface to include the View Transitions API, which provides
 * smooth animated transitions between DOM states. This is a modern browser API that may not
 * be available in all browsers (currently supported in Chromium-based browsers).
 *
 * The API is used throughout the codebase for:
 * - Theme transitions (useTheme.ts): Smooth animations when switching between light/dark modes
 * - Modal animations (useModal.ts): Animated modal open/close transitions
 *
 * The optional (?) modifier indicates this API may not exist in all browsers.
 * Use supportsViewTransitions() from viewTransitionsUtils.ts to check browser support.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API
 */
interface Document {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    ready: Promise<void>
    updateCallbackDone: Promise<void>
    finished: Promise<void>
    skipTransition: () => void
  }
}
