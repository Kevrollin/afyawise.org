// @ts-check
import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      'dist/',
      '.astro/',
      '.vercel/',
      'node_modules/',
      'audit/',
      'qa/',
      'test-results/',
      'playwright-report/',
      '.lighthouseci/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-strict'],
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['info', 'warn', 'error', 'log', 'table'] }],
    },
  },
  {
    // Tooling scripts run in Node and print progress.
    files: ['scripts/**/*.mjs'],
    rules: { 'no-console': 'off' },
  },
);
