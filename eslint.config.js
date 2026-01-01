import js from "@eslint/js"
import typescript from "@typescript-eslint/eslint-plugin"
import typescriptParser from "@typescript-eslint/parser"
import prettier from "eslint-config-prettier"
import eslintComments from "eslint-plugin-eslint-comments"
import jsxA11y from "eslint-plugin-jsx-a11y"
import prettierPlugin from "eslint-plugin-prettier"
import react from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"
import unusedImports from "eslint-plugin-unused-imports"
import globals from "globals"

export default [
  // Ignore patterns (replaces .eslintignore)
  {
    ignores: ["node_modules/**", "build/**", "dist/**", "**/*.js", "**/*.cjs", "**/*.mjs"],
  },

  // Base configuration for all files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.json", "./tsconfig.test.json"],
        ecmaFeatures: {
          jsx: true,
        },
        jsxPragma: null, // for TypeScript with React 17+ JSX transform
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
        React: "writable",
        JSX: "readonly",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {},
        node: {
          paths: ["src"],
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react,
      "react-hooks": reactHooks,
      "unused-imports": unusedImports,
      "eslint-comments": eslintComments,
      prettier: prettierPlugin,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      // ESLint recommended
      ...js.configs.recommended.rules,

      // TypeScript recommended
      ...typescript.configs.recommended.rules,
      ...typescript.configs["recommended-requiring-type-checking"].rules,

      // React recommended
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,

      // React Hooks recommended
      ...reactHooks.configs.recommended.rules,

      // JSX A11y recommended
      ...jsxA11y.configs.recommended.rules,

      // ESLint Comments recommended
      ...eslintComments.configs.recommended.rules,

      // Prettier (must be last to override other formatting rules)
      ...prettier.rules,

      // Custom rules
      // Disable no-undef for TypeScript files (TypeScript handles this better)
      "no-undef": "off",

      // Prettier integration
      "prettier/prettier": "error",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // TypeScript - Explicit types
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
          allowExpressions: false, // Require return types even on arrow function expressions (including callbacks)
          allowTypedFunctionExpressions: true, // Allow if function type is already defined elsewhere
          allowHigherOrderFunctions: false, // Require return types on functions that return functions
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: false,
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": [
        "error",
        {
          allowArgumentsExplicitlyTypedAsAny: false, // Don't allow 'any' as explicit type
          allowDirectConstAssertionInArrowFunctions: true,
          allowHigherOrderFunctions: true,
          allowTypedFunctionExpressions: true,
        },
      ],

      // Unused imports (TypeScript)
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // Code quality
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-alert": "warn",

      // Best practices
      eqeqeq: ["error", "always"],
      "no-var": "error",
      "prefer-const": "error",
      "prefer-template": "warn",
      "prefer-arrow-callback": "warn",

      // React specific
      "react/prop-types": "off", // Using TypeScript interfaces for type safety instead of PropTypes
      "react/react-in-jsx-scope": "off", // Not needed with React 18+ new JSX transform (jsx-runtime)
      "react/self-closing-comp": "warn",
      "react/jsx-curly-brace-presence": ["warn", { props: "never", children: "never" }],
    },
  },

  // Test-specific configuration
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}", "tests/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/unbound-method": "off", // Allow Vitest mock assertions
    },
  },
]
