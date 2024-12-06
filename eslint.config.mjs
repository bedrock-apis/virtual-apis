import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['src/**/*.{js,mjs,cjs,ts}'] },
  jseslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
    },
  },
];
