import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      parserOptions: {
        project: 'tsconfig.lint.json',
        // Pins tsconfig.lint.json to this package no matter where eslint
        // was started from.
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Jan van Steenbergen's declension and conjugation algorithms, ported
    // rather than rewritten: they seed a result and reassign it down a chain of
    // conditions. Untangling that buys nothing and risks the forms.
    files: [
      'src/inflect/*/declension.ts',
      'src/inflect/verb/conjugation.ts',
    ],
    rules: { 'no-useless-assignment': 'off' },
  },
  {
    files: ['**/*.test.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
);
