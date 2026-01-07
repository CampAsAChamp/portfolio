module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    // Allow CSS variables (custom properties)
    'custom-property-pattern': null,
    'selector-class-pattern': null,
    'selector-id-pattern': null,

    // Allow @import for modular CSS
    'import-notation': null,

    // Allow vendor prefixes (sometimes needed for compatibility)
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,

    // Allow empty sources (some CSS files might be placeholders)
    'no-empty-source': null,

    // Relaxed rules for better DX
    'declaration-empty-line-before': null,
    'rule-empty-line-before': [
      'always',
      {
        except: ['first-nested'],
        ignore: ['after-comment'],
      },
    ],

    // Allow animate.css class names
    'selector-class-pattern': null,

    // Allow descendant selectors (common in component CSS)
    'selector-max-compound-selectors': null,
    'selector-max-specificity': null,

    // Color format
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',

    // Allow important (sometimes needed for overrides)
    'declaration-no-important': null,

    // Font family names
    'font-family-name-quotes': 'always-unless-keyword',

    // Media queries
    'media-feature-range-notation': 'prefix',
  },
  ignoreFiles: ['build/**', 'dist/**', 'node_modules/**'],
}










