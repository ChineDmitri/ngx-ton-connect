module.exports = {
  root: true,
  ignorePatterns: ['dist/', 'out-tsc/', '*.js'],
  parserOptions: { ecmaVersion: 2022, sourceType: 'module', project: ['tsconfig.json'] },
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'align-assignments'],
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      rules: {
        'align-assignments/align-assignments': [
          'warn',
          { requiresOnly: false, align: 'value', maxSpaces: 1 },
        ],
      },
    },
  ],
};
