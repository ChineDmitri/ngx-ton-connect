// ESLint flat config for workspace
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const alignAssignments = require('eslint-plugin-align-assignments');

module.exports = [
  {
    files: ['**/*.ts'],
    ignores: ['dist/**', 'out-tsc/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: [
          "projects/ngx-ton-connect/src/tsconfig.lib.json",
          "projects/ngx-demo-ton-connect/tsconfig.app.json"
        ],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'align-assignments': alignAssignments,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'align-assignments/align-assignments': 'warn',
    },
  },
];
