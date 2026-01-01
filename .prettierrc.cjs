/**
 * Prettier will read RC files, you can set your prettier rules here
 */

const baseLintingPath = '{,!(node_modules|dist|build|coverage|.git|reports)/**/}'
module.exports = {
  overrides: [
    {
      files: `${baseLintingPath}*.yaml`,
      options: {
        parser: 'yaml',
      },
    },
    {
      files: `${baseLintingPath}*.scss`,
      options: {
        parser: 'scss',
      },
    },
    {
      files: `${baseLintingPath}*.json`,
      options: {
        parser: 'json',
      },
    },
    {
      files: `${baseLintingPath}*.{ts,tsx}`,
      options: {
        parser: 'typescript',
      },
    },
    {
      files: 'package.json',
      options: {
        parser: 'json-stringify',
      },
    },
  ],
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  printWidth: 140,
  tabWidth: 2,
  proseWrap: 'always',
  semi: false,
  bracketSpacing: true,
  jsxSingleQuote: false,
  bracketSameLine: false,
  endOfLine: 'lf',
  quoteProps: 'as-needed',
  htmlWhitespaceSensitivity: 'css',
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^react$',
    '<THIRD_PARTY_MODULES>',
    '^components/(.*)$',
    '^assets/(.*)$',
    '^data/(.*)$',
    '^hooks/(.*)$',
    '^styles/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
}
