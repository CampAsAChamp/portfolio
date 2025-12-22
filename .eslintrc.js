module.exports = {
  extends: ['react-app', 'react-app/jest', 'plugin:jsx-a11y/recommended', 'plugin:eslint-comments/recommended', 'prettier'],
  plugins: ['unused-imports', 'eslint-comments', 'prettier'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    // Prettier integration
    'prettier/prettier': 'error',

    // React Hooks
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Unused imports
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],

    // Code quality
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'warn',

    // Best practices
    eqeqeq: ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-template': 'warn',
    'prefer-arrow-callback': 'warn',

    // React specific
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'warn',
    'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],

    // Import rules
    'import/no-relative-parent-imports': 'off', // Disabled - false positives with jsconfig.json baseUrl
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/named': 'error',
    'import/default': 'error',
    'import/namespace': 'error',
    'import/no-unresolved': 'off',
    'import/order': 'off', // Disabled - using Prettier's import sorting plugin instead
  },
}
