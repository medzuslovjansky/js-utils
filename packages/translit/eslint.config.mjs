import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'rollup.config.js'] },
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
      // A warning, not an error: it fires on the `let x = ''` placeholders
      // in transliterate.ts.
      'no-useless-assignment': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
);
