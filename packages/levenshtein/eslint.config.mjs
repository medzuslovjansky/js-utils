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
    },
  },
);
